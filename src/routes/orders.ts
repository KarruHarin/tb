import express, { Request, Response } from "express";
import orderModel from "../models/orders";

const orderRouter = express.Router();

// Create a new order
orderRouter.post("/create-order", async (req: Request, res: Response) => {
    try {
        const { order_id, user_id, products, total_price, category_id, brand_id, stock, shipping_address, images } = req.body;

        // Validate required fields
        if (!order_id || !user_id || !products || !total_price || !category_id || !brand_id || !shipping_address) {
            return res.status(400).send({ message: "Missing required fields" });
        }

        // Create a new order
        const order = new orderModel({
            order_id,
            user_id,
            products,
            total_price,
            category_id,
            brand_id,
            stock,
            shipping_address,
            images,
        });

        const response = await order.save();
        res.status(201).send(response);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while creating the order" });
    }
});

// Retrieve all orders
orderRouter.get("/orders", async (req: Request, res: Response) => {
    try {
        const orders = await orderModel.find({ is_deleted: false }).populate("user_id").populate("category_id").populate("brand_id");
        res.status(200).send(orders);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving orders" });
    }
});

// Retrieve an order by ID
orderRouter.get("/order/:id", async (req: Request, res: Response) => {
    try {
        const order = await orderModel.findOne({ _id: req.params.id, is_deleted: false })
            .populate("user_id")
            .populate("category_id")
            .populate("brand_id");
        
        if (!order) return res.status(404).send({ message: "Order not found" });

        res.status(200).send(order);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving the order" });
    }
});

// Update an order by ID
orderRouter.put("/order/:id", async (req: Request, res: Response) => {
    try {
        const { products, total_price, stock, shipping_address, order_status, payment_status, delivery_date } = req.body;

        const updatedOrder = await orderModel.findByIdAndUpdate(
            req.params.id,
            { products, total_price, stock, shipping_address, order_status, payment_status, delivery_date, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedOrder) return res.status(404).send({ message: "Order not found" });

        res.status(200).send(updatedOrder);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while updating the order" });
    }
});

// Soft-delete an order by ID
orderRouter.delete("/order/:id", async (req: Request, res: Response) => {
    try {
        const deletedOrder = await orderModel.findByIdAndUpdate(
            req.params.id,
            { is_deleted: true, deleted_at: new Date() },
            { new: true }
        );

        if (!deletedOrder) return res.status(404).send({ message: "Order not found" });

        res.status(200).send({ message: "Order deleted successfully" });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while deleting the order" });
    }
});

export default orderRouter;
