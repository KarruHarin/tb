import express, { Request, Response } from "express";
import orderModel from "../models/orders";

const orderRouter = express.Router();

let sequenceNumber = 0;
orderRouter.post("/orders", async (req: Request, res: Response) => {
    try {
        const {
            user_id,
            products,
            total_price,
            category_id,
            brand_id,
            shipping_address,
            order_status,
            payment_status,
        } = req.body;

        if (
            !user_id ||
            !products?.length ||
            !total_price ||
            !category_id ||
            !brand_id ||
            !shipping_address
        ) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        sequenceNumber += 1;

        const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const order_id = `TEC${datePart}-${String(sequenceNumber).padStart(6, "0")}`;

        const order = new orderModel({
            order_id,
            user_id,
            products,
            total_price,
            category_id,
            brand_id,
            shipping_address,
            order_status,
            payment_status,
        });

        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error: any) {
        console.error("Error creating order:", error.message);
        res.status(500).json({ message: "Failed to create order." });
    }
});

orderRouter.get("/orders/:userId", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const orders = await orderModel
            .find({ user_id: userId, is_deleted: false })
            .populate("products.product_id", "name price variants");

        res.status(200).json(orders);
    } catch (error: any) {
        console.error("Error retrieving orders:", error.message);
        res.status(500).json({ message: "Failed to retrieve orders." });
    }
});

orderRouter.put("/orders/:orderId", async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { order_status, payment_status } = req.body;

        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { order_status, payment_status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found." });
        }

        res.status(200).json(updatedOrder);
    } catch (error: any) {
        console.error("Error updating order:", error.message);
        res.status(500).json({ message: "Failed to update order." });
    }
});
orderRouter.delete("/orders/:orderId", async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;

        const deletedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { is_deleted: true, deleted_at: new Date() },
            { new: true }
        );

        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found." });
        }

        res.status(200).json({ message: "Order deleted successfully." });
    } catch (error: any) {
        console.error("Error deleting order:", error.message);
        res.status(500).json({ message: "Failed to delete order." });
    }
});

export default orderRouter;
