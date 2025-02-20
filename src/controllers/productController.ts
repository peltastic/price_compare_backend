import { Request, Response } from "express";
import Product from "../models/ProductModel";

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
        store
      } = req.body;
  
      // Validate store fields
      if (!product_id) {
        return res.status(400).json({ message: 'Store details are required' });
      }
  
      // Create a new product
      const product = new Product({
        product_id,
        product_name,
        category,
        brand,
        price,
        availability,
        average_rating,
        number_of_reviews,
        url,
        store
      });
  
      // Save the product to the database
      await product.save();
  
      res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
      res.status(500).json({ message: 'Error creating product', error });
    }
  };

  export const getProducts = async (req: Request, res: Response): Promise<any> => {
    try {
      const { search, min_rating } = req.query;
      
      const filter: any = {};
      if (search) {
        filter.product_name = { $regex: search, $options: 'i' };
      }
      if (min_rating) {
        filter.average_rating = { $gte: Number(min_rating) };
      }
  
      const products = await Product.find(filter);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
    }
  };
  