import { Router } from "express";
import { z } from "zod";
import { User } from "../models/User.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import type {
  ApiResponse,
  UserProfile,
  ScanHistoryEntry,
  PaginatedResponse,
} from "@eathigh/shared";

const router = Router();

// All routes require authentication
router.use(requireAuth);

// ── Validation Schemas ─────────────────────────────────────────────
const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  dietaryGoals: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().default(""),
        prioritize: z.array(z.string()),
        penalize: z.array(z.string()),
        calorieTarget: z.number().optional(),
      })
    )
    .optional(),
});

// ── GET /api/user/profile ──────────────────────────────────────────
router.get("/profile", async (req, res): Promise<void> => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ success: false, error: "User not found" } satisfies ApiResponse);
      return;
    }

    const profile: UserProfile = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      dietaryGoals: user.dietaryGoals,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    res.json({ success: true, data: profile } satisfies ApiResponse<UserProfile>);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ── PUT /api/user/profile ──────────────────────────────────────────
router.put(
  "/profile",
  validateBody(updateProfileSchema),
  async (req, res): Promise<void> => {
    try {
      const { userId } = (req as AuthenticatedRequest).user!;
      const updates: Record<string, unknown> = {};

      if (req.body.name) updates.name = req.body.name;
      if (req.body.dietaryGoals) updates.dietaryGoals = req.body.dietaryGoals;

      const user = await User.findByIdAndUpdate(userId, updates, { new: true });

      if (!user) {
        res.status(404).json({ success: false, error: "User not found" } satisfies ApiResponse);
        return;
      }

      const profile: UserProfile = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        dietaryGoals: user.dietaryGoals,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };

      res.json({ success: true, data: profile } satisfies ApiResponse<UserProfile>);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
);

// ── GET /api/user/history ──────────────────────────────────────────
router.get("/history", async (req, res): Promise<void> => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ success: false, error: "User not found" } satisfies ApiResponse);
      return;
    }

    // Reverse so newest first, then paginate
    const allHistory = [...user.scanHistory].reverse();
    const total = allHistory.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const items: ScanHistoryEntry[] = allHistory.slice(start, start + limit).map((entry) => ({
      barcode: entry.barcode,
      productName: entry.productName,
      brands: entry.brands,
      healthScore: entry.healthScore,
      imageUrl: entry.imageUrl,
      scannedAt: entry.scannedAt.toISOString(),
    }));

    res.json({
      success: true,
      data: { items, total, page, limit, totalPages },
    } satisfies ApiResponse<PaginatedResponse<ScanHistoryEntry>>);
  } catch (error) {
    console.error("Get history error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
