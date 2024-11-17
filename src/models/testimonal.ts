import mongoose, { Schema, Document } from 'mongoose';

interface ITestimonial extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    content: string;
    rating: number;
    is_approved: boolean;
    is_deleted: boolean;
}

const testimonialSchema: Schema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        is_approved: { type: Boolean, default: false },
        is_deleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const testimonialModel = mongoose.model<ITestimonial>('Testimonial', testimonialSchema);

export default testimonialModel;
