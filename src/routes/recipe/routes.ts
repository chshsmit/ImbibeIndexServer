import express from "express";
const router = express.Router();
import protect from "../../middleware/auth";
import { createRecipe, getRecipeById } from "./controller";

// Creating a recipe
router.post("/", protect, createRecipe);

// Get a recipe
router.get("/:id", getRecipeById);

export default router;
