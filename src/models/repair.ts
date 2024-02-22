import mongoose, { Document, Schema } from "mongoose";

export type RepairDocument = Document & {
  price: number;
  description: string;
  status: string;
  type: string;
  id_empleado: Schema.Types.ObjectId;
  id_cliente: Schema.Types.ObjectId;
  item: {
    id_item: Schema.Types.ObjectId;
    amount: number;
    cost: number;
  };
};

const Item = new Schema({
  id_item: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
    set: (v: number) => Math.round(v),
  },
  cost: {
    type: Number,
    required: true,
    set: (v: number) => Math.round(v),
  },
});

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
      enum: ["no iniciado", "en progreso", "finalizado"],
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
        "activación",
      ],
    },
    items: {
      type: [Item],
      min: 1,
      max: 5,
    },
    id_empleado: { type: Schema.Types.ObjectId },
    id_cliente: {
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
