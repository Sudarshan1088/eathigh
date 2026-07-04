import type { Product } from "@eathigh/shared";

const OFF_BASE_URL = "https://world.openfoodfacts.org/api/v0/product";

interface OFFApiResponse {
  status: 0 | 1;
  status_verbose: string;
  product?: Record<string, unknown>;
}

/**
 * Fetches product data from OpenFoodFacts by barcode.
 * Returns a normalized Product object or null if not found.
 */
export async function fetchProductFromOFF(barcode: string): Promise<Product | null> {
  const url = `${OFF_BASE_URL}/${barcode}.json`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "EatHigh/1.0 (https://eathigh.vercel.app)",
    },
  });

  if (!response.ok) {
    throw new Error(`OpenFoodFacts API error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as OFFApiResponse;

  if (data.status !== 1 || !data.product) {
    return null;
  }

  const p = data.product;

  return {
    barcode,
    product_name: (p.product_name as string) || "Unknown Product",
    brands: (p.brands as string) || "",
    image_front_small_url: (p.image_front_small_url as string) || "",
    image_front_url: (p.image_front_url as string) || "",
    serving_size: (p.serving_size as string) || "100g",
    nutriments: (p.nutriments as Product["nutriments"]) || {},
    ingredients_text: (p.ingredients_text as string) || "",
    nutriscore_grade: (p.nutriscore_grade as string) || "",
    categories: (p.categories as string) || "",
  };
}
