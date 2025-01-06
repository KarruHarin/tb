import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
    name: string;
    description: string;
    price: string;
    category_id: Schema.Types.ObjectId;
    variants: Array<{ size: string; color?: string; stock: number }>; // Added variants
    images: string[];
    is_active: boolean;
    is_in_stock: boolean;
    is_sold_out: boolean;
    is_deleted: boolean;
}

const productsSchema: Schema = new mongoose.Schema(
    {
        name: { type: String, required: true, index: true },
        description: { type: String },
        price: { type: String, required: true },
        category_id: { type: Schema.Types.ObjectId, ref: "Category" },
        variants: [
            {
                size: { type: String, required: true },
                color: { type: String },
                stock: { type: Number, required: true }
            }
        ],
        images: [{ type: Schema.Types.ObjectId, ref: "Image" }],
        is_active: { type: Boolean, default: true },
        is_in_stock: { type: Boolean, default: true },
        is_sold_out: { type: Boolean, default: false },
        is_deleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const productsModel = mongoose.model<IProduct>("Product", productsSchema);

export default productsModel;

