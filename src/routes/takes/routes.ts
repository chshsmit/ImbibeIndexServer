import express from "express";
import protect from "../../middleware/auth";
import { createTake } from "./controller";

const router = express.Router();

router.post("/:recipeId", protect, createTake);

export default router;
