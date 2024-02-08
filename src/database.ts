import mongoose from "mongoose";

const ATLAS_URI = process.env.ATLAS_URI;
if (!ATLAS_URI) throw new Error("No ATLAS_URI in .env");

const connectToDatabase = () => {
  return mongoose.connect(ATLAS_URI, { retryWrites: true });
};

export default connectToDatabase;
