import mongoose, { Schema, Document } from "mongoose";

interface IAddress extends Document {
    name: string;
    user_id: mongoose.Schema.Types.ObjectId;
    phone_number: string;
    pincode: string;
    locality: string;
    address: string;
    city: string;
    state: string;
    landmark: string;
    alternate_phone_number?: string;
    address_type: string;
    is_deleted: boolean;
}

const addressSchema: Schema = new mongoose.Schema(
    {
        name: { type: String, required: true, index: true },
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        phone_number: { type: String, required: true, index: true },
        pincode: { type: String, required: true, index: true },
        locality: { type: String, required: true },
        address: { type: String, required: true, index: true },
        city: { type: String, required: true, index: true },
        state: { type: String, required: true, index: true },
        landmark: { type: String, index: true },
        alternate_phone_number: { type: String, index: true },
        address_type: { type: String, required: true, index: true },
        is_deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const addressModel = mongoose.model<IAddress>("Address", addressSchema);

export default addressModel;
