import mongoose, { Schema, Document } from "mongoose";

// Define the Product interface
interface IProduct extends Document {
  product_id: string;
  product_name: string;
  category: string;
  brand: string;
  price: number;
  availability: boolean;
  average_rating: number;
  number_of_reviews: number;
  url: string;
  store: {
    name: string
    website_url: string
    location: string
  }
}

// Define the Product schema
const ProductSchema: Schema = new Schema<IProduct>(
  {
    product_id: { type: String, required: true, trim: true },
    product_name: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    brand: { type: String, trim: true },
    number_of_reviews: { type: Number, trim: true },
    url: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    availability: { type: Boolean, default: true },
    average_rating: { type: Number, default: 0, min: 0, max: 5 },
    store: {
        name: { type: String,  trim: true },
        website_url: { type: String, trim: true },
        location: { type: String, trim: true },
      },
  },
  {
    timestamps: true,
  }
);

// Create and export the Product model
const Product = mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
