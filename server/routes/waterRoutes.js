import express from "express";
import WaterUsage from "../models/WaterUsage.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------------
// POST /api/water  → add new usage record
// -------------------------
router.post("/", verifyToken, async (req, res) => {
  try {
    const { litersUsed, region } = req.body;
    const userId = req.user.id;
    const userName = req.user.name || "Unknown"; // ✅ fallback safety

    const newUsage = await WaterUsage.create({
      userId,
      userName,
      litersUsed,
      region: region || "Nairobi",
    });

    res.status(201).json(newUsage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------
// GET /api/water/user/:userId → get usage for a user
// -------------------------
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.role === "household" && req.user.id !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const data = await WaterUsage.find({ userId }).sort({ date: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------
// GET /api/water → (optional) get all for testing
// -------------------------
router.get("/", async (req, res) => {
  try {
    const data = await WaterUsage.find().sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
