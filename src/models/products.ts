import mongoose, { Schema, Document } from "mongoose";

// Interface for Products document
interface IProduct extends Document {
    name: string;
    description: string;
    price: string;
    category_id: Schema.Types.ObjectId; 
    size:string;
    stock: string;
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
        category_id: { 
            type: Schema.Types.ObjectId, 
            ref: "Category",  
        },
        size: { type: String, required: true},
        stock: { type: String, required: true },
        images: [{ type: Schema.Types.ObjectId, ref: "Image" }],
        is_active: { type: Boolean, default: true },
        is_in_stock: { type: Boolean, default: true },
        is_sold_out: { type: Boolean, default: false },
        is_deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const productsModel = mongoose.model<IProduct>("Product", productsSchema);

export default productsModel;
