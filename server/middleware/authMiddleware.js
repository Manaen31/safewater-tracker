import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No token provided" });

  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Attach payload data
    req.user = { id: payload.id, role: payload.role };
    // Optionally load user name/region from DB (so routes don't rely on token containing name)
    const user = await User.findById(payload.id).select("name region role");
    if (user) {
      req.user.name = user.name;
      req.user.region = user.region;
    }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const requireRole = (requiredRole) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (req.user.role === "admin") return next(); // admin can do anything
  if (req.user.role !== requiredRole) return res.status(403).json({ message: "Insufficient permissions" });
  next();
};
