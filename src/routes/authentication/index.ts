// ----------------------------------------------------
// Imports
// ----------------------------------------------------

import express, { Response } from "express";
import { User } from "../../model/User";
import { CustomRequest, ErrorResponse } from "../../utils/types";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "./types";

// ----------------------------------------------------
// Constants
// ----------------------------------------------------

const authenticationRouter = express.Router();

// ----------------------------------------------------
// Routes
// ----------------------------------------------------

authenticationRouter.post(
  "/register",
  async (
    req: CustomRequest<RegisterRequest>,
    res: Response<RegisterResponse | ErrorResponse>
  ) => {
    try {
      const { email, firstName, lastName } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser)
        return res.status(400).json({
          errorCode: "UserAlreadyExists",
          message: "A user already exists with that email",
        });

      const newUser = new User();
      newUser.email = email;
      newUser.firstName = firstName;
      newUser.lastName = lastName;

      await newUser.save();
      return res.status(200).json({ email });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errorCode: "UnexpectedError",
        message: "Something unexpected happened",
      });
    }
  }
);

// ----------------------------------------------------

authenticationRouter.post(
  "/login",
  async (
    req: CustomRequest<LoginRequest>,
    res: Response<LoginResponse | ErrorResponse>
  ) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user)
        return res.status(404).json({
          errorCode: "UserDoesNotExist",
          message: "Did not find user with that email.",
        });

      return res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errorCode: "UnexpectedError",
        message: "Something unexpected happened",
      });
    }
  }
);

export default authenticationRouter;
