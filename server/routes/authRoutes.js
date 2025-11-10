import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";

const router = express.Router();

// --- REGISTER ---
router.post(
  "/register",
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: "Invalid input", errors: errors.array() });

    try {
      const { name, email, password, role, region } = req.body;

      // Check if user already exists
      if (await User.findOne({ email }))
        return res.status(400).json({ message: "Email already registered" });

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "household",
        region
      });

      res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          region: user.region
        }
      });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// --- LOGIN ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        region: user.region
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- VALIDATE TOKEN ---
router.get("/validate", async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ valid: false });

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.json({ valid: true, userId: decoded.id, role: decoded.role });
  } catch {
    res.status(401).json({ valid: false });
  }
});

export default router;
