import mongoose, { Schema, Document } from "mongoose";

const usersSchema: Schema = new mongoose.Schema(
    {
        name: { type: String, index: true },
        email: { type: String, unique: true, required: true },
        hashed_password: { type: String, required: true },
        phone: { type: String },
        role: { type: Number}, // user_type can be '1' for admin or '2' for normal user
        address: { type: String },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date },
        deleted_at: { type: Date },
        is_deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const usersModel = mongoose.model('users', usersSchema);

export default usersModel;
