import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import { getImageForRecipe } from "../../utils/utils";
import { FavoriteRecipe, FavoritesForUserResponse } from "./types";

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

export const getFavoritesForUser = asyncHandler(
  async (req, res: FavoritesForUserResponse) => {
    const userId = Number(req.user.id);

    const favoritesForUser = await prisma.favoriteForUser.findMany({
      where: {
        userId,
      },
      select: {
        recipe: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            isPublished: true,
            user: {
              select: {
                displayName: true,
                id: true,
              },
            },
            tags: {
              select: {
                tag: {
                  select: {
                    tagName: true,
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const responseData: Array<FavoriteRecipe> = await Promise.all(
      favoritesForUser
        .filter((favorite) => {
          return (
            favorite.recipe.isPublished || favorite.recipe.user.id === userId
          );
        })
        .map(async (favorite) => {
          const imageUrl = await getImageForRecipe(favorite.recipe.id);

          return {
            id: favorite.recipe.id,
            name: favorite.recipe.name,
            createdAt: favorite.recipe.createdAt,
            createdBy: favorite.recipe.user.displayName,
            imageUrl,
            tags: favorite.recipe.tags.map((tag) => {
              return {
                id: tag.tag.id,
                tagName: tag.tag.tagName,
              };
            }),
          };
        })
    );

    res.status(200).json(responseData);
  }
);
