import express from "express";
import { protectV2 } from "../../middleware/auth";
import { createTake, updateTake } from "./controller";

const router = express.Router();

router.patch("/:takeId", protectV2, updateTake);
router.post("/recipe/:recipeId", protectV2, createTake);

export default router;
