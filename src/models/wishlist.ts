import mongoose, { Schema, Document } from "mongoose";

// Interface for Wishlist document
interface IWishlist extends Document {
    user_id: number;
    product_id: string;
    is_deleted: boolean;
}

const wishlistSchema: Schema = new mongoose.Schema(
    {
        user_id: { type: Number, required: true, unique: true },
        product_id: { type: String, required: true, index: true },
        is_deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const wishlistModel = mongoose.model<IWishlist>("Wishlist", wishlistSchema);

export default wishlistModel;
