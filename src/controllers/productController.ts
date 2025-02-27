import { Request, Response } from "express";
import Product from "../models/ProductModel";

// ✅ Create a Single Product
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

    // ✅ Convert availability to Boolean
    const isAvailable = availability === "In Stock" ? true : false;

    // ✅ Create a new product
    const product = new Product({
      product_id,
      product_name,
      category,
      brand: brand || "Unknown",
      price,
      availability: isAvailable,
      average_rating: parseFloat(average_rating) || 0,
      number_of_reviews: parseInt(number_of_reviews) || 0,
      url,
      image_url: image_url || "",
      store
    });

    // ✅ Save the product to the database
    await product.save();
    res.status(201).json({ message: "Product created successfully", product });

  } catch (error: unknown) {
    res.status(500).json({ message: "Error creating product", error: (error as Error).message });
  }
};

// ✅ Create Multiple Products (Bulk Insert)
export const createProducts = async (req: Request, res: Response): Promise<any> => {
  try {
    const products = req.body;

    // ✅ Validate Request
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid or empty product list" });
    }

    // ✅ Format Data Before Saving
    const formattedProducts = products.map((product) => ({
      ...product,
      availability: product.availability === "In Stock" ? true : false,
      average_rating: parseFloat(product.average_rating) || 0,
      number_of_reviews: parseInt(product.number_of_reviews) || 0,
    }));

    // ✅ Remove duplicates (Prevent inserting existing products)
    const productIds = formattedProducts.map((product) => product.product_id);
    const existingProducts = await Product.find({ product_id: { $in: productIds } });
    const existingProductIds = existingProducts.map((p) => p.product_id);

    const newProducts = formattedProducts.filter((p) => !existingProductIds.includes(p.product_id));

    if (newProducts.length === 0) {
      return res.status(409).json({ message: "All products already exist" });
    }

    // ✅ Insert the new products
    await Product.insertMany(newProducts);
    res.status(201).json({ message: "Products added successfully", added: newProducts.length });

  } catch (error: unknown) {
    res.status(500).json({ message: "Error adding products", error: (error as Error).message });
  }
};

// ✅ Get All Products with Search & Filters
export const getProducts = async (req: Request, res: Response): Promise<any> => {
  try {
    const { search, min_rating, location } = req.query;
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

    // ✅ Location filter (Allow Nigeria-wide products)
    if (location && location !== "Nigeria") {
      filter.$or = [
        { "store.location": location },
        { "store.location": "Nigeria" } // Include nationwide products
      ];
    }

    // ✅ Fetch products and sort by price
    const products = await Product.find(filter).sort({ price: 1 });

    // ✅ Group products by product_name for price comparison
    const groupedProducts: Record<string, any[]> = {};
    products.forEach((product) => {
      if (!groupedProducts[product.product_name]) {
        groupedProducts[product.product_name] = [];
      }
      groupedProducts[product.product_name].push(product);
    });

    res.status(200).json(groupedProducts);

  } catch (error: unknown) {
    res.status(500).json({ message: "Error fetching products", error: (error as Error).message });
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

  } catch (error: unknown) {
    res.status(500).json({ message: "Error fetching product", error: (error as Error).message });
  }
};

// ✅ Update Product Details
export const updateProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // ✅ Ensure availability is stored as Boolean
    if (updates.availability !== undefined) {
      updates.availability = updates.availability === "In Stock" ? true : false;
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { product_id: id },
      updates,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", updatedProduct });

  } catch (error: unknown) {
    res.status(500).json({ message: "Error updating product", error: (error as Error).message });
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

  } catch (error: unknown) {
    res.status(500).json({ message: "Error deleting product", error: (error as Error).message });
  }
};
