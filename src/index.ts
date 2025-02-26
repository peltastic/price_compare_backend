import express, {Request, Response} from "express"
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes"
import productRoutes from "./routes/productsRoute"

const app = express()
const PORT = process.env.PORT || 6000;
const MONGO_URI = process.env.MONGO_URI || "";

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes)
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app