import asyncHandler from "express-async-handler";
import {
  CreateRecipeRequest,
  CreateRecipeResponse,
  GetRecipeResponse,
  TakeForRecipeResponse,
  UpdateRecipeRequest,
  UpdateRecipeResponse,
} from "./types";
import Recipe from "../../model/Recipe";
import Collection from "../../model/Collection";
import RecipeTake from "../../model/RecipeTake";

export const createRecipe = asyncHandler(
  async (req: CreateRecipeRequest, res: CreateRecipeResponse) => {
    const { name, isPrivate, collectionId } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("No recipe name provided");
    } else if (!isPrivate) {
      res.status(400);
      throw new Error(
        "You need to provide whether or not this recipe is private."
      );
    } else if (!collectionId) {
      res.status(400);
      throw new Error("You need provide the collection this recipe is part of");
    }

    const collectionForRecipe = await Collection.findById(collectionId);

    if (!collectionForRecipe) {
      res.status(400);
      throw new Error(
        `The collection with id [${collectionId}] does not exist`
      );
    }

    // Lets create the first take right away
    const firstTake = await RecipeTake.create({
      user: req.user.id,
      takeNumber: 1,
      ingredients: [],
    });

    const recipe = await Recipe.create({
      name,
      user: req.user.id,
      isPrivate: isPrivate === "Y",
      collectionForRecipe: collectionForRecipe.id,
      takes: [firstTake.id],
    });

    if (recipe) {
      // Lets add the recipe to the collection
      await collectionForRecipe.updateOne({ $push: { recipes: recipe.id } });

      res.status(201).json({
        id: recipe.id,
        name: recipe.name,
      });
    } else {
      res.status(400);
      throw new Error("Invalid recipe data");
    }
  }
);

export const updateRecipe = asyncHandler(
  async (req: UpdateRecipeRequest, res: UpdateRecipeResponse) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      res.status(404);
      throw new Error(`No recipe found with id: ${req.params.id}`);
    }

    if (recipe.user.toString() !== req.user.id) {
      res.status(404);
      console.error("Unauthorized access");
      throw new Error("We did not find this recipe sorry");
    }

    await recipe.updateOne({
      ...req.body,
    });

    res.status(200).json({
      message: "Successfully updated recipe",
    });
  }
);

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

interface UserForRecipe {
  name: string;
  displayName: string;
  id: string;
}

export const getRecipeById = asyncHandler(
  async (req, res: GetRecipeResponse) => {
    // res.json({ message: `Getting recipe with id ${req.params.id}` });
    const recipe = await Recipe.findById(req.params.id)
      .populate<{
        user: UserForRecipe;
      }>("user", "name displayName id")
      .populate<{
        takes: Array<TakeForRecipeResponse>;
      }>({
        path: "takes",
        select: "id takeNumber ingredients",
      });

    console.log(req.user);

    if (!recipe) {
      res.status(404);
      throw new Error(`Recipe with id ${req.params.id} was not found`);
    }

    console.log(req.user);

    let isEditable = false;
    if (req.user && req.user.id === recipe.user.id) isEditable = true;

    res.status(200).json({
      name: recipe.name,
      takes: recipe.takes,
      recipeDescription: recipe.recipeDescription,
      createdBy: {
        displayName: recipe.user.displayName,
        id: recipe.user.id,
      },
      createdAt: recipe.createdAt,
      isEditable,
    });
  }
);
