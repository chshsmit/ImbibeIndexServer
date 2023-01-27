import express from "express";
import protectV2 from "../../middleware/auth";
import { favoriteOrUnfavoriteRecipe, getFavoritesForUser } from "./controller";

const router = express.Router();

router.post("/:recipeId/user", protectV2, favoriteOrUnfavoriteRecipe);
router.get("/", protectV2, getFavoritesForUser);

export default router;
