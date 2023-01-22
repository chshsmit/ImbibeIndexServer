import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import { CreateCollectionRequest, CreateCollectionResponse } from "./types";

const prisma = new PrismaClient();

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
