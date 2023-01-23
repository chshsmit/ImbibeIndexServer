import express from "express";
import multer from "multer";
import { protectV2, useUserV2 } from "../../middleware/auth";
import {
  createRecipe,
  getRecipeById,
  likeRecipe,
  updateRecipe,
  uploadImage,
} from "./controller";

const router = express.Router();

// Creating a recipe
router.post("/", protectV2, createRecipe);
// Updating a recipe
router.patch("/:id", protectV2, updateRecipe);
// Get a recipe
router.get("/:id", useUserV2, getRecipeById);

// Like a recipe
router.post("/:id/like", protectV2, likeRecipe);

// Upload image for recipe
router.post(
  "/:id/image",
  [protectV2, multer({ dest: "uploads/" }).single("image")],
  uploadImage
);

export default router;
