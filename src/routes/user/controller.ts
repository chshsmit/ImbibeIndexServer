import User from "../../model/User";
import asyncHandler from "express-async-handler";
import AuthUtils from "../../utils/AuthUtils";
import { LoginRequest, RegisterRequest } from "./types";

export const registerUser = asyncHandler(async (req: RegisterRequest, res) => {
  const { name, email, displayName, password } = req.body;

  if (!name || !email || !displayName || !password) {
    res.status(400);
    throw new Error("Please add all required fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json("User exists");
    throw new Error("User already exists");
  }

  // Hash Password
  const hashedPassword = AuthUtils.hash(password);

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
      token: AuthUtils.generateJwtToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export const loginUser = asyncHandler(async (req: LoginRequest, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await AuthUtils.passwordsAreEqual(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      displayName: user.displayName,
      token: AuthUtils.generateJwtToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

export const getSelf = asyncHandler(async (req, res) => {
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
});
