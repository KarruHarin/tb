import mongoose, { Schema, Document } from 'mongoose';

interface ITestimonial extends Document {
    // user_id: mongoose.Schema.Types.ObjectId;
    user_name: string;
    content: string;
    rating: string;
    is_approved: boolean;
    is_deleted: boolean;
}

const testimonialSchema: Schema = new mongoose.Schema(
    {
        //user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        user_name: { type: String, required: true },
        content: { type: String, required: true },
        rating: { type: String, required: true },
        is_approved: { type: Boolean, default: false },
        is_deleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const testimonialModel = mongoose.model<ITestimonial>('Testimonial', testimonialSchema);

export default testimonialModel;
