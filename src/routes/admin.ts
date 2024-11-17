import { Router,Request,Response } from "express";
import productsModel from "../models/products";
import categoryModel from "../models/category";
import subcategoryModel from "../models/subcategory";
import ImageModel from "../models/images";


const adminRouter = Router();

adminRouter.post('/create-product', async (req: Request, res: Response) => {
    try {
        const { name, description, price, category_id, size, stock, rating, images } = req.body;

        if (!name || !price || !category_id || !size || !stock || !rating || !images || images.length === 0) {
            return res.status(400).send({ message: "All fields are required." });
        }

        // Save images in ImageModel
        const imageDocs = await Promise.all(
            images.map(async (image: string) => {
                const newImage = new ImageModel({ image_url: image });
                return await newImage.save();
            })
        );

        // Extract IDs of saved images
        const imageIds = imageDocs.map((image) => image._id);

        // Save product with image references
        const newProduct = new productsModel({
            name,
            description,
            price,
            category_id,
            size,
            stock,
            rating,
            images: imageIds, // Link saved images
            is_active: true,
            is_in_stock: true,
            is_sold_out: false,
            is_deleted: false,
        });

        const savedProduct = await newProduct.save();

        res.status(201).send({
            message: "Product created successfully",
            product: savedProduct,
        });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while creating the product" });
    }
});

adminRouter.post('/create-category', async (req: Request, res: Response) => {
    try {
        const data = req?.body;
        if(!data?.name || data?.name?.length === 0){
            return res.status(400).send({message:'Contact email is required'})
        }
            const response = await categoryModel.create(data);
            res.send(response);
       
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: 'An error occurred' });
    }
});


adminRouter.post('/create-sub-category', async (req: Request, res: Response) => {
    try {
        const { category_id, name } = req.body;

        if (!name || name.length === 0) {
            return res.status(400).send({ message: 'Sub Category name is required' });
        }
        if (!category_id) {
            return res.status(400).send({ message: 'Category ID is required' });
        }

        const subcategory = new subcategoryModel({ category_id, name });
        const response = await subcategory.save();

        res.status(201).send(response);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: 'An error occurred' });
    }
});


export default adminRouter