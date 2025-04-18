import mongoose from "mongoose";

const BoxSchema = new mongoose.Schema({
  boxName: { type: String, required: true },
  boxItems: { type: [String], default: [] },
  boxLocation: { type: String },
  boxCategory: { type: String },
  boxNotes: { type: String },
  boxImage: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  boxColor: { type: String },
});

export default mongoose.models.Box || mongoose.model("Box", BoxSchema);
