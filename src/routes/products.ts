import express, { Request, Response } from "express";
import productsModel from "../models/products";
import mongoose from "mongoose";

const productsRouter = express.Router();

// Get all products (excluding deleted ones)
productsRouter.get("/products", async (req: Request, res: Response) => {
    try {
        const products = await productsModel.find({ is_deleted: false }).populate('category_id').populate({
            path: 'images',
            model: 'Image', 
            select: 'image_url'
        });;
        res.status(200).send(products);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving products" });
    }
});


// Get product by productId
productsRouter.get("/product/:productId", async (req: Request, res: Response) => {
    const { productId } = req.params;
    try {
        // Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send({ message: "Invalid Product ID" });
        }

        // Find product by productId
        const product = await productsModel
            .findOne({ _id: new mongoose.Types.ObjectId(productId), is_deleted: false })
            .populate('category_id')
            .populate({
                path: 'images',
                model: 'Image',
                select: 'image_url'
            });

        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.status(200).send(product);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving the product" });
    }
});


// Fetch products with pagination and search functionality
productsRouter.get('/products/pagination', async (req: Request, res: Response) => {
    try {
        const query: any = req?.query;
        const page = parseInt(query?.page) || 1;
        const limit = parseInt(query?.limit) || 10;
        const search = query?.search || "";

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const filter = {
            is_deleted: false,
            name: { $regex: search, $options: "i" }
        };

        const response = await productsModel.find(filter).sort({ createdAt: -1 }).limit(limit).skip(startIndex).populate('category_id').populate({
            path: 'images',
            model: 'Image', // Reference the Image model
            select: 'image_url' // Select only the image_url field
        });;
        const count = await productsModel.countDocuments(filter).exec();

        let noOfPages = Math.ceil(count / limit);

        res.send({ data: response, page, limit, count, noOfPages });
    } catch (err: any) {
        res.send({ message: 'An error occurred' });
    }
});

// Get product by category
productsRouter.get("/products/:categoryId", async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    try {
        // Validate categoryId
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).send({ message: "Invalid Category ID" });
        }

        // Find products by category_id
        const products = await productsModel
            .find({
                is_deleted: false,
                category_id: new mongoose.Types.ObjectId(categoryId),
            })
            .populate("category_id");

        if (products.length === 0) {
            return res.status(404).send({ message: "No products found for this category" });
        }

        res.status(200).send(products);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving products" });
    }
});

// Delete product
productsRouter.delete("/product/:product_id", async (req: Request, res: Response) => {
    try {
        const { product_id } = req.params;
        const deletedProduct = await productsModel.findOneAndUpdate(
            { _id: product_id },
            { is_deleted: true },
            { new: true }
        );

        if (!deletedProduct) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.status(200).send({ message: "Product deleted successfully" });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while deleting the product" });
    }
});

// Edit product details
productsRouter.put("/product/:product_id", async (req: Request, res: Response) => {
    try {
        const { product_id } = req.params;
        const { name, description, price, category_id, stock, size, images } = req.body;

        if (!name || !price || !category_id || !stock || !size) {
            return res.status(400).send({ message: "Required fields are missing" });
        }

        const updatedProduct = await productsModel.findOneAndUpdate(
            { _id: product_id, is_deleted: false },
            { name, description, price, category_id, stock, size, images },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.status(200).send(updatedProduct);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while updating the product" });
    }
});

// Update product availability
productsRouter.put("/product/:product_id/availability", async (req: Request, res: Response) => {
    try {
        const { product_id } = req.params;
        const { is_in_stock, is_sold_out } = req.body;

        const updatedProduct = await productsModel.findOneAndUpdate(
            { _id: product_id, is_deleted: false },
            { is_in_stock, is_sold_out },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.status(200).send(updatedProduct);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while updating product availability" });
    }
});

export default productsRouter;
