import express from "express";
import protect from "../../middleware/auth";
import {
  createIngredient,
  createIngredientForUser,
  getIngredientsForUser,
  getPublicIngredients,
} from "./controller";
const router = express.Router();

router.post("/", createIngredient);
router.get("/", getPublicIngredients);
router.post("/user", protect, createIngredientForUser);
router.get("/user", protect, getIngredientsForUser);

export default router;
