import mongoose, { Document, Schema } from "mongoose";

export type RepairDocument = Document & {
  price: number;
  description: string;
  status: string;
  type: string;
  employee: Schema.Types.ObjectId;
  client: Schema.Types.ObjectId;
  inventory: Schema.Types.ObjectId;
  inventory_amount: number;
  inventory_cost: number;
};

export const REPAIR_STATUS = ["no iniciado", "en progreso", "finalizado"];
export const REPAIR_TYPES = [
  "batería",
  "centro de carga",
  "pantalla",
  "tapa trasera",
  "micrófono",
  "placa madre",
  "circuitos integrados",
];

const repairSchema = new Schema(
  {
    price: {
      type: Number,
      required: true,
      min: 50,
      max: 200_000,
      set: (v: number) => Math.round(v),
    },
    description: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 120,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: REPAIR_STATUS,
    },
    type: {
      type: String,
      required: true,
      enum: REPAIR_TYPES,
    },
    inventory: { type: String, required: true, minLength: 3, maxLength: 32 },
    inventory_amount: { type: Number, required: true, min: 1, max: 8 },
    employee: { type: String, requred: true, minLength: 3, maxLength: 32 },
    client: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 32,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Repair = mongoose.model("Repair", repairSchema);
export default Repair;
