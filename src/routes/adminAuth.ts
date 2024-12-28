import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import adminModel from "../models/admin";

dotenv.config();
const JWT_SECRET: string = process.env.JWT_SECRET || "defaultJwtSecret";

const AdminAuthRouter = Router();

// Helper function to generate JWT token
const generateAuthToken = (id: string, email: string, name: string): string => {
  return jwt.sign({ id, email, name }, JWT_SECRET, { expiresIn: "24h" });
};

// Admin Login
AdminAuthRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find admin user
    const admin = await adminModel.findOne({ email, is_deleted: false });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!admin.hashed_password || typeof admin.hashed_password !== "string") {
      return res.status(500).json({ message: "Invalid password stored in database" });
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, admin.hashed_password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate auth token
    const token = generateAuthToken(admin.id, admin.email, admin.name);

    // Return success response with the token
    res.status(200).json({
      message: "Admin login successful",
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
      token,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

export default AdminAuthRouter;
