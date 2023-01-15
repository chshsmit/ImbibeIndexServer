import express from "express";
import protect from "../../middleware/auth";
import { createTake, updateTake } from "./controller";

const router = express.Router();

router.post("/recipe/:recipeId", protect, createTake);
router.patch("/:takeId", protect, updateTake);

export default router;
