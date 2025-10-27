import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import waterRoutes from "./routes/waterRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
console.log("🔗 Mongo URI:", uri ? "Loaded" : "Missing!");

mongoose
  .connect(uri)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB error:", err));

app.get("/", (req, res) => res.send("💧 SafeWater API running..."));

app.use("/api/auth", authRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/alerts", alertRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
