import express, { Request, Response } from "express";
import cartModel from "../models/cart";

const cartRouter = express.Router();

// Add an item to the cart
cartRouter.post("/cart", async (req: Request, res: Response) => {
    try {
        const { customer_id, product_id, variant, quantity, price } = req.body;

        if (!customer_id || !product_id || !variant?.size || !quantity || !price) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const total_price = quantity * price;

        const cartItem = new cartModel({
            customer_id,
            product_id,
            variant,
            quantity,
            price,
            total_price,
        });

        const savedCartItem = await cartItem.save();
        res.status(201).json(savedCartItem);
    } catch (error: any) {
        console.error("Error adding to cart:", error.message);
        res.status(500).json({ message: "Failed to add to cart." });
    }
});

// Retrieve all cart items for a customer
cartRouter.get("/cart/:customerId", async (req: Request, res: Response) => {
    try {
        const { customerId } = req.params;

        const cartItems = await cartModel
            .find({ customer_id: customerId, is_deleted: false })
            .populate("product_id", "name price variants");

        res.status(200).json(cartItems);
    } catch (error: any) {
        console.error("Error retrieving cart items:", error.message);
        res.status(500).json({ message: "Failed to retrieve cart items." });
    }
});

// Update a cart item
cartRouter.put("/cart/:cartId", async (req: Request, res: Response) => {
    try {
        const { cartId } = req.params;
        const { variant, quantity, price } = req.body;

        if (!variant?.size || !quantity || !price) {
            return res.status(400).json({ message: "Variant, quantity, and price are required." });
        }

        const total_price = quantity * price;

        const updatedCartItem = await cartModel.findByIdAndUpdate(
            cartId,
            { variant, quantity, price, total_price },
            { new: true }
        );

        if (!updatedCartItem) {
            return res.status(404).json({ message: "Cart item not found." });
        }

        res.status(200).json(updatedCartItem);
    } catch (error: any) {
        console.error("Error updating cart item:", error.message);
        res.status(500).json({ message: "Failed to update cart item." });
    }
});

// Soft-delete a cart item
cartRouter.delete("/cart/:cartId", async (req: Request, res: Response) => {
    try {
        const { cartId } = req.params;

        const deletedCartItem = await cartModel.findByIdAndUpdate(
            cartId,
            { is_deleted: true },
            { new: true }
        );

        if (!deletedCartItem) {
            return res.status(404).json({ message: "Cart item not found." });
        }

        res.status(200).json({ message: "Cart item deleted successfully." });
    } catch (error: any) {
        console.error("Error deleting cart item:", error.message);
        res.status(500).json({ message: "Failed to delete cart item." });
    }
});

export default cartRouter;
