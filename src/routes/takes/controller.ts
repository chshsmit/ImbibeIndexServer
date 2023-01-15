import asyncHandler from "express-async-handler";
import Recipe from "../../model/Recipe";
import RecipeTake from "../../model/RecipeTake";
import { CreateTakeRequest } from "./types";

//--------------------------------------------------------------------------------

/**
 * @method PATCH
 * @route /takes/:takeId
 * @protected yes
 */
export const updateTake = asyncHandler(async (req: CreateTakeRequest, res) => {
  const { steps, ingredients, takeNotes } = req.body;

  const { takeId } = req.params;

  const takeToUpdate = await RecipeTake.findById(takeId);

  if (!takeToUpdate) {
    res.status(404);
    throw new Error("We did not find the take you are looking for");
  }

  if (takeToUpdate.user._id.toString() !== req.user.id) {
    res.status(404);
    throw new Error("We did not find the recipe you were looking for");
  }

  await takeToUpdate.updateOne({
    steps: steps?.map((step) => {
      return {
        order: step.order,
        stepText: step.stepText,
      };
    }),
    ingredients: ingredients?.map((ingredient) => {
      return {
        amount: ingredient.amount,
        unit: ingredient.unit,
        ingredient: ingredient.ingredient.id,
      };
    }),
    takeNotes: takeNotes,
  });

  res.status(201).json({ message: "updated" });
});

//--------------------------------------------------------------------------------

/**
 * @method POST
 * @route /takes/recipe/:recipeId
 * @protected yes
 */
export const createTake = asyncHandler(async (req: CreateTakeRequest, res) => {
  const { takeNumber, steps, ingredients, takeNotes } = req.body;

  const { recipeId } = req.params;

  const currentTake = await RecipeTake.findOne({
    user: req.user.id,
    takeNumber,
  });
  if (currentTake) {
    res.status(400);
    throw new Error(`Take number ${takeNumber} already exists`);
  }

  const recipeForTake = await Recipe.findOne({
    user: req.user.id,
    _id: recipeId,
  });
  if (!recipeForTake) {
    res.status(404);
    throw new Error("Sorry there is no recipe with the provided ID");
  }

  const newTake = await RecipeTake.create({
    takeNumber,
    user: req.user.id,
    takeNotes,
    steps: steps?.map((step) => {
      return { order: step.order, stepText: step.stepText };
    }),
    ingredients: ingredients?.map((ingredient) => {
      return {
        ingredient: ingredient.ingredient.id,
        amount: ingredient.amount,
        unit: ingredient.unit,
      };
    }),
  });

  if (!newTake) {
    res.status(500);
    throw new Error("Something went wrong");
  }

  await recipeForTake.updateOne({
    $push: { takes: newTake.id },
  });

  res.status(201).json({ message: "created" });
});
