import { Router, Request, Response } from "express";
import productsModel from "../models/products";
import categoryModel from "../models/categories";
import subcategoryModel from "../models/subcategory";
import ImageModel from "../models/images";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { promisify } from "util";
import crypto from "crypto";
import dotenv from "dotenv";
import multer from "multer";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

const adminRouter = Router();
const upload = multer(); // Placeholder for file upload (if needed in the future)

const randomBytes = promisify(crypto.randomBytes);

// AWS S3 Configuration
const bucketName = process.env.BUCKET_NAME!;
const bucketRegion = process.env.BUCKET_REGION!;
const accessKey = process.env.ACCESS_KEY!;
const secretAccessKey = process.env.SECRET_ACCESS_KEY!;

const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
});

// Helper Functions
const isValidImageUrl = (url: string): boolean =>
  /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(url);

// Middleware for validating MongoDB ObjectId
const validateObjectId = (id: string): boolean => mongoose.Types.ObjectId.isValid(id);

// adminRouter.post("/create-product", async (req: Request, res: Response) => {
//   try {
//     const { name, description, price, category_id, size, stock, images } = req.body;

//     // Validate required fields
//     if (!name || !price || !category_id || !size || !stock || !images || images.length === 0) {
//       return res.status(400).send({ message: "All fields are required, including images." });
//     }

//     if (price <= 0 || stock < 0) {
//       return res.status(400).send({ message: "Price and stock must be positive numbers." });
//     }

//     if (!validateObjectId(category_id)) {
//       return res.status(400).send({ message: "Invalid category ID." });
//     }

//     // Validate category
//     const category = await categoryModel.findById(category_id);
//     if (!category) {
//       return res.status(404).send({ message: "Category not found." });
//     }

//     // Validate and save images
//     const imageDocs = await Promise.all(
//       images.map(async (imageUrl: string) => {
//         if (!isValidImageUrl(imageUrl)) {
//           throw new Error(`Invalid image URL: ${imageUrl}`);
//         }
//         return new ImageModel({ image_url: imageUrl }).save();
//       })
//     );

//     // Save product
//     const newProduct = new productsModel({
//       name,
//       description,
//       price,
//       category_id,
//       size,
//       stock,
//       images: imageDocs.map((img) => img.image_url),
//     });

//     const savedProduct = await newProduct.save();
//     res.status(201).send({ message: "Product created successfully", product: savedProduct });
//   } catch (err: any) {
//     console.error("Error creating product:", err.message);
//     res.status(500).send({ message: "An error occurred while creating the product." });
//   }
// });

// Create Category

adminRouter.post("/create-product", async (req: Request, res: Response) => {
  try {
    const { name, description, price, category_id, size, stock, images } = req.body;

    // Validate required fields
    if (!name || !price || !category_id || !size || !stock || !images || images.length === 0) {
      return res.status(400).send({ message: "All fields are required, including images." });
    }

    if (price <= 0 || stock < 0) {
      return res.status(400).send({ message: "Price and stock must be positive numbers." });
    }

    if (!validateObjectId(category_id)) {
      return res.status(400).send({ message: "Invalid category ID." });
    }

    // Validate category
    const category = await categoryModel.findById(category_id);
    if (!category) {
      return res.status(404).send({ message: "Category not found." });
    }

    // Validate and save images
    const imageDocs = await Promise.all(
      images.map(async (imageUrl: string) => {
        if (!isValidImageUrl(imageUrl)) {
          throw new Error(`Invalid image URL: ${imageUrl}`);
        }
        return new ImageModel({ image_url: imageUrl }).save();
      })
    );

    // Save product
    const newProduct = new productsModel({
      name,
      description,
      price,
      category_id,
      size,
      stock,
      images: imageDocs.map((img) => img._id), // Save the IDs of the images
    });

    const savedProduct = await newProduct.save();

    // Populate images with URLs in the response
    const populatedProduct = await productsModel
      .findById(savedProduct._id)
      .populate("images", "image_url"); // Populate the `image_url` field

    res.status(201).send({
      message: "Product created successfully",
      product: populatedProduct,
    });
  } catch (err: any) {
    console.error("Error creating product:", err.message);
    res.status(500).send({ message: "An error occurred while creating the product." });
  }
});


adminRouter.post("/create-category", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).send({ message: "Category name is required." });
    }

    // Check if category already exists
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(400).send({ message: "Category name must be unique." });
    }

    const category = await categoryModel.create({ name });
    res.status(201).send({ message: "Category created successfully", category });
  } catch (err: any) {
    console.error("Error creating category:", err.message);
    res.status(500).send({ message: "An error occurred while creating the category." });
  }
});

// Create Subcategory
adminRouter.post("/create-sub-category", async (req: Request, res: Response) => {
  try {
    const { category_id, name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).send({ message: "Subcategory name is required." });
    }

    if (!category_id || !validateObjectId(category_id)) {
      return res.status(400).send({ message: "Valid category ID is required." });
    }

    // Validate parent category
    const category = await categoryModel.findById(category_id);
    if (!category) {
      return res.status(404).send({ message: "Parent category not found." });
    }

    // Check if subcategory already exists
    const existingSubcategory = await subcategoryModel.findOne({ name, category_id });
    if (existingSubcategory) {
      return res.status(400).send({ message: "Subcategory already exists for this category." });
    }

    const subcategory = new subcategoryModel({ category_id, name });
    const savedSubcategory = await subcategory.save();

    res.status(201).send({ message: "Subcategory created successfully", subcategory: savedSubcategory });
  } catch (err: any) {
    console.error("Error creating subcategory:", err.message);
    res.status(500).send({ message: "An error occurred while creating the subcategory." });
  }
});

export default adminRouter;
