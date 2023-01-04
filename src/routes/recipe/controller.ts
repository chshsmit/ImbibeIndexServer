import asyncHandler from "express-async-handler";
import { CreateRecipeRequest } from "./types";
import Recipe from "../../model/Recipe";

export const createRecipe = asyncHandler(
  async (req: CreateRecipeRequest, res) => {
    const { name, isPrivate } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("No recipe name provided");
    } else if (!isPrivate) {
      res.status(400);
      throw new Error(
        "You need to provide whether or not this recipe is private."
      );
    }

    const recipe = await Recipe.create({
      name,
      user: req.user.id,
      isPrivate: isPrivate === "Y",
    });

    if (recipe) {
      res.status(201).json({
        id: recipe.id,
        name: recipe.name,
        takes: recipe.takes,
      });
    } else {
      res.status(400);
      throw new Error("Invalid recipe data");
    }
  }
);

interface UserForRecipe {
  name: string;
  displayName: string;
}

export const getRecipeById = asyncHandler(async (req, res) => {
  // res.json({ message: `Getting recipe with id ${req.params.id}` });
  const recipe = await Recipe.findById(req.params.id).populate<{
    user: UserForRecipe;
  }>("user", "name displayName");

  if (!recipe) {
    res.status(404);
    throw new Error(`Recipe with id ${req.params.id} was not found`);
  }

  console.log(recipe);

  res.status(200).json({
    name: recipe.name,
    createdAt: recipe.createdAt,
    createdBy: {
      name: recipe.user.name,
      displayName: recipe.user.displayName,
    },
  });
});
