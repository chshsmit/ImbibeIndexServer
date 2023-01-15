import asyncHandler from "express-async-handler";
import Collection from "../../model/Collection";
import {
  CollectionForUser,
  CollectionForUserRecipe,
  CreateCollectionRequest,
  CreateCollectionResponse,
  GetCollectionsForUserResponse,
  SubCollection,
} from "./types";

//--------------------------------------------------------------------------------

/**
 * @method GET
 * @route /collection/user
 * @protected yes
 */
export const getRootCollectionForUser = asyncHandler(
  async (req, res: GetCollectionsForUserResponse) => {
    const userCollections = await Collection.find({ user: req.user.id })
      .populate<{ recipes: Array<CollectionForUserRecipe> }>({
        path: "recipes",
        select: "_id name tags",
      })
      .populate<{ collections: Array<SubCollection> }>({
        path: "collections",
        select: "_id collectionName",
      });

    const collections: Record<string, CollectionForUser> = {};
    let rootCollectionId = "";
    userCollections.forEach((collection) => {
      if (collection.isRootCollection) {
        rootCollectionId = collection.id;
      }
      const collectionForUser = {
        collectionName: collection.collectionName,
        id: collection.id,
        isRootCollection: collection.isRootCollection,
        subCollections: collection.collections,
        parentCollection: collection.parentCollection?.toString(),
        recipes: collection.recipes,
      };
      collections[collection.id] = collectionForUser;
    });

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
