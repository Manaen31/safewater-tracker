import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import usageRoutes from './routes/usageRoutes.js';

dotenv.config();

const app = express();

// Enable CORS for frontend access
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// API routes
app.use('/api/usage', usageRoutes);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));