import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import usersModel from "../models/users";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import session from "express-session";

dotenv.config();
const secret: string = process.env.secret || "defaultJwtSecret";
const authRouter = Router();

authRouter.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSessionSecret",
    resave: false,
    saveUninitialized: true,
  })
);

authRouter.use(passport.initialize());
authRouter.use(passport.session());

// Serialize and deserialize user
passport.serializeUser((user: any, done: any) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
  done(null, user);
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any | false) => void) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(null, false);

        const existingUser = await usersModel.findOne({ email });

        if (!existingUser) {
          const newUser = new usersModel({
            name: profile.displayName,
            email: email,
            role: 1, // Default role for standard users
          });

          const savedUser = await newUser.save();
          return done(null, savedUser);
        }

        return done(null, existingUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Facebook OAuth Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
    async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any | false) => void) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(null, false);

        const existingUser = await usersModel.findOne({ email });

        if (!existingUser) {
          const newUser = new usersModel({
            name: profile.displayName,
            email: email,
            role: 1, // Default role for standard users
          });

          const savedUser = await newUser.save();
          return done(null, savedUser);
        }

        return done(null, existingUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Google Login Route
authRouter.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req: Request, res: Response) => {
    const user = req.user as any;

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      secret,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    res.send({ message: "Google login successful", token });
  }
);

// Facebook Login Route
authRouter.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));

authRouter.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  async (req: Request, res: Response) => {
    const user = req.user as any;

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      secret,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    res.send({ message: "Facebook login successful", token });
  }
);

// Custom Login Route// Custom Login Route
authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await usersModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Use `hashed_password` field instead of `password`
    const isPasswordValid = await bcrypt.compare(password, user.hashed_password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      secret,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    res.send({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Custom Signup Route
authRouter.post("/signup", async (req: Request, res: Response) => {
  const { firstName,lastName, email, password } = req.body;

  try {
    const existingUser = await usersModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password and save it as `hashed_password`
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new usersModel({
      firstName,
      lastName,
      email,
      hashed_password: hashedPassword,  // Store the hashed password in `hashed_password`
      role: 1, // Default role for standard users
    });

    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
      secret,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    res.status(201).send({ message: "Signup successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
export default authRouter;
