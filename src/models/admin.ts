import mongoose, { Schema, Document } from "mongoose";

interface Admin extends Document {
  name: string;
  email: string;
  phone: string;
  hashed_password: string;
  is_deleted: boolean;
}

const adminSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashed_password: { type: String, required: true },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const adminModel = mongoose.model<Admin>("admin", adminSchema);

export default adminModel;
