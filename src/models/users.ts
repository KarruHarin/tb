import mongoose from "mongoose";

interface User extends Document {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  is_deleted: boolean;
}

const userSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: { type: String, required: true, unique: true },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const userModel = mongoose.model<User>("user", userSchema);

export default userModel;
