import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

//--------------------------------------------------------------------------------

export const favoriteOrUnfavoriteRecipe = asyncHandler(async (req, res) => {
  const recipeId = Number(req.params.recipeId);
  const userId = Number(req.user.id);

  const userFavoriteForRecipe = await prisma.favoriteForUser.findUnique({
    where: {
      userId_recipeId: {
        userId,
        recipeId,
      },
    },
  });

  if (!userFavoriteForRecipe) {
    await prisma.favoriteForUser.create({
      data: {
        userId,
        recipeId,
      },
    });
    res.status(201).json({ message: "Added to favorites" });
  } else {
    await prisma.favoriteForUser.delete({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });
    res.status(201).json({ message: "Removed from favorites" });
  }
});

//--------------------------------------------------------------------------------

// TODO: Get information for sub recipe
export const getFavoritesForUser = asyncHandler(async (req, res) => {
  const userId = Number(req.user.id);

  const favoritesForUser = await prisma.favoriteForUser.findMany({
    where: {
      userId,
    },
  });

  res.status(200).json(favoritesForUser);
});
