import { Router } from "express";
import { CachedProduct } from "../models/CachedProduct.js";
import { User } from "../models/User.js";
import { fetchProductFromOFF } from "../utils/fetchProduct.js";
import { analyzeNutrition } from "../services/aiService.js";
import { optionalAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { scanLimiter } from "../middleware/rateLimiter.js";
import type { ApiResponse, ScanResult, Product } from "@eathigh/shared";

const router = Router();

// ── POST /api/scan/:barcode ────────────────────────────────────────
router.post(
  "/:barcode",
  scanLimiter,
  optionalAuth,
  async (req, res): Promise<void> => {
    try {
      const barcode = req.params.barcode as string;

      if (!barcode || !/^\d{8,14}$/.test(barcode)) {
        res.status(400).json({
          success: false,
          error: "Invalid barcode format. Expected 8-14 digits.",
        } satisfies ApiResponse);
        return;
      }

      // ── 1. Check cache ──────────────────────────────────────────
      const cached = await CachedProduct.findOne({ barcode });

      if (cached) {
        const product: Product = {
          barcode: cached.barcode,
          product_name: cached.productName,
          brands: cached.brands,
          image_front_small_url: cached.imageFrontSmallUrl,
          image_front_url: cached.imageFrontUrl,
          serving_size: cached.servingSize,
          nutriments: cached.nutriments,
          ingredients_text: cached.ingredientsText,
          nutriscore_grade: cached.nutriscoreGrade,
          categories: cached.categories,
        };

        // Save to user scan history if authenticated
        await saveScanHistory(req as AuthenticatedRequest, product, cached.aiHealthScore);

        res.json({
          success: true,
          data: {
            product,
            healthScore: cached.aiHealthScore,
            aiSummary: cached.aiSummary,
            cached: true,
          },
        } satisfies ApiResponse<ScanResult>);
        return;
      }

      // ── 2. Fetch from OpenFoodFacts ──────────────────────────────
      const product = await fetchProductFromOFF(barcode);

      if (!product) {
        res.status(404).json({
          success: false,
          error: "Product not found in the OpenFoodFacts database.",
        } satisfies ApiResponse);
        return;
      }

      // ── 3. AI Analysis ───────────────────────────────────────────
      // If user is authenticated, pass their full biometric profile for personalization
      const authReq = req as AuthenticatedRequest;
      let user = null;

      if (authReq.user) {
        // As requested: Fetch fresh user biometrics from Mongoose
        user = await User.findById(authReq.user.userId);
      }

      const aiResult = await analyzeNutrition(product, user);

      // ── 4. Cache the result ──────────────────────────────────────
      await CachedProduct.create({
        barcode: product.barcode,
        productName: product.product_name,
        brands: product.brands,
        imageFrontSmallUrl: product.image_front_small_url,
        imageFrontUrl: product.image_front_url,
        servingSize: product.serving_size,
        nutriments: product.nutriments,
        ingredientsText: product.ingredients_text,
        nutriscoreGrade: product.nutriscore_grade || "",
        categories: product.categories || "",
        aiHealthScore: aiResult.healthScore,
        aiSummary: aiResult.summary,
      });

      // ── 5. Save to user history ──────────────────────────────────
      await saveScanHistory(authReq, product, aiResult.healthScore);

      res.json({
        success: true,
        data: {
          product,
          healthScore: aiResult.healthScore,
          aiSummary: aiResult.summary,
          cached: false,
        },
      } satisfies ApiResponse<ScanResult>);
    } catch (error) {
      console.error("Scan error:", error);
      res.status(500).json({ success: false, error: "Failed to process scan" });
    }
  }
);

/** Helper: save a scan to the authenticated user's history. */
async function saveScanHistory(
  req: AuthenticatedRequest,
  product: Product,
  healthScore: number
): Promise<void> {
  if (!req.user) return;

  try {
    await User.findByIdAndUpdate(req.user.userId, {
      $push: {
        scanHistory: {
          $each: [
            {
              barcode: product.barcode,
              productName: product.product_name,
              brands: product.brands,
              healthScore,
              imageUrl: product.image_front_small_url,
              scannedAt: new Date(),
            },
          ],
          $slice: -100, // Keep only the latest 100 scans
        },
      },
    });
  } catch (error) {
    console.error("Failed to save scan history:", error);
  }
}

export default router;
