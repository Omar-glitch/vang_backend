import mongoose, { Document, Schema } from "mongoose";

export type HardwareDocument = Document & {
  name: string;
  description: string;
  stock: number;
  cost: number;
  priority: string;
};

export const HARDWARE_PRIORITIES = ["poco", "medio", "mucho", "indispensable"];

const hardwareSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minLength: 3,
      maxLength: 32,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      maxLength: 54,
    },
    cost: { type: Number, required: true, min: 20, max: 120_000 },
    stock: { type: Number, required: true, min: 0, max: 2_500 },
    priority: {
      type: String,
      required: true,
      enum: HARDWARE_PRIORITIES,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const hardware = mongoose.model("hardware", hardwareSchema);
export default hardware;
