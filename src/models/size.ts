import mongoose, { Schema, Document } from "mongoose";

interface Isize extends Document {
    name: string;
    is_deleted: boolean;
}

const sizeSchema: Schema = new mongoose.Schema(
    {
        name: { type: String, required: true, index: true },
        is_deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const sizeModel = mongoose.model<Isize>("size", sizeSchema);

export default sizeModel;
