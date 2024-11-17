import mongoose, { Schema, Document } from 'mongoose';

interface IReview extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    product_id: mongoose.Schema.Types.ObjectId;
    rating: number;
    comment: string;
    is_deleted: boolean;
}

const reviewSchema: Schema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        is_deleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const reviewModel = mongoose.model<IReview>('Review', reviewSchema);

export default reviewModel;
