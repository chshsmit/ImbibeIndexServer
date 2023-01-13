import express from "express";
const router = express.Router();
import protect, { useUser } from "../../middleware/auth";
import { createRecipe, getRecipeById, updateRecipe } from "./controller";

// Creating a recipe
router.post("/", protect, createRecipe);

// Updating a recipe
router.patch("/:id", protect, updateRecipe);

// Get a recipe
router.get("/:id", useUser, getRecipeById);

export default router;
