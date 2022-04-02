// ----------------------------------------------------
// Imports
// ----------------------------------------------------

import express, { Response } from "express";
import { Collection } from "../../model/Collection";
import { Recipe } from "../../model/Recipe";
import { User } from "../../model/User";
import { CustomRequest, ErrorResponse } from "../../utils/types";
import {
  CreateRecipeRequest,
  CreateRecipeResponse,
  RecipeResponse,
} from "./types";

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

// ----------------------------------------------------

recipeRouter.post(
  "/user/:userId",
  async (
    req: CustomRequest<CreateRecipeRequest>,
    res: Response<CreateRecipeResponse | ErrorResponse>
  ) => {
    const requestUser = (await req.user) as User;

    if (
      requestUser === undefined ||
      requestUser.id !== Number(req.params.userId)
    ) {
      return res.status(401).json({
        errorCode: "UnauthorizedAccess",
        message: "Sorry, you must be the user provided to create this recipe.",
      });
    }

    const { id, name, parentId, isPrivate, type } = req.body;

    const parentCollection = await Collection.findOne({
      where: { id: parentId },
    });

    if (!parentCollection) {
      return res.status(404).json({
        errorCode: "ParentCollectionDoesNotExist",
        message: "Sorry we did not find a parent collection with that id",
      });
    }

    // Make sure the user exists
    const user = await User.findOne({
      where: { id: Number(req.params.userId) },
    });
    if (!user) {
      return res.status(404).json({
        errorCode: "UserDoesNotExist",
        message: "Sorry we did not find a user with your id",
      });
    }

    const newRecipe = new Recipe();
    newRecipe.recipeId = id;
    newRecipe.name = name;
    newRecipe.collection = parentCollection;
    newRecipe.isPrivate = isPrivate;
    newRecipe.recipeType = type;

    await newRecipe.save();

    return res.status(200).json({ success: true, id });
  }
);

export default recipeRouter;
