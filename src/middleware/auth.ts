import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import jsonwebtoken from "jsonwebtoken";

interface JWTPayload {
  id: string;
}

const prisma = new PrismaClient();

export const useUserV2 = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jsonwebtoken.verify(
        token,
        process.env.JWT_SECRET!
      ) as JWTPayload;

      // Get user from the token
      req.user = await prisma.user.findUnique({
        where: {
          id: Number(decoded.id),
        },
      });
      next();
    } catch (error) {
      req.user = undefined;
      next();
    }
  } else {
    req.user = undefined;
    next();
  }
});

export const protectV2 = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jsonwebtoken.verify(
        token,
        process.env.JWT_SECRET!
      ) as JWTPayload;

      // Get user from the token
      req.user = await prisma.user.findUnique({
        where: {
          id: Number(decoded.id),
        },
      });
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export default protectV2;
