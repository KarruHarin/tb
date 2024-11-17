import mongoose from "mongoose";
import dotenv from "dotenv";
import adminModel from "./models/admin";
import bcrypt from "bcrypt";

dotenv.config();


const user = process.env.mongo_user;
const password = process.env.mongo_pass;

async function connectDB() {
  try {
    await mongoose.connect(
      `mongodb+srv://${user}:${password}@cluster0.g1upd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Mongo DB Connected");
    createAdmin();
  } catch (error) {
    console.log(error);
  }
}

const createAdmin = async () => {
  try {
    const find = await adminModel.findOne({ email: "admin@gmail.com" });

    if (!find) {
      const response = await adminModel.create({
        name: "admin",
        email: "admin@gmail.com",
        hashed_password: bcrypt.hashSync("admin", 10),
      });

      console.log(response);
    }
  } catch (err: any) {
    console.log(err?.message);
  }
};

export default connectDB;
