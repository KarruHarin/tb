import mongoose, { Schema, Document } from "mongoose";

// Interface for Payments document
interface IPayment extends Document {
    order_id: number;
    user_id: string;
    amount: string;
    payment_method: string;
    payment_status: string; // e.g., "success", "pending", "failed"
    payment_date: Date;
    transaction_id: string;
    is_deleted: boolean;
}

const paymentSchema: Schema = new mongoose.Schema(
    {
        order_id: { type: Number, required: true },
        user_id: { type: String, required: true, index: true },
        amount: { type: String, required: true },
        payment_method: { type: String, required: true }, // e.g., "credit card", "paypal"
        payment_status: { type: String, default: "pending", required: true }, // e.g., "success", "failed", "pending"
        payment_date: { type: Date, default: Date.now },
        transaction_id: { type: String, required: true },
        is_deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const paymentModel = mongoose.model<IPayment>("Payment", paymentSchema);

export default paymentModel;
