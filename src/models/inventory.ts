import mongoose, { Document, Schema } from "mongoose";

export type InventoryDocument = Document & {
  name: string;
  description: string;
  type: string;
  stock: number;
  min: number;
};

const inventorySchema = new Schema(
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
    type: {
      type: String,
      required: true,
      enum: [
        "batería",
        "centro de carga",
        "pantalla",
        "tapa trasera",
        "micrófono",
        "placa madre",
        "circuitos integrados",
      ],
    },
    stock: { type: Number, required: true, min: 0, max: 2_500 },
    min: { type: Number, required: true, min: 0, max: 2_500 },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
