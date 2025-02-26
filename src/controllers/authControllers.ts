import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Generate JWT token
const generateToken = (user: IUser) => {
  return jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, username } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });
    const user = new User({
      email,
      password,
      username,
    });
    await user.save();
    res.status(201).json({
      message: `user registered successfully`,
      token: generateToken(user),
      data: {
        user: {
          id: user._id,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.json({
      token: generateToken(user),
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,

        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const user = await User.findById(req.userId).select(["email", "username"]);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};