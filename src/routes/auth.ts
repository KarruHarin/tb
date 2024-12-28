import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/users';

const AuthRouter = Router();

// Signup Route
AuthRouter.post('/signup', async (req: Request, res: Response) => {
    try {
        const {
            full_name,  password, email, phone_number} = req.body;

        // Validate required fields
        if (!full_name || !phone_number || !email || !password) {
            return res.status(400).send({ message: 'All required fields must be provided.' });
        }

        if (password.length < 6) {
            return res.status(400).send({ message: 'Password must be at least 6 characters long.' });
        }

        // Check if the email already exists
        const existingUser = await userModel.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).send({ message: 'Email already registered.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await userModel.create({
            full_name,
            email,
            phone_number,
            password: hashedPassword
        });

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.full_name },
            process.env.JWT_SECRET_KEY || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        // Set the token in cookies
        res.cookie('authToken', token, {
            httpOnly: true,
            maxAge: 3600000, // 1 hour expiration
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return res.status(201).send({
            message: 'User registered successfully',
            data: user,
            token
        });
    } catch (err: any) {
        return res.status(500).send({
            message: 'Error during user registration',
            error: err.message
        });
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

export default AuthRouter;
