import express, { Request, Response } from "express";
import inventoryModel from "../models/inventory";

const inventoryRouter = express.Router();

inventoryRouter.post("/create-inventory", async (req: Request, res: Response) => {
    try {
        const { product_id, stock_quantity, warehouse_location } = req.body;

        if (!product_id || !stock_quantity || !warehouse_location) {
            return res.status(400).send({ message: "All fields are required" });
        }

        const newInventory = new inventoryModel({ product_id, stock_quantity, warehouse_location });
        const savedInventory = await newInventory.save();

        res.status(201).send(savedInventory);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while creating the inventory entry" });
    }
});

inventoryRouter.get("/inventory", async (req: Request, res: Response) => {
    try {
        const inventoryEntries = await inventoryModel.find({ is_deleted: false });
        res.status(200).send(inventoryEntries);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving inventory entries" });
    }
});

inventoryRouter.get("/inventory/:product_id", async (req: Request, res: Response) => {
    try {
        const { product_id } = req.params;
        const inventoryEntry = await inventoryModel.findOne({ product_id, is_deleted: false });

        if (!inventoryEntry) {
            return res.status(404).send({ message: "Inventory entry not found" });
        }

        res.status(200).send(inventoryEntry);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving the inventory entry" });
    }
});

inventoryRouter.delete("/inventory/:product_id", async (req: Request, res: Response) => {
    try {
        const { product_id } = req.params;

        const deletedInventory = await inventoryModel.findOneAndUpdate(
            { product_id },
            { is_deleted: true },
            { new: true }
        );

        if (!deletedInventory) {
            return res.status(404).send({ message: "Inventory entry not found" });
        }

        res.status(200).send({ message: "Inventory entry deleted successfully" });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while deleting the inventory entry" });
    }
});

inventoryRouter.put("/inventory/:product_id", async (req: Request, res: Response) => {
    try {
        const { product_id } = req.params;
        const { stock_quantity, warehouse_location } = req.body;

        if (!stock_quantity || !warehouse_location) {
            return res.status(400).send({ message: "Stock quantity and warehouse location are required" });
        }

        const updatedInventory = await inventoryModel.findOneAndUpdate(
            { product_id, is_deleted: false },
            { stock_quantity, warehouse_location },
            { new: true }
        );

        if (!updatedInventory) {
            return res.status(404).send({ message: "Inventory entry not found" });
        }

        res.status(200).send(updatedInventory);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while updating the inventory entry" });
    }
});

export default inventoryRouter;
