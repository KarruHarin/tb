import mongoose, { Schema, Document } from "mongoose";

interface ICoupon extends Document {
    coupon_id: number;
    code: string;
    discount: number;
    start_date: Date;
    end_date: Date;
    is_active: boolean;
    is_deleted: boolean;
}

const couponSchema: Schema = new mongoose.Schema(
    {
        coupon_id: { type: Number, unique: true, required: true },
        code: { type: String, required: true, index: true },
        discount: { type: Number, required: true },
        start_date: { type: Date, required: true },
        end_date: { type: Date, required: true },
        is_active: { type: Boolean, default: false },
        is_deleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const couponModel = mongoose.model<ICoupon>("Coupon", couponSchema);

export default couponModel;
