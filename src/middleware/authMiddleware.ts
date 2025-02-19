import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export interface AuthRequest extends Request {
  userId?: string;
  role?: string;
}

// Auth Middleware
export const authenticate = async(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
    };
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

// Role Middleware
export const authorize =
  (roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.role!)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
