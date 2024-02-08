import mongoose, { Schema } from "mongoose";

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minLength: 3,
      maxLength: 32,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      maxLength: 54,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    role: {
      type: String,
      required: true,
      enum: ["reparador", "finanzas", "admin", "user"],
    },
    phone: {
      type: String,
      trim: true,
      match: /^\d{4}-\d{4}$/,
      required: true,
    },
    age: { type: Number, required: true, min: 16, max: 80 },
    direction: {
      type: String,
      trim: true,
      minLength: 6,
      maxLength: 100,
    },
  },
  {
    versionKey: false,
  }
);

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
