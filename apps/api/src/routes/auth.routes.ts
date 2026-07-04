import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User.js";
import { generateToken } from "../middleware/auth.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import type { ApiResponse, AuthResponse, UserProfile } from "@eathigh/shared";

const router = Router();

// ── Validation Schemas ─────────────────────────────────────────────
const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ── Helper ─────────────────────────────────────────────────────────
function toUserProfile(user: InstanceType<typeof User>): UserProfile {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    dietaryGoals: user.dietaryGoals,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

// ── POST /api/auth/register ────────────────────────────────────────
router.post(
  "/register",
  authLimiter,
  validateBody(registerSchema),
  async (req, res): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      const existing = await User.findOne({ email });
      if (existing) {
        res.status(409).json({
          success: false,
          error: "An account with this email already exists",
        } satisfies ApiResponse);
        return;
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      const token = generateToken({ userId: user._id.toString(), email: user.email });

      res.status(201).json({
        success: true,
        data: {
          user: toUserProfile(user),
          accessToken: token,
        },
      } satisfies ApiResponse<AuthResponse>);
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
);

// ── POST /api/auth/login ───────────────────────────────────────────
router.post(
  "/login",
  authLimiter,
  validateBody(loginSchema),
  async (req, res): Promise<void> => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ success: false, error: "Invalid credentials" } satisfies ApiResponse);
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ success: false, error: "Invalid credentials" } satisfies ApiResponse);
        return;
      }

      const token = generateToken({ userId: user._id.toString(), email: user.email });

      res.json({
        success: true,
        data: {
          user: toUserProfile(user),
          accessToken: token,
        },
      } satisfies ApiResponse<AuthResponse>);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
);

// ── GET /api/auth/me ───────────────────────────────────────────────
router.get(
  "/me",
  requireAuth,
  async (req, res): Promise<void> => {
    try {
      const { userId } = (req as AuthenticatedRequest).user!;
      const user = await User.findById(userId);

      if (!user) {
        res.status(404).json({ success: false, error: "User not found" } satisfies ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: toUserProfile(user),
      } satisfies ApiResponse<UserProfile>);
    } catch (error) {
      console.error("Get me error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
);

export default router;
