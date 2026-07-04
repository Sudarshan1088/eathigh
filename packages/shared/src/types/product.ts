/** Nutriment values as returned by OpenFoodFacts (per 100g/100ml). */
export interface Nutriments {
  "energy-kcal_100g"?: number;
  fat_100g?: number;
  "saturated-fat_100g"?: number;
  sugars_100g?: number;
  proteins_100g?: number;
  fiber_100g?: number;
  sodium_100g?: number;
  "vitamin-c_100g"?: number;
  iron_100g?: number;
  "trans-fat_100g"?: number;
  [key: string]: number | undefined;
}

/** Normalized product data extracted from the OpenFoodFacts response. */
export interface Product {
  barcode: string;
  product_name: string;
  brands: string;
  image_front_small_url: string;
  image_front_url: string;
  serving_size: string;
  nutriments: Nutriments;
  ingredients_text: string;
  nutriscore_grade?: string;
  categories?: string;
}

/** Raw OpenFoodFacts API response shape. */
export interface OpenFoodFactsResponse {
  status: 0 | 1;
  status_verbose: string;
  product?: Record<string, unknown>;
}

/** The result returned to the frontend after a scan. */
export interface ScanResult {
  product: Product;
  healthScore: number;
  aiSummary: string;
  cached: boolean;
}
