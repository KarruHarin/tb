import express, { Request, Response } from "express";
import wishlistModel from "../models/wishlist";

const wishlistRouter = express.Router();

wishlistRouter.post("/add", async (req: Request, res: Response) => {
    try {
        const { user_id, product_id } = req.body;

        if (!user_id || !product_id) {
            return res.status(400).send({ message: "Required fields are missing" });
        }

        const existingWishlistItem = await wishlistModel.findOne({
            user_id,
            product_id,
            is_deleted: false,
        });

        if (existingWishlistItem) {
            return res.status(400).send({ message: "Product already in wishlist" });
        }

        const newWishlistItem = new wishlistModel({ user_id, product_id });

        const savedWishlistItem = await newWishlistItem.save();

        res.status(201).send(savedWishlistItem);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while adding to the wishlist" });
    }
});

wishlistRouter.get("/user/:user_id", async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params;
        
        const wishlistItems = await wishlistModel.find({ user_id, is_deleted: false });

        if (wishlistItems.length === 0) {
            return res.status(404).send({ message: "No items in wishlist for this user" });
        }

        res.status(200).send(wishlistItems);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving the wishlist" });
    }
});

wishlistRouter.delete("/remove", async (req: Request, res: Response) => {
    try {
        const { user_id, product_id } = req.body;

        if (!user_id || !product_id) {
            return res.status(400).send({ message: "Required fields are missing" });
        }

        const removedWishlistItem = await wishlistModel.findOneAndUpdate(
            { user_id, product_id, is_deleted: false },
            { is_deleted: true },
            { new: true }
        );

        if (!removedWishlistItem) {
            return res.status(404).send({ message: "Wishlist item not found" });
        }

        res.status(200).send({ message: "Product removed from wishlist" });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while removing the product" });
    }
});

wishlistRouter.delete("/clear/:user_id", async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params;

        const result = await wishlistModel.updateMany(
            { user_id, is_deleted: false },
            { $set: { is_deleted: true } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send({ message: "No wishlist items to delete for this user" });
        }

        res.status(200).send({ message: "All wishlist items cleared" });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while clearing the wishlist" });
    }
});

wishlistRouter.put("/restore", async (req: Request, res: Response) => {
    try {
        const { user_id, product_id } = req.body;

        if (!user_id || !product_id) {
            return res.status(400).send({ message: "Required fields are missing" });
        }

        const restoredWishlistItem = await wishlistModel.findOneAndUpdate(
            { user_id, product_id, is_deleted: true },
            { is_deleted: false },
            { new: true }
        );

        if (!restoredWishlistItem) {
            return res.status(404).send({ message: "Wishlist item not found or not deleted" });
        }

        res.status(200).send(restoredWishlistItem);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while restoring the wishlist item" });
    }
});

export default wishlistRouter;
