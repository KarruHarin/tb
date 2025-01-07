import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import userModel from '../models/users';
import dotenv from 'dotenv';
import crypto from "crypto";

dotenv.config();


const AuthRouter = Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// Signup Route
// AuthRouter.post('/signup', async (req: Request, res: Response) => {
//     try {
//         const {
//             full_name,  password, email, phone_number} = req.body;

//         // Validate required fields
//         if (!full_name || !phone_number || !email || !password) {
//             return res.status(400).send({ message: 'All required fields must be provided.' });
//         }

//         if (password.length < 6) {
//             return res.status(400).send({ message: 'Password must be at least 6 characters long.' });
//         }

//         // Check if the email already exists
//         const existingUser = await userModel.findOne({ where: { email } });
//         if (existingUser) {
//             return res.status(400).send({ message: 'Email already registered.' });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new user
//         const user = await userModel.create({
//             full_name,
//             email,
//             phone_number,
//             password: hashedPassword
//         });

//         // Generate a JWT token
//         const token = jwt.sign(
//             { id: user._id, email: user.email, name: user.full_name },
//             process.env.JWT_SECRET_KEY || 'your_jwt_secret',
//             { expiresIn: '1h' }
//         );

//         // Set the token in cookies
//         res.cookie('authToken', token, {
//             httpOnly: true,
//             maxAge: 3600000, // 1 hour expiration
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict'
//         });

//         return res.status(201).send({
//             message: 'User registered successfully',
//             data: user,
//             token
//         });
//     } catch (err: any) {
//         return res.status(500).send({
//             message: 'Error during user registration',
//             error: err.message
//         });
//     }
// });

// Signup Route with Email Verification
AuthRouter.post('/signup', async (req: Request, res: Response) => {
    try {
        const { full_name, password, email, phone_number } = req.body;

        if (!full_name || !phone_number || !email || !password) {
            return res.status(400).send({ message: 'All fields are required.' });
        }

        if (password.length < 6) {
            return res.status(400).send({ message: 'Password must be at least 6 characters.' });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'Email already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a token for email verification
        const token = jwt.sign(
            { full_name, email, phone_number, password: hashedPassword },
            process.env.JWT_SECRET_KEY || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Email',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p>Hello ${full_name},</p>
        <p>Please click the link below to verify your email:</p>
  <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Verify Email</a>
  <p style="margin-top: 20px;">If you didn’t request this, please ignore this email.</p>
</div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).send({
            message: 'Signup successful! Check your email for verification.',
        });
    } catch (err: any) {
        return res.status(500).send({ message: 'Error during registration', error: err.message });
    }
});

AuthRouter.get('/verify-email', async (req: Request, res: Response) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).send({ message: 'Token is required.' });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token as string, process.env.JWT_SECRET_KEY || 'your_jwt_secret');
        } catch (err) {
            return res.status(400).send({ message: 'Invalid or expired token.' });
        }

        const { full_name, email, phone_number, password } = decoded;

        // Check if email already exists in the database
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'Email already verified or in use.' });
        }

        // Save user details to the database
        const user = await userModel.create({
            full_name,
            email,
            phone_number,
            password,
            is_verified: true,
        });

        return res.status(200).send({ message: 'Email verified successfully.', user });
    } catch (err: any) {
        return res.status(500).send({ message: 'Error during verification', error: err.message });
    }
});

    
// Login Route
AuthRouter.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).send({ message: 'Email and password are required.' });
        }

        // Find the user by email
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid password.' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.full_name },
            process.env.JWT_SECRET_KEY || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        // Set token in cookies
        res.cookie('authToken', token, {
            httpOnly: true,
            maxAge: 3600000, // 1 hour expiration
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return res.status(200).send({
            message: 'Login successful',
            token
        });
    } catch (err: any) {
        return res.status(500).send({
            message: 'Error during user login',
            error: err.message
        });
    }
});

AuthRouter.post("/google", async (req: Request, res: Response) => {
  try {
    const { email, full_name } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(200)
        .json({ message: "User already exists", user: existingUser });
    }

    // Generate random password and phone number placeholder for Google users
    const randomPassword = await bcrypt.hash("password", 10);
    const tempPhoneNumber = `google_${Date.now()}`;

    // Create new user
    const newUser = await userModel.create({
      full_name,
      email,
      password: randomPassword, // You might want to hash this
      phone_number: tempPhoneNumber,
      is_verified: true,
      is_deleted: false,
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error in Google auth:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default AuthRouter;
