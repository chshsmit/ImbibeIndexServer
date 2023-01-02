import express from "express";
const router = express.Router();

import asyncHandler from "express-async-handler";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../model/User";
import { CustomRequest } from "../../types/Requests/CustomRequest";
import { Types } from "mongoose";
import protect from "../../middleware/auth";

interface RegisterRequest {
  name: string;
  email: string;
  displayName: string;
  password: string;
}

// Registering user
router.post(
  "/register",
  asyncHandler(async (req: CustomRequest<RegisterRequest>, res) => {
    const { name, email, displayName, password } = req.body;

    if (!name || !email || !displayName || !password) {
      res.status(400);
      throw new Error("Please add all required fields");
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = await User.create({
      name,
      email,
      displayName,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        displayName: user.displayName,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  })
);

interface LoginRequest {
  email: string;
  password: string;
}

// Logging In
router.post(
  "/login",
  asyncHandler(async (req: CustomRequest<LoginRequest>, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        displayName: user.displayName,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid Credentials" });
    }
  })
);

// Getting Me
router.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(400);
      throw new Error("Something went wrong trying to find the user");
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      displayName: user.displayName,
    });
  })
);

const generateToken = (id: Types.ObjectId) => {
  return jsonwebtoken.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
};

export default router;
