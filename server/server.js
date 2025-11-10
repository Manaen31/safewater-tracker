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

// --- MIDDLEWARE ---
app.use(cors({
  origin: [process.env.FRONTEND_URL || "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());

// --- DATABASE CONNECTION ---
const uri = process.env.MONGO_URI;
if (!uri) console.error("❌ MONGO_URI not set in .env");

mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// --- ROUTES ---
app.get("/", (req, res) => res.send("💧 SafeWater API running..."));

app.use("/api/auth", authRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/alerts", alertRoutes);

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
