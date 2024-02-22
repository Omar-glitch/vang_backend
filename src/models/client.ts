import mongoose, { Document, Schema } from "mongoose";

export type ClientDocument = Document & {
  name: string;
  contact: string;
};

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minLength: 3,
      maxLength: 32,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minLength: 3,
      maxLength: 52,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Client = mongoose.model("Client", clientSchema);
export default Client;
