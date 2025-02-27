import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productsRoute";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Check if MONGO_URI is provided
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not set in .env file!");
  process.exit(1); // Stop the server if no database connection
}

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Stop the server if connection fails
  });

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
