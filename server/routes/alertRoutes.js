// server/routes/alertRoutes.js
import express from "express";
import WaterUsage from "../models/WaterUsage.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/alerts
 * - Admins: get all regions' average usage
 * - NGOs: get averages for their selected region
 * Calculates average litersUsed per region over last 7 days.
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    // Group by region and compute average
    const pipeline = [
      { $match: { date: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: "$region",
          avgUsage: { $avg: "$litersUsed" },
          totalEntries: { $sum: 1 },
        },
      },
      { $sort: { avgUsage: 1 } },
    ];

    const results = await WaterUsage.aggregate(pipeline);

    // Define a safety threshold (liters)
    const SAFE_THRESHOLD = 50;

    const alerts = results
      .filter((r) => r.avgUsage < SAFE_THRESHOLD)
      .map((r) => ({
        region: r._id,
        avgUsage: r.avgUsage.toFixed(2),
        message: `⚠️ Low average usage (${r.avgUsage.toFixed(
          1
        )} L) detected in ${r._id} — possible shortage.`,
      }));

    res.json({ alerts, last7Days: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
