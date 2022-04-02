// ----------------------------------------------------
// Imports
// ----------------------------------------------------

import express, { Response } from "express";
import { Collection } from "../../model/Collection";
import { Recipe } from "../../model/Recipe";
import { User } from "../../model/User";
import { CustomRequest, ErrorResponse } from "../../utils/types";
import {
  CollectionEntryItem,
  CollectionsForUserResponse,
  NewCollectionRequest,
  NewCollectionResponse,
  RecipeEntryItem,
  RecipeResponse,
} from "./types";

// ----------------------------------------------------
// Constants
// ----------------------------------------------------

const recipeRouter = express.Router();

// ----------------------------------------------------
// Routes
// ----------------------------------------------------

/**
 * Collections for a specific user
 */
recipeRouter.get(
  "/collections/user/:userId",
  async (req, res: Response<CollectionsForUserResponse | ErrorResponse>) => {
    const requestUser = (await req.user) as User;

    console.log(requestUser);

    if (
      requestUser === undefined ||
      Number(req.params.userId) !== requestUser.id
    ) {
      return res.status(401).json({
        errorCode: "UnauthorizedAccess",
        message:
          "Sorry, only the user that created these collections can access them",
      });
    }

    const collections = await Collection.find({
      where: { user: { id: Number(req.params.userId) } },
      relations: ["parent", "subCollections", "recipes"],
    });

    if (!collections)
      return res.status(200).json({ recipes: {}, collections: {} });

    const collectionEntryItems: Map<string, CollectionEntryItem> = new Map();
    const recipeEntryItems: Map<string, RecipeEntryItem> = new Map();

    collections.forEach((collection) => {
      const { id, name, parent, subCollections, recipes } = collection;

      const subCollectionIds = subCollections.map(
        (subCollection) => subCollection.id
      );
      const recipeIds = recipes.map((recipe) => recipe.recipeId);

      collectionEntryItems.set(id, {
        id,
        name,
        parent: parent ? parent.id : null,
        recipes: recipeIds,
        subCollections: subCollectionIds,
      });

      recipes.forEach((recipe) => {
        recipeEntryItems.set(recipe.recipeId, {
          recipeId: recipe.recipeId,
          name: recipe.name,
          isPrivate: recipe.isPrivate,
          collectionId: id,
        });
      });
    });

    return res.status(200).json({
      recipes: Object.fromEntries(recipeEntryItems),
      collections: Object.fromEntries(collectionEntryItems),
    });
  }
);

// ----------------------------------------------------

recipeRouter.post(
  "/collections/user/:userId",
  async (
    req: CustomRequest<NewCollectionRequest>,
    res: Response<NewCollectionResponse | ErrorResponse>
  ) => {
    const requestUser = req.user as User;

    if (
      requestUser === undefined ||
      Number(req.params.userId) !== requestUser.id
    ) {
      return res.status(401).json({
        errorCode: "UnauthorizedAccess",
        message:
          "Sorry, you must be the user provided to create this new collection or recipe",
      });
    }

    const { id, name, parentId, isPrivate } = req.body;

    // Make sure it has a parent
    const parentCollection = await Collection.findOne({
      where: { id: parentId },
    });
    if (!parentCollection)
      return res.status(401).json({
        errorCode: "ParentCollectionDoesNotExist",
        message: "Sorry we did not find a parent collection with that id",
      });

    // Make sure the user exists
    const user = await User.findOne({
      where: { id: Number(req.params.userId) },
    });
    if (!user)
      return res.status(401).json({
        errorCode: "UserDoesNotExist",
        message: "Sorry we did not find a user with your id",
      });

    const newCollection = new Collection();
    newCollection.id = id;
    newCollection.name = name;
    newCollection.user = user;
    newCollection.parent = parentCollection;
    newCollection.isPrivateCollection = isPrivate;

    await newCollection.save();

    return res.status(200).json({ success: true });
  }
);

// ----------------------------------------------------

recipeRouter.get(
  "/:recipeId",
  async (req, res: Response<RecipeResponse | ErrorResponse>) => {
    const requestUser = (await req.user) as User;

    const recipe = await Recipe.findOne({
      where: { recipeId: req.params.recipeId },
      relations: ["collection", "collection.user"],
    });

    if (!recipe)
      return res.status(404).json({
        errorCode: "RecipeDoesNotExist",
        message: "The recipe you requested does not exist",
      });

    if (recipe.isPrivate) {
      if (
        requestUser === undefined ||
        requestUser.id !== recipe.collection.user.id
      ) {
        return res.status(401).json({
          errorCode: "UnauthorizedAccess",
          message:
            "Sorry this is a private recipe. Only the user that created it has access",
        });
      }
    }

    // Desctructuring for Response
    const { recipeId, name } = recipe;
    const { id: collectionId } = recipe.collection;

    return res.status(200).json({
      recipeId,
      name,
      collectionId,
    });
  }
);

export default recipeRouter;
