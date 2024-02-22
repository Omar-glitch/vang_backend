import mongoose, { Document, Schema } from "mongoose";

export type PurchaseDocument = Document & {
  type: string;
  description: string;
  cost: number;
};

const purchaseSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ["inventario", "equipo"],
      minLength: 3,
      maxLength: 32,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 120,
    },
    cost: {
      type: Number,
      required: true,
      min: 20,
      max: 1_000_000,
    },
  },
  {
    versionKey: false,
  }
);

const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;
