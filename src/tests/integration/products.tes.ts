import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../index"; // Import your Express app
import Product from "../../models/ProductModel";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect Mongoose to in-memory database
    await mongoose.connect(mongoUri);
});

afterEach(async () => {
    // Clear database after each test
    await Product.deleteMany();
});

afterAll(async () => {
    // Close MongoDB connection and stop in-memory server
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe("POST /api/products", () => {
    it("should create a new product and return 201", async () => {
        const newProduct = {
            product_id: "12345",
            product_name: "Test Product",
            category: "Electronics",
            brand: "Test Brand",
            price: 100,
            availability: true,
            average_rating: 4.5,
            number_of_reviews: 10,
            url: "http://example.com/product",
            store: {
                name: "Test Store",
                website_url: "http://teststore.com",
                location: "Test Location",
            },
        };

        const res = await request(app).post("/api/products").send(newProduct);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("message", "Product created successfully");
        expect(res.body.product).toMatchObject(newProduct);

        // Verify product is stored in DB
        const productInDb = await Product.findOne({ product_id: "12345" });
        expect(productInDb).not.toBeNull();
        expect(productInDb?.product_name).toBe("Test Product");
    });

    it("should return 400 if required fields are missing", async () => {
        const res = await request(app).post("/api/products").send({
            product_name: "Incomplete Product",
        });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message", "Store details are required");
    });
});
