import mongoose, { Schema, Document } from "mongoose";

interface IFAQ extends Document {
    question: string;
    answer: string;
    is_published?: boolean;
}

const faqSchema: Schema = new mongoose.Schema(
    {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        is_published: { type: Boolean, default: true }, 
    },
    { timestamps: true } 
);

const FAQModel = mongoose.model<IFAQ>("FAQ", faqSchema);

export default FAQModel;
