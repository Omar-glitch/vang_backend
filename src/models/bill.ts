import mongoose, { Document, Schema } from "mongoose";
import { REPAIR_TYPES } from "./repair";

export type BillDocument = Document & {
  amount: number;
  paid: boolean;
  description: string;
  id_repair: Schema.Types.ObjectId;
  type: string;
};

const billSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
      min: 1,
      max: 222,
    },
    type: {
      type: String,
      required: true,
      enum: REPAIR_TYPES,
    },
    amount: {
      type: Number,
      required: true,
      min: 20,
      max: 1_000_000,
    },
    paid: {
      type: Boolean,
      required: true,
    },
    id_repair: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Bill = mongoose.model("Bill", billSchema);
export default Bill;
