import express, { Request, Response } from "express";
import brandModel from "../models/brands";


const brandRouter = express.Router();

// Create a new brand
brandRouter.post("/create-brand", async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).send({ message: "Brand name is required" });
        }

        const newBrand = new brandModel({ name });
        const savedBrand = await newBrand.save();

        res.status(201).send(savedBrand);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while creating the brand" });
    }
});

brandRouter.get("/brands", async (req: Request, res: Response) => {
    try {
        const brands = await brandModel.find({ is_deleted: false });
        res.status(200).send(brands);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving brands" });
    }
});

brandRouter.get("/brand/:name", async (req: Request, res: Response) => {
    try {
        const { name } = req.params;
        const brand = await brandModel.findOne({ name, is_deleted: false });

        if (!brand) {
            return res.status(404).send({ message: "Brand not found" });
        }

        res.status(200).send(brand);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving the brand" });
    }
});

// Update a brand by name
brandRouter.put("/brand/:name", async (req: Request, res: Response) => {
    try {
        const { name } = req.params;
        const { newName } = req.body;

        if (!newName) {
            return res.status(400).send({ message: "New brand name is required" });
        }

        const updatedBrand = await brandModel.findOneAndUpdate(
            { name, is_deleted: false },
            { name: newName },
            { new: true }
        );

        if (!updatedBrand) {
            return res.status(404).send({ message: "Brand not found" });
        }

        res.status(200).send(updatedBrand);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while updating the brand" });
    }
});

// Soft delete a brand by name
brandRouter.delete("/brand/:name", async (req: Request, res: Response) => {
    try {
        const { name } = req.params;

        const deletedBrand = await brandModel.findOneAndUpdate(
            { name },
            { is_deleted: true },
            { new: true }
        );

        if (!deletedBrand) {
            return res.status(404).send({ message: "Brand not found" });
        }

        res.status(200).send({ message: "Brand deleted successfully" });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while deleting the brand" });
    }
});

export default brandRouter;
