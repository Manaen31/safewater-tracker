import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["household", "ngo", "admin"], default: "household" },
});

export default mongoose.model("User", userSchema);
