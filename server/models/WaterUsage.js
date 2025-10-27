import mongoose from "mongoose";

const waterUsageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    litersUsed: { type: Number, required: true },
    region: { type: String, default: "Nairobi" }, // used for NGO filters
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("WaterUsage", waterUsageSchema);
