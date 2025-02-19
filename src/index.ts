import express, {Request, Response} from "express"
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";

const app = express()
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";

app.use(express.json());
app.use(cors());


app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});