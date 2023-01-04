import asyncHandler from "express-async-handler";
import Collection from "../../model/Collection";
import { CreateCollectionRequest } from "./types";

export const createCollection = asyncHandler(
  async (req: CreateCollectionRequest, res) => {
    const { name, parentCollectionId } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("You must provide a name for your collection");
    } else if (!parentCollectionId) {
      res.status(400);
      throw new Error("You must provide the parent collection");
    }

    const parentCollection = await Collection.findById(parentCollectionId);

    if (!parentCollection) {
      res.status(400);
      throw new Error(
        `There is no collection with the id [${parentCollectionId}]`
      );
    }

    const newCollection = await Collection.create({
      user: req.user.id,
      collectionName: name,
      isRootCollection: false,
      parentCollection: parentCollectionId,
      collections: [],
      recipes: [],
    });

    if (newCollection) {
      await parentCollection.updateOne({
        $push: { collections: newCollection.id },
      });

      res.status(201).json({
        collectionName: newCollection.collectionName,
        parentCollection: newCollection.parentCollection,
        collections: newCollection.collections,
        recipes: newCollection.recipes,
      });
    } else {
      res.status(400);
      throw new Error("Something went wrong creating the new collection");
    }
  }
);
