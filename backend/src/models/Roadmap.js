import mongoose from "mongoose";

const RoadmapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String },
  role: { type: String },
  level: { type: String },
  topics: [{ type: String }],
  weakTopics: [{ type: String }],
  modules: { type: Array, default: [] },
  calendar: { type: Array, default: [] },
  totalWeeks: { type: Number, default: 0 },
}, { timestamps: true });

const Roadmap = mongoose.model("Roadmap", RoadmapSchema);

export default Roadmap;
