import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["household","ngo","admin"], default: "household" },
  region: { type: String, default: "Nairobi" } // optional user region
}, { timestamps: true });

export default mongoose.model("User", userSchema);
