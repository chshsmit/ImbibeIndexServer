// ----------------------------------------------------
// Imports
// ----------------------------------------------------

import express, { Response } from "express";
import { Recipe } from "../../model/Recipe";
import { User } from "../../model/User";
import { ErrorResponse } from "../../utils/types";
import { RecipeResponse } from "./types";

// ----------------------------------------------------
// Constants
// ----------------------------------------------------

const recipeRouter = express.Router();

// ----------------------------------------------------
// Routes
// ----------------------------------------------------

/**
 * Get a single recipe by its ID
 * Protected route. Checks if the user accessing the route is the user that created it
 * Only returns if it is the user, or it is a public recipe
 */
recipeRouter.get(
  "/:recipeId",
  async (req, res: Response<RecipeResponse | ErrorResponse>) => {
    const requestUser = (await req.user) as User;

    const recipe = await Recipe.findOne({
      where: { recipeId: req.params.recipeId },
      relations: ["collection", "collection.user"],
    });

    if (!recipe)
      return res.status(404).json({
        errorCode: "RecipeDoesNotExist",
        message: "The recipe you requested does not exist",
      });

    if (recipe.isPrivate) {
      if (
        requestUser === undefined ||
        requestUser.id !== recipe.collection.user.id
      ) {
        return res.status(401).json({
          errorCode: "UnauthorizedAccess",
          message:
            "Sorry this is a private recipe. Only the user that created it has access",
        });
      }
    }

    // Desctructuring for Response
    const { recipeId, name } = recipe;
    const { id: collectionId } = recipe.collection;

    return res.status(200).json({
      recipeId,
      name,
      collectionId,
    });
  }
);

export default recipeRouter;
