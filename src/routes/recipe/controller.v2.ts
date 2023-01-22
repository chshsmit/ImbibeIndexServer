import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import { CreateRecipeRequest, CreateRecipeResponse } from "./types";

const prisma = new PrismaClient();

//--------------------------------------------------------------------------------

/**
 * @method POST
 * @route /recipe
 * @protected yes
 */
export const createRecipe = asyncHandler(
  async (req: CreateRecipeRequest, res: CreateRecipeResponse) => {
    const { name, isPublished, collectionId } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("No recipe name provided");
    } else if (!isPublished) {
      res.status(400);
      throw new Error(
        "You need to provide whether or not this recipe is private."
      );
    } else if (!collectionId) {
      res.status(400);
      throw new Error("You need provide the collection this recipe is part of");
    }

    const newRecipe = await prisma.recipe.create({
      data: {
        name,
        userId: Number(req.user.id),
        isPublished: isPublished === "Y",
        collectionId: Number(collectionId),
        takes: {
          create: [
            {
              takeNumber: 1,
              takeNotes: "",
              userId: Number(req.user.id),
            },
          ],
        },
        likes: {
          create: [
            {
              userId: Number(req.user.id),
            },
          ],
        },
      },
    });

    if (newRecipe) {
      res.status(201).json({
        id: newRecipe.id,
        name: newRecipe.name,
      });
    } else {
      res.status(400);
      throw new Error("Invalid recipe data");
    }
  }
);
