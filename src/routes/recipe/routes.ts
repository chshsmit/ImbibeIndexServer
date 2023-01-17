import express from "express";
import multer from "multer";
import protect, { useUser } from "../../middleware/auth";
import {
  createRecipe,
  getRecipeById,
  updateRecipe,
  uploadImage,
} from "./controller";
const router = express.Router();

// Creating a recipe
router.post("/", protect, createRecipe);

// Updating a recipe
router.patch("/:id", protect, updateRecipe);

// Get a recipe
router.get("/:id", useUser, getRecipeById);

// Upload image for recipe
router.post(
  "/:id/image",
  [protect, multer({ dest: "uploads/" }).single("image")],
  uploadImage
);

export default router;
