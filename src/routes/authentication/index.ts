// ----------------------------------------------------
// Imports
// ----------------------------------------------------

import express, { Response } from "express";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "imbibe-index-shared";
import { User } from "../../model/User";
import { CustomRequest } from "../../utils/types";

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
    res: Response<RegisterResponse>
  ) => {
    try {
      const { email, firstName, lastName } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser)
        return res
          .status(400)
          .json({ success: false, error: "User exists with that email" });

      const newUser = new User();
      newUser.email = email;
      newUser.firstName = firstName;
      newUser.lastName = lastName;

      await newUser.save();
      return res.status(200).json({ success: true, error: "success" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, error: err });
    }
  }
);

// ----------------------------------------------------

authenticationRouter.post(
  "/login",
  async (req: CustomRequest<LoginRequest>, res: Response<LoginResponse>) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user)
        return res
          .status(404)
          .json({ data: null, error: "User does not exist with that email" });

      return res.status(200).json({ data: user, error: null });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ data: null, error: "Something unexpected happened" });
    }
  }
);

export default authenticationRouter;
