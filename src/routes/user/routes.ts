import express from "express";
const router = express.Router();
import protect from "../../middleware/auth";
import { getSelf, loginUser, registerUser } from "./controller";

// Registering user
router.post("/register", registerUser);
// Logging In
router.post("/login", loginUser);
// Getting Self
router.get("/me", protect, getSelf);

export default router;
