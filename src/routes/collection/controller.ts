import asyncHandler from "express-async-handler";
import Collection from "../../model/Collection";
import {
  CreateCollectionRequest,
  CreateCollectionResponse,
  GetCollectionsForUserResponse,
  GetCollectionsForUserResponseData,
} from "./types";

export const getRootCollectionForUser = asyncHandler(
  async (req, res: GetCollectionsForUserResponse) => {
    const collections = (await Collection.findOne({
      user: req.user.id,
      isRootCollection: true,
    })
      .select("_id collectionName isRootCollection")
      .populate({
        path: "recipes",
        select: "_id name tags",
      })
      .populate({
        path: "collections",
        select: "_id collectionName",
        populate: {
          path: "recipes collections",
          select: "recipes._id name tags collections._id collectionName",
        },
      })) as GetCollectionsForUserResponseData;

    res.status(200).json(collections);
  }
);

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
        id: newCollection.id,
        collectionName: newCollection.collectionName,
        parentCollection: parentCollection.id,
      });
    } else {
      res.status(400);
      throw new Error("Something went wrong creating the new collection");
    }
  }
);
