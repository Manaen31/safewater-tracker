import express from "express";
import WaterUsage from "../models/WaterUsage.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin: all usage
router.get("/all-usage", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const all = await WaterUsage.find().sort({ date: -1 }).limit(1000);
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// NGO: by-area filter (NGO or admin)
router.get("/by-area/:area", verifyToken, async (req, res) => {
  try {
    const { area } = req.params;
    // NGOs may use this; admins also allowed
    if (req.user.role !== "ngo" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    const data = await WaterUsage.find({ region: { $regex: new RegExp(area, "i") } }).sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
