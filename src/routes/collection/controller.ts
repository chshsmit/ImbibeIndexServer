import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import { getImageForRecipe } from "../../utils/utils";
import {
  CollectionForUser,
  CreateCollectionRequest,
  CreateCollectionResponse,
  GetCollectionsForUserResponse,
} from "./types";

const prisma = new PrismaClient();

//--------------------------------------------------------------------------------

/**
 * @method GET
 * @route /collection/user
 * @protected yes
 */
export const getRootCollectionForUser = asyncHandler(
  async (req, res: GetCollectionsForUserResponse) => {
    const allCollectionsForUser = await prisma.collection.findMany({
      where: {
        userId: Number(req.user.id),
      },
      include: {
        recipes: {
          include: {
            tags: {
              include: {
                tag: {
                  select: {
                    id: true,
                    tagName: true,
                  },
                },
              },
            },
          },
        },
        subCollections: {
          select: {
            id: true,
            collectionName: true,
          },
        },
      },
    });

    const collections: Record<number, CollectionForUser> = {};
    let rootCollectionId = 0;

    for (const collection of allCollectionsForUser) {
      if (collection.isRootCollection) {
        rootCollectionId = collection.id;
      }

      const recipes = await Promise.all(
        collection.recipes.map(async (recipe) => {
          const recipeImageUrl = await getImageForRecipe(recipe.id);
          return {
            name: recipe.name,
            id: recipe.id,
            tags: recipe.tags.map((tag) => tag.tag.tagName),
            imageUrl: recipeImageUrl,
          };
        })
      );

      const collectionForUser: CollectionForUser = {
        collectionName: collection.collectionName,
        id: collection.id,
        isRootCollection: collection.isRootCollection,
        subCollections: collection.subCollections,
        parentCollection: collection.parentCollectionId ?? undefined,
        recipes,
      };

      collections[collection.id] = collectionForUser;
    }

    res.status(200).json({
      collections,
      rootCollectionId,
    });
  }
);

//--------------------------------------------------------------------------------

/**
 * @method POST
 * @route /collection
 * @protected yes
 */
export const createCollection = asyncHandler(
  async (req: CreateCollectionRequest, res: CreateCollectionResponse) => {
    const { name, parentCollectionId } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("You must provide a name for your collection");
    } else if (!parentCollectionId) {
      res.status(400);
      throw new Error("You must provide the parent collection");
    }

    const parentCollection = await prisma.collection.findUnique({
      where: {
        id: Number(parentCollectionId),
      },
    });

    if (!parentCollection) {
      res.status(400);
      throw new Error(
        `There is no collection with the id [${parentCollectionId}]`
      );
    }

    const newCollection = await prisma.collection.create({
      data: {
        userId: Number(req.user.id),
        collectionName: name,
        isRootCollection: false,
        parentCollectionId: Number(parentCollectionId),
      },
    });

    if (newCollection) {
      res.status(201).json({
        id: newCollection.id,
        collectionName: newCollection.collectionName,
        parentCollection: newCollection.parentCollectionId!,
      });
    } else {
      res.status(400);
      throw new Error("Something went wrong creating the new collection");
    }
  }
);
