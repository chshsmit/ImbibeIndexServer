import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import AuthUtils from "../../utils/AuthUtils";
import {
  GetSelfResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "./types";

const prisma = new PrismaClient();

//--------------------------------------------------------------------------------

/**
 * @method POST
 * @route /user/register
 * @protected no
 */

export const registerUser = asyncHandler(
  async (req: RegisterRequest, res: RegisterResponse) => {
    const { name, email, displayName, password } = req.body;

    if (!name || !email || !displayName || !password) {
      res.status(400);
      throw new Error("Please add all required fields");
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userExists) {
      res.status(400);
      throw new Error("A user already exists with that email");
    }

    // Hash Password
    const hashedPassword = await AuthUtils.hash(password);

    // Create the user AND their root collection
    const user = await prisma.user.create({
      data: {
        name,
        email,
        displayName,
        password: hashedPassword,
        collections: {
          create: [
            {
              collectionName: "Home",
              isRootCollection: true,
            },
          ],
        },
      },
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        displayName: user.displayName,
        token: AuthUtils.generateJwtToken(user.id),
      });
    }
  }
);

//--------------------------------------------------------------------------------

/**
 * @method POST
 * @route /user/login
 * @protected no
 */
export const loginUser = asyncHandler(
  async (req: LoginRequest, res: LoginResponse) => {
    const { email, password } = req.body;

    // Check for user email

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user && (await AuthUtils.passwordsAreEqual(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        displayName: user.displayName,
        token: AuthUtils.generateJwtToken(user.id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  }
);

//--------------------------------------------------------------------------------

/**
 * @method GET
 * @route /user/me
 * @protected yes
 */
export const getSelf = asyncHandler(async (req, res: GetSelfResponse) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(req.user.id),
    },
  });

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
