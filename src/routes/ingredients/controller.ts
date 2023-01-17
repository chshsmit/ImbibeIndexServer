import asyncHandler from "express-async-handler";
import Ingredient from "../../model/Ingredient";
import {
  CreateIngredientRequest,
  CreateIngredientResponse,
  GetIngredientsResponse,
} from "./types";

//--------------------------------------------------------------------------------

/**
 * @method POST
 * @route /ingredients/user
 * @protected yes
 */

export const createIngredientForUser = asyncHandler(
  async (req: CreateIngredientRequest, res: CreateIngredientResponse) => {
    const { name } = req.body;

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
    });

    res.status(201).json({ message: "Successfully created ingredient" });
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
    const { name } = req.body;

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
      };
    });

    res.status(200).json(responseIngredients);
  }
);
