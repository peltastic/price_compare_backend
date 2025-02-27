import { Request, Response } from "express";
import Product from "../models/ProductModel";

// ✅ Create a New Product
export const createProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      product_id,
      product_name,
      category,
      brand,
      price,
      availability,
      average_rating,
      number_of_reviews,
      url,
      image_url,
      store
    } = req.body;

    // ✅ Validate required fields
    if (!product_id || !product_name || !price || !category || !url || !store) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Check if the product already exists (Prevent duplicates)
    const existingProduct = await Product.findOne({ product_id });
    if (existingProduct) {
      return res.status(409).json({ message: "Product already exists" });
    }

    // ✅ Create a new product
    const product = new Product({
      product_id,
      product_name,
      category,
      brand: brand || "Unknown",
      price,
      availability: availability !== undefined ? availability : true,
      average_rating: average_rating || 0,
      number_of_reviews: number_of_reviews || 0,
      url,
      image_url: image_url || "",
      store
    });

    // ✅ Save the product to the database
    await product.save();

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error: any) {
    res.status(500).json({ message: "Error creating product", error: error.message || error });
  }
};

// ✅ Get All Products with Search & Filters
export const getProducts = async (req: Request, res: Response): Promise<any> => {
  try {
    const { search, min_rating } = req.query;
    const filter: any = {};

    // ✅ Flexible search across multiple fields
    if (search) {
      const searchRegex = new RegExp(search.toString().trim(), "i");
      filter.$or = [
        { product_name: searchRegex },
        { category: searchRegex },
        { brand: searchRegex }
      ];
    }

    // ✅ Filter by minimum rating (optional)
    if (min_rating) {
      filter.average_rating = { $gte: Number(min_rating) };
    }

    // ✅ Fetch matching products
    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching products", error: error.message || error });
  }
};

// ✅ Get a Single Product by ID
export const getProductById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ product_id: id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching product", error: error.message || error });
  }
};

// ✅ Update Product Details
export const updateProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await Product.findOneAndUpdate(
      { product_id: id },
      updates,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", updatedProduct });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating product", error: error.message || error });
  }
};

// ✅ Delete a Product
export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findOneAndDelete({ product_id: id });

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting product", error: error.message || error });
  }
};
