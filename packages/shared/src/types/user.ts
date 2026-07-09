/** A single dietary goal configured by the user. */
export interface DietaryGoal {
  id: string;
  name: string;
  description: string;
  /** Nutrient keys to reward (e.g., "proteins_100g", "fiber_100g"). */
  prioritize: string[];
  /** Nutrient keys to penalize (e.g., "sugars_100g", "sodium_100g"). */
  penalize: string[];
  calorieTarget?: number;
}

/** User profile stored in the database. */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  dietaryGoal: string;
  dietaryGoals: DietaryGoal[]; // Kept for legacy/array structures
  createdAt: string;
  updatedAt: string;
}

/** Shape of the JWT payload. */
export interface JwtPayload {
  userId: string;
  email: string;
}

/** Response from login / register endpoints. */
export interface AuthResponse {
  user: UserProfile;
  accessToken: string;
}

/** Body for registration requests. */
export interface RegisterBody {
  name?: string; // Optional since the prompt wizard doesn't collect name explicitly
  email: string;
  password: string;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  dietaryGoal: string;
}

/** Body for login requests. */
export interface LoginBody {
  email: string;
  password: string;
}

/** Body for profile update requests. */
export interface UpdateProfileBody {
  name?: string;
  dietaryGoals?: DietaryGoal[];
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
}

/** Preset dietary goals that users can pick from. */
export const DIETARY_PRESETS: Omit<DietaryGoal, "id">[] = [
  {
    name: "High Protein",
    description: "Prioritizes protein-rich foods for muscle building.",
    prioritize: ["proteins_100g", "iron_100g"],
    penalize: ["sugars_100g", "saturated-fat_100g"],
  },
  {
    name: "Low Sodium",
    description: "Reduces sodium intake for heart health.",
    prioritize: ["fiber_100g", "proteins_100g"],
    penalize: ["sodium_100g", "saturated-fat_100g"],
  },
  {
    name: "Keto",
    description: "Low-carb, high-fat diet for ketosis.",
    prioritize: ["fat_100g", "proteins_100g"],
    penalize: ["sugars_100g"],
    calorieTarget: 2000,
  },
  {
    name: "Low Sugar",
    description: "Minimizes sugar consumption for metabolic health.",
    prioritize: ["fiber_100g", "proteins_100g"],
    penalize: ["sugars_100g"],
  },
  {
    name: "Balanced",
    description: "A well-rounded diet with no extreme restrictions.",
    prioritize: ["proteins_100g", "fiber_100g", "vitamin-c_100g"],
    penalize: ["sugars_100g", "sodium_100g", "saturated-fat_100g", "trans-fat_100g"],
  },
];
