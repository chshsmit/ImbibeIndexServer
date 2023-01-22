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

    // TODO: Make sure the user that submitted this owns the collection the recipe
    //       is going in.
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

//--------------------------------------------------------------------------------

export const likeRecipe = asyncHandler(async (req, res) => {
  const userLike = await prisma.recipeLike.findUnique({
    where: {
      userId_recipeId: {
        userId: Number(req.user.id),
        recipeId: Number(req.params.id),
      },
    },
  });

  if (!userLike) {
    await prisma.recipeLike.create({
      data: {
        userId: Number(req.user.id),
        recipeId: Number(req.params.id),
      },
    });
  } else {
    await prisma.recipeLike.delete({
      where: {
        userId_recipeId: {
          userId: Number(req.user.id),
          recipeId: Number(req.params.id),
        },
      },
    });
  }

  res.status(201).json({ message: "Vote submitted successfully" });
});
