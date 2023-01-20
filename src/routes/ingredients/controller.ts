import asyncHandler from "express-async-handler";
import Ingredient from "../../model/Ingredient";
import {
  CreateIngredientRequest,
  CreateIngredientResponse,
  GetIngredientsResponse,
  UpdateIngredientRequest,
} from "./types";

//--------------------------------------------------------------------------------

/**
 * @method POST
 * @route /ingredients/user
 * @protected yes
 */

export const createIngredientForUser = asyncHandler(
  async (req: CreateIngredientRequest, res: CreateIngredientResponse) => {
    const { name, category } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("You must provide a name for your ingredient");
    }
    const userId = req.user.id;
    const existingIngredient = await Ingredient.findOne({
      name: name,
      user: userId,
    });

    if (existingIngredient) {
      res.status(400);
      throw new Error("This ingredient already exists");
    }

    await Ingredient.create({
      user: req.user.id,
      name: name,
      category,
    });

    res.status(201).json({ message: "Successfully created ingredient" });
  }
);

//--------------------------------------------------------------------------------

/**
 * @method PATCH
 * @route /ingredients/:id
 * @protected yes
 */
export const updateIngredient = asyncHandler(
  async (req: UpdateIngredientRequest, res) => {
    const ingredientId = req.params.id;

    // TODO: Figure out how to handle public ingredients
    const ingredient = await Ingredient.findById(ingredientId);

    if (!ingredient || ingredient.user?._id.toString() !== req.user.id) {
      res.status(404);
      throw new Error("We could not find the ingredient you were looking for");
    }

    await ingredient.updateOne({
      ...req.body,
    });

    res.status(201).json({ message: "updated" });
  }
);

//--------------------------------------------------------------------------------

/**
 * @method POST
 * @route /ingredients
 * @protected yes
 */

export const createIngredient = asyncHandler(
  async (req: CreateIngredientRequest, res: CreateIngredientResponse) => {
    const { name, category } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("You must provide a name for your ingredient");
    }

    const existingIngredient = await Ingredient.findOne({
      name: name,
      user: undefined,
    });

    if (existingIngredient) {
      res.status(400);
      throw new Error("This ingredient already exists");
    }

    await Ingredient.create({
      name: name,
      category,
    });

    res.status(201).json({ message: "Successfully created ingredient" });
  }
);

//--------------------------------------------------------------------------------

/**
 * @method GET
 * @route /ingredients/user
 * @protected yes
 */

export const getIngredientsForUser = asyncHandler(
  async (req, res: GetIngredientsResponse) => {
    const userId = req.user.id;

    const ingredients = await Ingredient.find({
      user: userId,
    });

    const responseIngredients = ingredients.map((ingredient) => {
      return {
        id: ingredient._id.toString(),
        name: ingredient.name,
        category: ingredient.category,
      };
    });

    res.status(200).json(responseIngredients);
  }
);

//--------------------------------------------------------------------------------

//--------------------------------------------------------------------------------

/**
 * @method GET
 * @route /ingredients
 * @protected yes
 */

export const getPublicIngredients = asyncHandler(
  async (req, res: GetIngredientsResponse) => {
    const ingredients = await Ingredient.find({
      user: undefined,
    });

    const responseIngredients = ingredients.map((ingredient) => {
      return {
        id: ingredient._id.toString(),
        name: ingredient.name,
        category: ingredient.category,
      };
    });

    res.status(200).json(responseIngredients);
  }
);
