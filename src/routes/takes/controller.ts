import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import { CreateTakeRequest } from "./types";

const prisma = new PrismaClient();

//--------------------------------------------------------------------------------

/**
 * @method PATCH
 * @route /takes/:takeId
 * @protected yes
 */

export const updateTake = asyncHandler(async (req: CreateTakeRequest, res) => {
  const { steps, ingredients, takeNotes } = req.body;

  const { takeId } = req.params;

  const takeToUpdate = await prisma.recipeTake.findUnique({
    where: {
      id_userId: {
        id: Number(takeId),
        userId: Number(req.user.id),
      },
    },
  });

  if (!takeToUpdate) {
    res.status(404);
    throw new Error("We did not find the take you are looking for");
  }

  // Save to the specific take
  await prisma.recipeTake.update({
    where: {
      id: Number(takeId),
    },
    data: {
      takeNotes,
    },
  });

  // Save all the steps
  if (steps) {
    for (const step of steps) {
      await prisma.recipeTakeStep.upsert({
        where: {
          id: step.id || 0,
        },
        update: {
          order: step.order,
          stepText: step.stepText,
        },
        create: {
          order: step.order,
          stepText: step.stepText,
          recipeTakeId: Number(takeId),
        },
      });
    }
  }

  // Save all the ingredients
  if (ingredients) {
    for (const ingredient of ingredients) {
      await prisma.recipeTakeIngredient.upsert({
        where: {
          id: ingredient.id || 0,
        },
        update: {
          amount: ingredient.amount,
          order: ingredient.order,
          ingredientId: Number(ingredient.ingredient.id),
        },
        create: {
          amount: ingredient.amount,
          order: ingredient.order,
          ingredientId: Number(ingredient.ingredient.id),
          recipeTakeId: Number(takeId),
        },
      });
    }
  }

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

  const currentTake = await prisma.recipeTake.findFirst({
    where: {
      userId: Number(req.user.id),
      takeNumber: takeNumber,
      recipeId: Number(recipeId),
    },
  });

  if (currentTake) {
    res.status(400);
    throw new Error(`Take number ${takeNumber} already exists`);
  }

  const ingredientsToCreate = ingredients?.map((ingredient) => {
    return {
      amount: ingredient.amount,
      order: ingredient.order,
      ingredientId: Number(ingredient.ingredient.id),
    };
  });

  const stepsToCreate = steps?.map((step) => {
    return {
      stepText: step.stepText,
      order: step.order,
    };
  });

  const newTake = await prisma.recipeTake.create({
    data: {
      takeNotes,
      takeNumber,
      userId: Number(req.user.id),
      ingredients: {
        create: ingredientsToCreate,
      },
      steps: {
        create: stepsToCreate || [],
      },
      recipeId: Number(recipeId),
    },
  });

  if (!newTake) {
    res.status(500);
    throw new Error("Something went wrong");
  }

  res.status(201).json({ message: "created" });
});
