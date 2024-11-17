import express, { Request, Response } from "express";
import paymentModel from "../models/payments";

const paymentRouter = express.Router();

// Create a new payment record
paymentRouter.post("/create-payment", async (req: Request, res: Response) => {
    try {
        const { order_id, user_id, amount, payment_method, payment_status, transaction_id } = req.body;

        // Validate required fields
        if (!order_id || !user_id || !amount || !payment_method || !transaction_id) {
            return res.status(400).send({ message: "Required fields are missing" });
        }

        // Create the payment entry
        const newPayment = new paymentModel({
            order_id,
            user_id,
            amount,
            payment_method,
            payment_status,
            transaction_id,
        });

        const savedPayment = await newPayment.save();

        res.status(201).send(savedPayment);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while creating the payment record" });
    }
});

// Get all payment records (excluding deleted ones)
paymentRouter.get("/payments", async (req: Request, res: Response) => {
    try {
        const payments = await paymentModel.find({ is_deleted: false });
        res.status(200).send(payments);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving payment records" });
    }
});

// Get a specific payment by transaction_id
paymentRouter.get("/payment/:transaction_id", async (req: Request, res: Response) => {
    try {
        const { transaction_id } = req.params;
        const payment = await paymentModel.findOne({ transaction_id, is_deleted: false });

        if (!payment) {
            return res.status(404).send({ message: "Payment not found" });
        }

        res.status(200).send(payment);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving the payment record" });
    }
});

// Soft delete a payment record by transaction_id
paymentRouter.delete("/payment/:transaction_id", async (req: Request, res: Response) => {
    try {
        const { transaction_id } = req.params;

        const deletedPayment = await paymentModel.findOneAndUpdate(
            { transaction_id },
            { is_deleted: true },
            { new: true }
        );

        if (!deletedPayment) {
            return res.status(404).send({ message: "Payment record not found" });
        }

        res.status(200).send({ message: "Payment record deleted successfully" });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while deleting the payment record" });
    }
});

// Update payment status (e.g., success, failed)
paymentRouter.put("/payment/:transaction_id/status", async (req: Request, res: Response) => {
    try {
        const { transaction_id } = req.params;
        const { payment_status } = req.body;

        if (!payment_status) {
            return res.status(400).send({ message: "Payment status is required" });
        }

        const updatedPayment = await paymentModel.findOneAndUpdate(
            { transaction_id, is_deleted: false },
            { payment_status },
            { new: true }
        );

        if (!updatedPayment) {
            return res.status(404).send({ message: "Payment record not found" });
        }

        res.status(200).send(updatedPayment);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while updating the payment status" });
    }
});

// Get all payments for a specific user
paymentRouter.get("/payments/user/:user_id", async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params;
        const payments = await paymentModel.find({ user_id, is_deleted: false });

        if (payments.length === 0) {
            return res.status(404).send({ message: "No payments found for this user" });
        }

        res.status(200).send(payments);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send({ message: "An error occurred while retrieving user payments" });
    }
});

export default paymentRouter;
