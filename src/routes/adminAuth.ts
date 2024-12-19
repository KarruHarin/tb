import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import usersModel from "../models/users";

dotenv.config();
const secret: string = process.env.JWT_SECRET || "defaultJwtSecret";
const authRouter = Router();

// Admin Login
authRouter.post("/admin/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find admin user
    const admin = await usersModel.findOne({ email, role: 1, is_deleted: false });
    if (!admin) return res.status(404).send({ message: "Admin not found" });

    // Validate password
    const isValidPassword = await bcrypt.compare(password, admin.hashed_password);
    if (!isValidPassword) return res.status(401).send({ message: "Invalid credentials" });

    // Generate JWT token
    //name:admin.name
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        name: "name",
        role: admin.role,
      },
      secret,
      { expiresIn: "24h" }
    );

    res.send({ message: "Admin login successful", token });
  } catch (err: any) {
    res.status(500).send({ message: "An error occurred during login", error: err.message });
  }
});

export default authRouter;
