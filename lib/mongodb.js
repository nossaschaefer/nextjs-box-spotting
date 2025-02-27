import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export default async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI);
}
