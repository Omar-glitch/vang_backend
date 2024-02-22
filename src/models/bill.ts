import mongoose, { Document, Schema } from "mongoose";

export type BillDocument = Document & {
  amount: number;
  paid: number;
  id_repair: Schema.Types.ObjectId;
};

const billSchema = new Schema(
  {
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
