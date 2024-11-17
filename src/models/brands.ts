import mongoose, { Schema, Document } from "mongoose";

interface IBrand extends Document {
    name: string;
    is_deleted: boolean;
}

const brandSchema: Schema = new mongoose.Schema(
    {
        name: { type: String, required: true, index: true },
        is_deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const brandModel = mongoose.model<IBrand>("Brand", brandSchema);

export default brandModel;
