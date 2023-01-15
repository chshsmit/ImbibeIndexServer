import asyncHandler from "express-async-handler";
import Ingredient from "../../model/Ingredient";
import { CreateIngredientRequest, CreateIngredientResponse } from "./types";

export const createIngredient = asyncHandler(
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
