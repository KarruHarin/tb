import express, { Request, Response } from "express";
import productsModel from "../models/products";

const productsRouter = express.Router();



// Get all products (excluding deleted ones)
productsRouter.get("/products", async (req: Request, res: Response) => {
    try {
        const products = await productsModel.find({ is_deleted: false });
        res.status(200).send(products);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving products" });
    }
});

productsRouter.get('/products/pagination', async (req:Request,res:Response) => {
    try {
        const query:any = req?.query
        const page = parseInt(query?.page) || 1;
        const limit = parseInt(query?.limit) || 10;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const filter = {is_deleted:false}
        const response = await productsModel.find(filter).sort({ createdAt: -1 }).limit(limit).skip(startIndex)

        const count = await productsModel.countDocuments(filter).exec()

        let noOfPages = Math.ceil( count /limit) 

        res.send({data:response,page,limit,count,noOfPages})

    }
    catch (err:any) {
        res.send({message:'an error occured'})
    }
})


productsRouter.get("/product/:product_id", async (req: Request, res: Response) => {
    try {
        const { product_id } = req.params;
        const product = await productsModel.findOne({ product_id, is_deleted: false });

        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.status(200).send(product);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving the product" });
    }
});

productsRouter.delete("/product/:product_id", async (req: Request, res: Response) => {
    try {
        const { product_id } = req.params;

        const deletedProduct = await productsModel.findOneAndUpdate(
            { product_id },
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

productsRouter.put("/product/:product_id", async (req: Request, res: Response) => {
    try {
        const { product_id } = req.params;
        const { name, description, price, category_id, brand_id, stock, rating, images } = req.body;

        if (!name || !price || !category_id || !brand_id || !stock) {
            return res.status(400).send({ message: "Required fields are missing" });
        }

        const updatedProduct = await productsModel.findOneAndUpdate(
            { product_id, is_deleted: false },
            { name, description, price, category_id, brand_id, stock, rating, images },
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

productsRouter.put("/product/:product_id/availability", async (req: Request, res: Response) => {
    try {
        const { product_id } = req.params;
        const { is_in_stock, is_sold_out } = req.body;

        const updatedProduct = await productsModel.findOneAndUpdate(
            { product_id, is_deleted: false },
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
