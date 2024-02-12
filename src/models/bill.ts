import mongoose, { Schema } from "mongoose";

const billSchema = new Schema(
  {
    amount: {
      type: String,
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
