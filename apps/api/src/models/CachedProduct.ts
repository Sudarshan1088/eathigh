import mongoose, { Schema, Document } from "mongoose";
import type { Nutriments } from "@eathigh/shared";

export interface ICachedProduct extends Document {
  barcode: string;
  productName: string;
  brands: string;
  imageFrontSmallUrl: string;
  imageFrontUrl: string;
  servingSize: string;
  nutriments: Nutriments;
  ingredientsText: string;
  nutriscoreGrade: string;
  categories: string;
  aiHealthScore: number;
  aiSummary: string;
  expiresAt: Date;
  createdAt: Date;
}

const cachedProductSchema = new Schema<ICachedProduct>(
  {
    barcode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    productName: { type: String, default: "Unknown Product" },
    brands: { type: String, default: "" },
    imageFrontSmallUrl: { type: String, default: "" },
    imageFrontUrl: { type: String, default: "" },
    servingSize: { type: String, default: "100g" },
    nutriments: { type: Schema.Types.Mixed, default: {} },
    ingredientsText: { type: String, default: "" },
    nutriscoreGrade: { type: String, default: "" },
    categories: { type: String, default: "" },
    aiHealthScore: { type: Number, default: 0 },
    aiSummary: { type: String, default: "" },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true }
);

export const CachedProduct = mongoose.model<ICachedProduct>(
  "CachedProduct",
  cachedProductSchema
);
