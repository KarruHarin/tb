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

<<<<<<< HEAD
// Express session setup
=======
>>>>>>> dd229e6ac3c52fa750ff9ab1ab822f6dcca17c0a
authRouter.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSessionSecret",
    resave: false,
    saveUninitialized: true,
  })
);

authRouter.use(passport.initialize());
authRouter.use(passport.session());

<<<<<<< HEAD
// Serialize and deserialize user
passport.serializeUser((user: any, done: any) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
  done(null, user);
});

// Google OAuth Strategy
=======
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

>>>>>>> dd229e6ac3c52fa750ff9ab1ab822f6dcca17c0a
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
<<<<<<< HEAD
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
=======
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (error: any, user?: any | false) => void
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(null, false); // If no email is provided, return false
        }

        const existingUser = await usersModel.findOne({ email });
        if (!existingUser) {
          const newUser = new usersModel({
            name: profile.displayName,
            email: email,
            role: 2, // Default role for Google users
          });
          const savedUser = await newUser.save();
          return done(null, savedUser); // Pass the new user to `done`
        }
        return done(null, existingUser); // Pass the existing user to `done`
      } catch (err) {
        return done(err, null); // Pass the error to `done`
>>>>>>> dd229e6ac3c52fa750ff9ab1ab822f6dcca17c0a
      }
    }
  )
);

<<<<<<< HEAD
// Facebook OAuth Strategy
=======
// Facebook Strategy
>>>>>>> dd229e6ac3c52fa750ff9ab1ab822f6dcca17c0a
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
<<<<<<< HEAD
    async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any | false) => void) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(null, false);

        const existingUser = await usersModel.findOne({ email });

=======
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (error: any, user?: any | false) => void
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(null, false); // If no email is provided, return false
        }

        const existingUser = await usersModel.findOne({ email });
>>>>>>> dd229e6ac3c52fa750ff9ab1ab822f6dcca17c0a
        if (!existingUser) {
          const newUser = new usersModel({
            name: profile.displayName,
            email: email,
<<<<<<< HEAD
            role: 1, // Default role for standard users
          });

          const savedUser = await newUser.save();
          return done(null, savedUser);
        }

        return done(null, existingUser);
      } catch (err) {
        return done(err, null);
=======
            role: 2, // Default role for Facebook users
          });
          const savedUser = await newUser.save();
          return done(null, savedUser); // Pass the new user to `done`
        }
        return done(null, existingUser); // Pass the existing user to `done`
      } catch (err) {
        return done(err, null); // Pass the error to `done`
>>>>>>> dd229e6ac3c52fa750ff9ab1ab822f6dcca17c0a
      }
    }
  )
);

// Google Login Route
<<<<<<< HEAD
authRouter.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
=======
authRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
>>>>>>> dd229e6ac3c52fa750ff9ab1ab822f6dcca17c0a

authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req: Request, res: Response) => {
    const user = req.user as any;
<<<<<<< HEAD
=======

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

    res.send({ message: "Google login successful", token });
  }
);

// Facebook Login Route
authRouter.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

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

    res.send({ message: "Facebook login successful", token });
  }
);

// Default Signup Route
authRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role, address } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).send({ message: "All fields are required." });
    }

    const existingUser = await usersModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new usersModel({
      name,
      email,
      hashed_password: hashedPassword,
      phone,
      role,
      address,
    });

    const savedUser = await newUser.save();

    res.status(201).send({ message: "User created successfully", user: savedUser });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ message: "An error occurred during signup" });
  }
});

// Default Login Route
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const findUser: any = await usersModel.findOne({ email: req.body.email });

    if (!findUser) {
      return res.status(404).send({ message: "User not found" });
    }

    const valid = await bcrypt.compare(req.body.password, findUser.hashed_password);
    if (!valid) {
      return res.status(401).send({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: findUser?._id,
        email: findUser?.email,
        name: findUser.name,
        role: findUser?.role,
      },
      secret,
      { expiresIn: "24h" }
    );

    res.send({ message: "Login successful", token });
  } catch (err: any) {
    res.status(500).send({ message: err.message });
  }
});
>>>>>>> dd229e6ac3c52fa750ff9ab1ab822f6dcca17c0a

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
