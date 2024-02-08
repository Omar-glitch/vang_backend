import { MongooseError } from "mongoose";

export default function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof MongooseError) return error.message;
  if (error instanceof Error) return error.message;
  return "Algo salió mal";
}
