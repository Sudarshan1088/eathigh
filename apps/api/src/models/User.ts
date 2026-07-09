import mongoose, { Schema, Document } from "mongoose";
import type { DietaryGoal } from "@eathigh/shared";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  dietaryGoal: string;
  dietaryGoals: DietaryGoal[];
  scanHistory: {
    barcode: string;
    productName: string;
    brands: string;
    healthScore: number;
    imageUrl: string;
    scannedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const dietaryGoalSchema = new Schema<DietaryGoal>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    prioritize: [{ type: String }],
    penalize: [{ type: String }],
    calorieTarget: { type: Number },
  },
  { _id: false }
);

const scanHistoryEntrySchema = new Schema(
  {
    barcode: { type: String, required: true },
    productName: { type: String, default: "Unknown" },
    brands: { type: String, default: "" },
    healthScore: { type: Number, default: 0 },
    imageUrl: { type: String, default: "" },
    scannedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    dietaryGoal: {
      type: String,
      default: 'general',
      required: true,
    },
    dietaryGoals: {
      type: [dietaryGoalSchema],
      default: [],
    },
    scanHistory: {
      type: [scanHistoryEntrySchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
