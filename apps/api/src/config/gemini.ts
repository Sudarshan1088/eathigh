import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Product, DietaryGoal } from "@eathigh/shared";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return genAI;
}

export interface AIAnalysisResult {
  healthScore: number;
  summary: string;
}

/**
 * Sends the product's nutritional data and ingredient list to Gemini
 * and returns a health score (0-10) + conversational summary.
 *
 * If the user has dietary goals, they are included in the prompt so
 * the AI can tailor its analysis accordingly.
 */
export async function analyzeNutrition(
  product: Product,
  userGoals?: DietaryGoal[]
): Promise<AIAnalysisResult> {
  try {
    const client = getClient();
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

    const goalsSection = userGoals?.length
      ? `\nThe user has the following dietary goals:\n${userGoals
          .map(
            (g) =>
              `- ${g.name}: prioritize ${g.prioritize.join(", ")}; penalize ${g.penalize.join(", ")}${g.calorieTarget ? `; calorie target: ${g.calorieTarget} kcal/day` : ""}`
          )
          .join("\n")}\nAdjust your scoring and analysis based on these goals.`
      : "";

    const prompt = `You are an expert nutritionist AI. Analyze this food product and provide:
1. A health score from 0 to 10 (0 = extremely unhealthy, 10 = excellent).
2. A 2-3 sentence conversational summary explaining why you gave that score. Highlight specific harmful additives, hidden sugars, or beneficial nutrients. Be direct and informative.

Product Name: ${product.product_name || "Unknown"}
Brand: ${product.brands || "Unknown"}
Ingredients: ${product.ingredients_text || "Not available"}
Nutrients per 100g: ${JSON.stringify(product.nutriments, null, 2)}
Nutri-Score Grade: ${product.nutriscore_grade || "N/A"}
Categories: ${product.categories || "N/A"}
${goalsSection}

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
    console.error("GEMINI_API_KEY loaded:", GEMINI_API_KEY ? `Yes (${GEMINI_API_KEY.substring(0, 8)}...)` : "NO - key is empty!");
    // Fallback to a basic algorithmic score if AI fails
    return fallbackAnalysis(product);
  }
}

/** Fallback scoring algorithm (migrated from the original App.jsx). */
function fallbackAnalysis(product: Product): AIAnalysisResult {
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

  if (calories > 300) score -= 2;
  if (fat > 10) score -= 2;
  if (saturatedFat > 3 && saturatedFat <= 6) score -= 2;
  if (saturatedFat > 6) score -= 3;
  if (transFat > 0) score -= 2;
  if (sugar > 10 && sugar <= 20) score -= 3;
  if (sugar > 20) score -= 4;
  if (sodium > 0.4 && sodium <= 0.8) score -= 1;
  if (sodium > 0.8) score -= 2;

  if (fiber > 3 && fiber <= 6) score += 2;
  if (fiber > 6) score += 3;
  if (protein > 5 && protein <= 10) score += 2;
  if (protein > 10) score += 3;

  score = Math.max(0, Math.min(10, score));

  return {
    healthScore: Number(score.toFixed(1)),
    summary:
      "AI analysis is currently unavailable. This score was calculated using a basic nutritional algorithm based on macronutrient content.",
  };
}
