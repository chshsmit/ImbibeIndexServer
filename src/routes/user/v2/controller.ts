import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import { RegisterRequest } from "../types";

const prisma = new PrismaClient();

//--------------------------------------------------------------------------------

export const registerUser = asyncHandler(async (req: RegisterRequest, res) => {
  const { name: userName, email, displayName, password } = req.body;
  const result = await prisma.user.create({
    data: {
      name: userName,
      displayName,
      email,
      password,
    },
  });

  res.json(result);
});
