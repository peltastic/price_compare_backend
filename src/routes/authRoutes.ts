import express from "express";
import { register, login, getProfile } from "../controllers/authControllers";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/register",
  register
);
router.post("/login", login);
router.get("/profile", authenticate, getProfile);

export default router;
