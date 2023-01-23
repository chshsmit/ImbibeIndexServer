import { PrismaClient } from "@prisma/client";
import { S3 } from "aws-sdk";
import asyncHandler from "express-async-handler";
import fs from "fs";
import { getImageForRecipe } from "../../utils/utils";
import {
  CreateRecipeRequest,
  CreateRecipeResponse,
  GetRecipeResponse,
  UpdateRecipeRequest,
  UpdateRecipeResponse,
} from "./types";

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

//--------------------------------------------------------------------------------

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No image was provided");
  }

  const recipe = await prisma.recipe.findUnique({
    where: {
      id_userId: {
        id: Number(req.params.id),
        userId: Number(req.user.id),
      },
    },
  });

  if (!recipe) {
    res.status(404);
    throw new Error("We did not find the recipe you are looking for.");
  }

  const s3 = new S3({
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET!,
    },
  });

  const fileContent = fs.readFileSync(req.file.path);

  const params: S3.PutObjectRequest = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: `picture-for-recipe-${recipe.id}`,
    Body: fileContent,
  };

  s3.upload(params, function (err) {
    if (err) {
      res.status(400);
      throw new Error("Something went wrong");
    } else {
      fs.unlink(req.file!.path, () => {
        console.log("Deleted file");
      });
      res.status(201).json({ message: "Upload success" });
    }
  });
});

//--------------------------------------------------------------------------------

/**
 * @method PATCH
 * @route /recipe/:id
 * @protected yes
 */
export const updateRecipe = asyncHandler(
  async (req: UpdateRecipeRequest, res: UpdateRecipeResponse) => {
    let createTags: { tagId: number }[] = [];
    if (req.body.tags) {
      createTags = req.body.tags.map((tagId) => {
        const numberTag = Number(tagId);

        return {
          tagId: numberTag,
        };
      });
    }

    // TODO: Figure out how to solve the tags issue more elegantly
    // There should be a way to delete and create in the same request

    // Delete all the tags for now
    await prisma.recipe.update({
      where: {
        id_userId: {
          id: Number(req.params.id),
          userId: Number(req.user.id),
        },
      },
      data: {
        tags: {
          deleteMany: {},
        },
      },
      include: {
        tags: true,
      },
    });

    await prisma.recipe.update({
      where: {
        id_userId: {
          id: Number(req.params.id),
          userId: Number(req.user.id),
        },
      },
      data: {
        ...req.body,
        tags: {
          create: createTags,
        },
      },
    });

    res.status(200).json({
      message: "Successfully updated recipe",
    });
  }
);

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

/**
 * @method GET
 * @route /recipe/:id
 * @protected semi-protected
 */

export const getRecipeById = asyncHandler(
  async (req, res: GetRecipeResponse) => {
    const recipe = await prisma.recipe.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        user: true,
        tags: {
          include: {
            tag: true,
          },
        },
        takes: {
          include: {
            ingredients: {
              include: {
                ingredient: true,
              },
            },
            steps: true,
          },
        },
        likes: true,
      },
    });

    if (!recipe) {
      res.status(404);
      throw new Error(`Recipe with id ${req.params.id} was not found`);
    }

    if (!recipe.isPublished) {
      if (!req.user || Number(req.user.id) !== recipe.user.id) {
        res.status(404);
        throw new Error("We could not find the recipe you were looking for");
      }
    }

    // Get image
    const imageUrl = await getImageForRecipe(recipe.id);

    let isEditable = false;
    if (req.user && req.user.id === recipe.user.id) isEditable = true;

    res.status(200).json({
      id: recipe.id,
      name: recipe.name,
      takes: recipe.takes.map((take) => {
        return {
          id: take.id,
          takeNumber: take.takeNumber,
          takeNotes: take.takeNotes,
          ingredients: take.ingredients.map((ingredient) => {
            return {
              ingredient: {
                id: ingredient.ingredient.id,
                name: ingredient.ingredient.name,
              },
              amount: ingredient.amount,
              order: ingredient.order,
            };
          }),
          steps: take.steps.map((step) => {
            return {
              order: step.order,
              stepText: step.stepText,
            };
          }),
        };
      }),
      recipeDescription: recipe.recipeDescription,
      isPublished: recipe.isPublished,
      createdBy: {
        displayName: recipe.user.displayName,
        id: recipe.user.id,
      },
      createdAt: recipe.createdAt,
      isEditable,
      tags: recipe.tags.map((tag) => {
        return { id: tag.tagId, tagName: tag.tag.tagName };
      }),
      image: imageUrl,
      likes: recipe.likes.map((like) => like.userId),
    });
  }
);
