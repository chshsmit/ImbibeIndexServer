// ----------------------------------------------------
// Imports
// ----------------------------------------------------

import bcrypt from "bcrypt";
import express, { Response } from "express";
import passport from "passport";
import { User } from "../../model/User";
import { CustomRequest, ErrorResponse } from "../../utils/types";
import { LoginResponse, RegisterRequest, RegisterResponse } from "./types";

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
      const { email, firstName, lastName, password } = req.body;

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
      newUser.hashedPassword = await bcrypt.hash(password, 10);

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
  async (req, res: Response<LoginResponse | ErrorResponse>, next) => {
    try {
      passport.authenticate("local", (err, user: User) => {
        console.log(err);
        if (err) throw err;
        if (!user) {
          res.send({
            errorCode: "UserDoesNotExist",
            message: "Did not find user with that email",
          });
        } else {
          req.logIn(user, (err) => {
            if (err) throw err;
            res.send({
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            });
          });
        }
      })(req, res, next);
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

authenticationRouter.get("/logout", async (req, res) => {
  try {
    await req.logOut();
    return res.status(200).json({ logout: "success" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ logout: "error" });
  }
});

export default authenticationRouter;
