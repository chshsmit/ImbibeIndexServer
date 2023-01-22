import express from "express";
import { protectV2 } from "../../middleware/auth";
import { createRecipe } from "./controller.v2";

const router = express.Router();

// Creating a recipe
router.post("/", protectV2, createRecipe);

export default router;
