import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

const router = express.Router();

router.post("/", createProduct); // Create product
router.get("/", getProducts); // Get all products
router.get("/:id", getProductById); // Get single product by ID
router.put("/:id", updateProduct); // Update product
router.delete("/:id", deleteProduct); // Delete product

export default router;
