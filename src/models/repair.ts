import mongoose, { Document, Schema } from "mongoose";

export type RepairDocument = Document & {
  price: number;
  description: string;
  status: string;
  type: string;
  id_employee: Schema.Types.ObjectId;
  id_client: Schema.Types.ObjectId;
  id_inventory: Schema.Types.ObjectId;
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
      min: 8,
      max: 120,
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
    id_inventory: { type: Schema.Types.ObjectId, required: true },
    inventory_amount: { type: Number, required: true, min: 1, max: 8 },
    inventory_cost: { type: Number, required: true, min: 20, max: 120_000 },
    id_employee: { type: Schema.Types.ObjectId, requred: true },
    id_client: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Repair = mongoose.model("Repair", repairSchema);
export default Repair;
