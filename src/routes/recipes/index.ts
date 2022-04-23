// ----------------------------------------------------
// Imports
// ----------------------------------------------------

import express, { Response } from "express";
import { Collection } from "../../model/Collection";
import { Ingredient } from "../../model/Ingredients";
import { Recipe } from "../../model/Recipe";
import { RecipeTake } from "../../model/RecipeTake";
import { TakeIngredients } from "../../model/TakeIngredients";
import { User } from "../../model/User";
import { CustomRequest, ErrorResponse } from "../../utils/types";
import {
  CreateRecipeRequest,
  CreateRecipeResponse,
  RecipeResponse,
  UpdateTakeRequest,
  UpdateTakeResponse,
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
      relations: [
        "collection",
        "collection.user",
        "takes",
        "takes.ingredients",
        "takes.ingredients.ingredient",
      ],
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
    return res.status(200).json({
      recipe,
    });
  }
);

// ----------------------------------------------------

/**
 * Update a recipe's takes
 */
recipeRouter.put(
  "/take/:takeId",
  async (
    req: CustomRequest<UpdateTakeRequest>,
    res: Response<UpdateTakeResponse | ErrorResponse>
  ) => {
    const requestUser = (await req.user) as User;

    if (
      requestUser === undefined
      // requestUser.id !== Number(req.params.userId)
    ) {
      return res.status(401).json({
        errorCode: "UnauthorizedAccess",
        message: "Sorry, you must be the user provided to create this recipe.",
      });
    }

    const { takeNotes, ingredients } = req.body;

    const recipeTake = await RecipeTake.findOne({
      where: { id: Number(req.params.takeId) },
      relations: ["ingredients"],
    });
    if (!recipeTake) {
      return res.status(404).json({
        errorCode: "TakeDoesNotExist",
        message: "Sorry we did not find a take with that id.",
      });
    }

    if (takeNotes) recipeTake.takeNotes = takeNotes;

    await recipeTake.save();

    if (ingredients) {
      // delete current ingredients
      const idsToDelete = recipeTake.ingredients.map(
        (ingredient) => ingredient.id
      );

      if (idsToDelete.length > 0) await TakeIngredients.delete(idsToDelete);

      const valsToSave = await Promise.all(
        ingredients.map(async (item) => {
          const ingredient = await Ingredient.findOne({
            where: { id: item.ingredientId },
          });
          if (!ingredient) throw new Error("Ingredient doesn't exist");

          const newTakeIngredient = new TakeIngredients();
          newTakeIngredient.ingredientAmount = item.ingredientAmount;
          newTakeIngredient.unit = item.ingredientUnit;
          newTakeIngredient.ingredient = ingredient;
          newTakeIngredient.recipeTake = recipeTake;

          return newTakeIngredient;
        })
      );

      console.log({ valsToSave });

      await TakeIngredients.save(valsToSave);
    }

    return res.status(200).json({ takeNotes });
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

    const { id, name, parentId, isPrivate, type, ingredientId } = req.body;

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

    // Create a new recipe
    const newRecipe = new Recipe();
    newRecipe.recipeId = id;
    newRecipe.name = name;
    newRecipe.collection = parentCollection;
    newRecipe.isPrivate = isPrivate;
    newRecipe.recipeType = type;
    await newRecipe.save();

    // Create an initial recipe take
    const initialTake = new RecipeTake();
    initialTake.name = "Take 1";
    initialTake.takeNumber = 1;
    initialTake.recipe = newRecipe;
    await initialTake.save();

    // Create the ingredient if it is an ingredient recipe
    if (type === "ingredient") {
      const newIngredient = new Ingredient();
      newIngredient.ingredientName = name;
      newIngredient.ingredientRecipeId = id;
      newIngredient.user = user;
      await newIngredient.save();
    }

    // If we are creating a recipe from an existing ingredient
    // Then we need to update it
    if (ingredientId) {
      const ingredient = await Ingredient.findOne({
        where: { id: ingredientId },
      });
      if (ingredient) {
        ingredient.ingredientRecipeId = id;
        await ingredient.save();
      }
    }

    return res.status(200).json({ success: true, id });
  }
);

export default recipeRouter;
