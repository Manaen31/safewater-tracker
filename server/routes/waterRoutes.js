import express from "express";
import WaterUsage from "../models/WaterUsage.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create usage entry (protected)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { litersUsed, region } = req.body;
    const userId = req.user.id;
    // read user info from middleware
    const userName = req.user.name || "Unknown";
    const userRegion = region || req.user.region || "Nairobi";

    const newUsage = await WaterUsage.create({
      userId,
      userName,
      litersUsed,
      region: userRegion
    });

    res.status(201).json(newUsage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user usage (protected)
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

// Get all usage (public for testing)
router.get("/", async (req, res) => {
  try {
    const data = await WaterUsage.find().sort({ date: -1 }).limit(200);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
