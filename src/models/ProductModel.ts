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
  image_url: string;
  store: {
    name: string;
    website_url: string;
    location: string;
  };
}

// Define the Product schema
const ProductSchema: Schema = new Schema<IProduct>(
  {
    product_id: { type: String, required: true, trim: true, unique: true }, // Ensuring uniqueness
    product_name: { type: String, required: true, trim: true },
    category: { type: String, trim: true, required: true },
    brand: { type: String, trim: true, default: "Unknown" },
    price: { type: Number, required: true, min: 0 }, // Ensuring price is non-negative
    availability: { type: Boolean, default: true }, // Default availability is true
    average_rating: { type: Number, default: 0, min: 0, max: 5 }, // Ratings between 0-5
    number_of_reviews: { type: Number, default: 0, min: 0 }, // Ensuring reviews are non-negative
    url: { type: String, required: true, trim: true },
    image_url: { type: String, required: true, trim: true }, // Added Image URL field
    store: {
      name: { type: String, required: true, trim: true },
      website_url: { type: String, required: true, trim: true },
      location: { type: String, required: true, trim: true },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Product model
const Product = mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
