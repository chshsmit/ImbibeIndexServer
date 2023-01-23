import express from "express";
import { protectV2 } from "../../middleware/auth";
import { getSelf, loginUser, registerUser } from "./controller";
const router = express.Router();

// Registering a user
router.post("/register", registerUser);
// Logging In
router.post("/login", loginUser);
// Getting Self
router.get("/me", protectV2, getSelf);

export default router;
