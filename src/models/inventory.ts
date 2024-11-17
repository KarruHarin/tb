import mongoose, { Schema, Document } from "mongoose";

// Interface for Inventory document for better TypeScript support
interface IInventory extends Document {
    product_id: number;
    stock_quantity: string;
    warehouse_location: string;
    is_deleted: boolean;
}

const inventorySchema: Schema = new mongoose.Schema(
    {
        product_id: { type: Number, unique: true, required: true },
        stock_quantity: { type: String, required: true },
        warehouse_location: { type: String, required: true },
        is_deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const inventoryModel = mongoose.model<IInventory>("Inventory", inventorySchema);

export default inventoryModel;
