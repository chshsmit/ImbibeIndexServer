import express from "express";
import protect from "../../middleware/auth";
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
router.patch("/:id", protect, updateIngredient);
router.post("/user", protect, createIngredientForUser);
router.get("/user", protect, getIngredientsForUser);

export default router;
