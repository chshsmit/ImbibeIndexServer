import express from "express";
import { protectV2 } from "../../middleware/auth";
import {
  createIngredient,
  createIngredientForUser,
  getIngredientsForUser,
  getPublicIngredients,
  updateIngredient,
} from "./controller";

const router = express.Router();

router.post("/", createIngredient);
router.get("/", getPublicIngredients);
router.patch("/:id", protectV2, updateIngredient);
router.post("/user", protectV2, createIngredientForUser);
router.get("/user", protectV2, getIngredientsForUser);

export default router;
