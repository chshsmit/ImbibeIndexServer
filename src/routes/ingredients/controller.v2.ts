import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import {
  CreateIngredientRequest,
  CreateIngredientResponse,
  GetIngredientsResponse,
  UpdateIngredientRequest,
} from "./types";

const prisma = new PrismaClient();

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

    const userId = Number(req.user.id);
    const existingIngredient = await prisma.ingredient.findFirst({
      where: {
        name: name,
        userId: userId,
      },
    });

    if (existingIngredient) {
      res.status(400);
      throw new Error("This ingredient already exists");
    }

    await prisma.ingredient.create({
      data: {
        name,
        category,
        userId,
      },
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
    const ingredientId = Number(req.params.id);

    // TODO: Figure out how to handle public ingredients
    const ingredientToUpdate = await prisma.ingredient.findFirst({
      where: {
        id: ingredientId,
        userId: Number(req.user.id),
      },
    });

    if (!ingredientToUpdate) {
      res.status(404);
      throw new Error("We could not find the ingredient you were looking for");
    }

    await prisma.ingredient.update({
      where: {
        id: ingredientId,
      },
      data: {
        ...req.body,
      },
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

    const existingIngredient = await prisma.ingredient.findFirst({
      where: {
        name,
        userId: null,
      },
    });

    if (existingIngredient) {
      res.status(400);
      throw new Error("This ingredient already exists");
    }

    await prisma.ingredient.create({
      data: {
        name,
        category,
        userId: null,
      },
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
    const userId = Number(req.user.id);

    const ingredients = await prisma.ingredient.findMany({
      where: {
        userId,
      },
    });

    const responseIngredients = ingredients.map((ingredient) => {
      return {
        id: ingredient.id,
        name: ingredient.name,
        category: ingredient.category,
      };
    });

    res.status(200).json(responseIngredients);
  }
);

//--------------------------------------------------------------------------------

/**
 * @method GET
 * @route /ingredients
 * @protected yes
 */

export const getPublicIngredients = asyncHandler(
  async (req, res: GetIngredientsResponse) => {
    const ingredients = await prisma.ingredient.findMany({
      where: {
        userId: null,
      },
    });

    const responseIngredients = ingredients.map((ingredient) => {
      return {
        id: ingredient.id,
        name: ingredient.name,
        category: ingredient.category,
      };
    });

    res.status(200).json(responseIngredients);
  }
);
