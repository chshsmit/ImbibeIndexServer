import express from "express";
import { protectV2 } from "../../middleware/auth";
import { createRecipe, likeRecipe } from "./controller.v2";

const router = express.Router();

// Creating a recipe
router.post("/", protectV2, createRecipe);
// Like a recipe
router.post("/:id/like", protectV2, likeRecipe);

export default router;
