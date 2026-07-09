import type { Product } from "@eathigh/shared";
import type { IUser } from "../models/User.js";

export interface AIAnalysisResult {
  healthScore: number;
  summary: string;
}

/** 
 * Mathematical scoring algorithm (Fallback when AI is unavailable).
 * Calculates dynamic macro thresholds based on authenticated user's body mass.
 */
export function calculateFallbackScore(product: Product, user: IUser | null): AIAnalysisResult {
  const n = product.nutriments;
  const servingSize = product.serving_size || "100g";
  const match = servingSize.match(/(\d+\.?\d*)\s*(g|ml)/i);
  const factor = match ? parseFloat(match[1]) / 100 : 1;

  const calories = (n["energy-kcal_100g"] ?? 0) * factor;
  const fat = (n.fat_100g ?? 0) * factor;
  const saturatedFat = (n["saturated-fat_100g"] ?? 0) * factor;
  const sugar = (n.sugars_100g ?? 0) * factor;
  const protein = (n.proteins_100g ?? 0) * factor;
  const fiber = (n.fiber_100g ?? 0) * factor;
  const sodium = (n.sodium_100g ?? 0) * factor;
  const transFat = (n["trans-fat_100g"] ?? 0) * factor;

  let score = 10;

  // Basic broad penalties
  if (calories > 300) score -= 2;
  if (fat > 10) score -= 2;
  if (saturatedFat > 3 && saturatedFat <= 6) score -= 2;
  if (saturatedFat > 6) score -= 3;
  if (transFat > 0) score -= 2;
  if (fiber > 3 && fiber <= 6) score += 2;
  if (fiber > 6) score += 3;

  // ── Dynamic Biometric Rules ──
  const weight = user?.weight || 70;
  const gender = user?.gender || 'other';
  const goal = user?.dietaryGoal || 'general';

  // 1. Daily Protein Target
  let Fd = 1.2;
  if (goal === 'high_protein') Fd = 1.8;
  if (goal === 'keto') Fd = 0.8;
  const Tp = weight * Fd;

  // 2. Daily Sugar Limit
  const Ls = 50 * (weight / 70);

  // Apply Protein Reward
  if (protein >= Tp * 0.15) {
    score += 1.5;
  } else if (protein > 5 && protein <= 10) {
    score += 1; // Generic small reward if it didn't hit the massive dynamic target
  }

  // Apply Sugar Penalty
  if (sugar > Ls * 0.40) {
    score -= 2.5;
  } else if (sugar > 10 && sugar <= 20) {
    score -= 1; // Generic small penalty
  }

  // Apply Biometric Sodium Penalty
  if (gender === 'female' && sodium > 0.5) {
    score -= 0.5;
  } else if (sodium > 0.8) {
    score -= 1;
  }

  // Clamp final score strictly between 0.0 and 10.0
  score = Math.max(0, Math.min(10, score));

  return {
    healthScore: Number(score.toFixed(1)),
    summary: "AI analysis is currently unavailable. This score was calculated using a biometric-adjusted mathematical algorithm based on your body mass.",
  };
}
