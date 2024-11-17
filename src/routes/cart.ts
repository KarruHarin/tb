import express, { Request, Response } from "express";
import cartModel from "../models/cart";

const cartRouter = express.Router();

// Add an item to the cart
cartRouter.post("/add-to-cart", async (req: Request, res: Response) => {
    try {
        const { customer_id, product_id, quantity, price } = req.body;

        if (!customer_id || !product_id || !quantity || !price) {
            return res.status(400).send({ message: "Missing required fields" });
        }

        const total_price = quantity * price;

        const cartItem = new cartModel({
            customer_id,
            product_id,
            quantity,
            price,
            total_price
        });

        const response = await cartItem.save();
        res.status(201).send(response);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while adding to cart" });
    }
});

// Retrieve all cart items for a customer
cartRouter.get("/cart/:customerId", async (req: Request, res: Response) => {
    try {
        const { customerId } = req.params;
        const cartItems = await cartModel.find({ customer_id: customerId, is_deleted: false });
        res.status(200).send(cartItems);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving cart items" });
    }
});

// Update a cart item by ID
cartRouter.put("/cart/:cartId", async (req: Request, res: Response) => {
    try {
        const { quantity, price } = req.body;
        const { cartId } = req.params;

        if (!quantity || !price) {
            return res.status(400).send({ message: "Quantity and price are required" });
        }

        const total_price = quantity * price;

        const updatedCartItem = await cartModel.findByIdAndUpdate(
            cartId,
            { quantity, price, total_price },
            { new: true }
        );

        if (!updatedCartItem) return res.status(404).send({ message: "Cart item not found" });

        res.status(200).send(updatedCartItem);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while updating the cart item" });
    }
});

// Soft-delete a cart item by ID
cartRouter.delete("/cart/:cartId", async (req: Request, res: Response) => {
    try {
        const { cartId } = req.params;

        const deletedCartItem = await cartModel.findByIdAndUpdate(
            cartId,
            { is_deleted: true },
            { new: true }
        );

        if (!deletedCartItem) return res.status(404).send({ message: "Cart item not found" });

        res.status(200).send({ message: "Cart item removed successfully" });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while deleting the cart item" });
    }
});

export default cartRouter;
