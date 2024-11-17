import mongoose, { Schema, Document } from "mongoose";

interface ICart extends Document {
    customer_id: mongoose.Schema.Types.ObjectId;
    product_id: mongoose.Schema.Types.ObjectId;
    quantity: number;
    price: number;
    total_price: number;
    is_deleted: boolean;
}

const cartSchema: Schema = new mongoose.Schema(
    {
        customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        total_price: { type: Number, required: true },
        is_deleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const cartModel = mongoose.model<ICart>("Cart", cartSchema);

export default cartModel;
