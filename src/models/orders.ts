import mongoose, { Schema, Document } from "mongoose";

interface IOrder extends Document {
    order_id: number;
    user_id: mongoose.Schema.Types.ObjectId;
    products: Array<{ product_id: mongoose.Schema.Types.ObjectId; quantity: number }>;
    total_price: number;
    category_id: mongoose.Schema.Types.ObjectId;
    brand_id: mongoose.Schema.Types.ObjectId;
    stock: number;
    shipping_address: string;
    images: string[];
    is_active: boolean;
    order_status: string;
    payment_status: boolean;
    order_date: Date;
    delivery_date: Date;
    deleted_at?: Date;
    is_deleted: boolean;
}

const orderSchema: Schema = new mongoose.Schema(
    {
        order_id: { type: Number, unique: true, required: true },
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        products: [
            {
                product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true }
            }
        ],
        total_price: { type: Number, required: true },
        category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
        brand_id: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
        stock: { type: Number, required: true },
        shipping_address: { type: String, required: true },
        images: { type: [String], default: [] },
        is_active: { type: Boolean, default: true },
        order_status: { type: String, enum: ["Pending", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
        payment_status: { type: Boolean, default: false },
        order_date: { type: Date, default: Date.now },
        delivery_date: { type: Date },
        deleted_at: { type: Date },
        is_deleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const orderModel = mongoose.model<IOrder>("Order", orderSchema);

export default orderModel;
