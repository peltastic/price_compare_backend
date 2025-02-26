import { Request, Response } from 'express';
import Product  from '../models/ProductModel';
import { jest } from '@jest/globals';

type MockResponse = {
    status: jest.Mock;
    json: jest.Mock;
};

const mockRequest = (data: any = {}): Partial<Request> => ({
    body: data.body || {},
    params: data.params || {},
    query: data.query || {},
});

const mockResponse = (): MockResponse => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

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

        if (!product_id) {
            return res.status(400).json({ message: 'Store details are required' });
        }

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

        await product.save();

        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error });
    }
};

describe('createProduct', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a product successfully and return 201', async () => {
        const req = mockRequest({
            body: {
                product_id: '12345',
                product_name: 'Test Product',
                category: 'Electronics',
                brand: 'Test Brand',
                price: 100,
                availability: 'In Stock',
                average_rating: 4.5,
                number_of_reviews: 10,
                url: 'http://example.com/product',
                store: 'Test Store'
            }
        });
        const res = mockResponse();

        jest.spyOn(Product.prototype, 'save').mockResolvedValueOnce({} as any);

        await createProduct(req as Request, res as unknown as Response);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Product created successfully' })
        );
    });

    it('should return 400 if product_id is missing', async () => {
        const req = mockRequest({ body: { product_name: 'Test Product' } });
        const res = mockResponse();

        await createProduct(req as Request, res as unknown as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Store details are required' });
    });

    it('should return 500 if there is an error', async () => {
        const req = mockRequest({
            body: {
                product_id: '12345',
                product_name: 'Test Product',
                category: 'Electronics',
                brand: 'Test Brand',
                price: 100,
                availability: 'In Stock',
                average_rating: 4.5,
                number_of_reviews: 10,
                url: 'http://example.com/product',
                store: 'Test Store'
            }
        });
        const res = mockResponse();

        jest.spyOn(Product.prototype, 'save').mockRejectedValueOnce(new Error('DB Error'));

        await createProduct(req as Request, res as unknown as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Error creating product' })
        );
    });
});
