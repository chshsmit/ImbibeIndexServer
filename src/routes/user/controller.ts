import User from "../../model/User";
import asyncHandler from "express-async-handler";
import AuthUtils from "../../utils/AuthUtils";
import {
  GetSelfResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "./types";
import Collection from "../../model/Collection";

export const registerUser = asyncHandler(
  async (req: RegisterRequest, res: RegisterResponse) => {
    const { name, email, displayName, password } = req.body;

    if (!name || !email || !displayName || !password) {
      res.status(400);
      throw new Error("Please add all required fields");
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("A user already exists with that email");
    }

    // Hash Password
    const hashedPassword = await AuthUtils.hash(password);

    // Create the user
    const user = await User.create({
      name,
      email,
      displayName,
      password: hashedPassword,
    });

    if (user) {
      // Let's create their root collection
      await Collection.create({
        user: user.id,
        collectionName: "Home",
        isRootCollection: true,
        collections: [],
        recipes: [],
      });

      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        displayName: user.displayName,
        token: AuthUtils.generateJwtToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }
);

export const loginUser = asyncHandler(
  async (req: LoginRequest, res: LoginResponse) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await AuthUtils.passwordsAreEqual(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        displayName: user.displayName,
        token: AuthUtils.generateJwtToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid Credentials");
    }
  }
);

export const getSelf = asyncHandler(async (req, res: GetSelfResponse) => {
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
