import { getGeminiClient } from "../config/gemini.js";
import { calculateFallbackScore } from "./scoringService.js";
import type { Product } from "@eathigh/shared";
import type { IUser } from "../models/User.js";

export interface AIAnalysisResult {
  healthScore: number;
  summary: string;
}

/**
 * Sends the product's nutritional data and user biometrics to Gemini
 * and returns a highly personalized health score (0-10) + summary.
 */
export async function analyzeNutrition(
  product: Product,
  user: IUser | null
): Promise<AIAnalysisResult> {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

    let personalizationSection = "";
    if (user) {
      personalizationSection = `
    PATIENT BIOMETRIC PROFILE:
    - Biological Sex: ${user.gender}
    - Body Weight: ${user.weight} kg
    - Height: ${user.height} cm
    - Active Dietary Goal: ${user.dietaryGoal.toUpperCase()}

    CLINICAL EVALUATION TASK:
    Provide a concise, highly personalized 3-sentence health evaluation of this product specifically tailored to THIS patient's body mass and metabolic goal.
    1. State clearly whether this product supports or hinders their ${user.dietaryGoal} goal given their ${user.weight}kg body mass.
    2. Highlight one specific macro (protein, sugar, fat, or sodium) and explain its exact physiological impact on a ${user.gender} of their specific weight/height.
    3. Conclude with a definitive clinical recommendation: Eat freely, consume in moderation, or strictly avoid.
    
    Do not use generic advice. Refer implicitly to their biometric thresholds without sounding robotic.`;
    } else {
      personalizationSection = `
    CLINICAL EVALUATION TASK:
    Provide a concise 3-sentence health evaluation of this product based on standard healthy limits.`;
    }

    const prompt = `You are an expert clinical nutritionist AI for the app EatHigh. Analyze this food product and provide:
1. A health score from 0 to 10 (0 = extremely unhealthy, 10 = excellent).
2. A conversational summary following the clinical evaluation task.

Product Name: ${product.product_name || "Unknown"}
Brand: ${product.brands || "Unknown"}
Ingredients: ${product.ingredients_text || "Not available"}
Nutrients per 100g: ${JSON.stringify(product.nutriments, null, 2)}
Nutri-Score Grade: ${product.nutriscore_grade || "N/A"}
Categories: ${product.categories || "N/A"}
${personalizationSection}

IMPORTANT: Respond ONLY with valid JSON in this exact format, no markdown:
{"healthScore": <number 0-10>, "summary": "<string>"}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip markdown fences if present
    const cleaned = text.replace(/```json\s*/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned) as AIAnalysisResult;

    // Clamp score to 0-10
    parsed.healthScore = Math.max(0, Math.min(10, Math.round(parsed.healthScore * 10) / 10));

    return parsed;
  } catch (error) {
    console.error("Gemini AI analysis failed:", error instanceof Error ? error.message : error);
    // Fallback to dynamic math score
    return calculateFallbackScore(product, user);
  }
}
