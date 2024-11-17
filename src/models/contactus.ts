import mongoose, { Schema, Document } from "mongoose";

// Interface for Contact Us document to improve TypeScript support
interface IContactUs extends Document {
    name: string;
    email: string;
    reason: string;
    phone: string;
    message: string;
    is_deleted: boolean;
}

const contactusSchema: Schema = new mongoose.Schema(
    {
        name: { type: String, required: true, index: true },
        email: { type: String, required: true },
        reason: { type: String, required: true },
        phone: { type: String, required: true },
        message: { type: String, required: true },
        is_deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const contactusModel = mongoose.model<IContactUs>("ContactUs", contactusSchema);

export default contactusModel;
