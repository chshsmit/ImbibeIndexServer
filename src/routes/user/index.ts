// ----------------------------------------------------
// Imports
// ----------------------------------------------------

import express from "express";
import { User } from "../../model/User";

// ----------------------------------------------------
// Constants
// ----------------------------------------------------

const userRouter = express.Router();

// ----------------------------------------------------
// Routes
// ----------------------------------------------------

userRouter.get("/", async (req, res) => {
  const user = (await req.user) as User;

  console.log(user);

  if (!user) return res.send("");

  const { email, firstName, lastName, id } = user;
  res.send({ email, firstName, lastName, id });
});

export default userRouter;
