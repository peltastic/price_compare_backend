import express from "express";
import {
  createProduct,
  createProducts,  // ✅ Added bulk insert function
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

const router = express.Router();

router.post("/", createProduct); // Create a single product
router.post("/bulk-create", createProducts); // ✅ Bulk insert multiple products
router.get("/", getProducts); // Get all products
router.get("/:id", getProductById); // Get single product by ID
router.put("/:id", updateProduct); // Update product
router.delete("/:id", deleteProduct); // Delete product

export default router;
