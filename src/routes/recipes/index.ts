// ----------------------------------------------------
// Imports
// ----------------------------------------------------

import express, { Response } from "express";
import { CollectionEntry } from "../../model/CollectionEntry";
import { Recipe } from "../../model/Recipe";
import { User } from "../../model/User";
import { CustomRequest, ErrorResponse } from "../../utils/types";
import { CollectionEntryMap } from "./data";
import { NewCollectionOrRecipeRequest, RecipesForUserResponse } from "./types";

interface CollectionEntryItem {
  type: "recipe" | "collection";
  name: string;
  id: string;
  subCollections: Array<string>;
  parent: string | null;
}

// ----------------------------------------------------
// Constants
// ----------------------------------------------------

const recipeRouter = express.Router();

// ----------------------------------------------------
// Routes
// ----------------------------------------------------

recipeRouter.get(
  "/user/:userId",
  async (req, res: Response<RecipesForUserResponse | ErrorResponse>) => {
    return res
      .status(200)
      .json({ recipes: Object.fromEntries(CollectionEntryMap) });
  }
);

// ----------------------------------------------------

/**
 * Collections for a specific user
 */
recipeRouter.get("/collections/user/:userId", async (req, res) => {
  // TODO: COMPARE TO USER ACCESSING
  const collections = await CollectionEntry.find({
    where: { user: { id: Number(req.params.userId) } },
    relations: ["parent", "subCollections"],
  });

  if (!collections) return res.status(200).json({});

  const collectionEntryItems: Map<string, CollectionEntryItem> = new Map();

  collections.forEach((collectionEntry) => {
    const { id, type, name, parent, subCollections } = collectionEntry;

    const subCollectionIds = subCollections.map(
      (subCollection) => subCollection.id
    );

    collectionEntryItems.set(collectionEntry.id, {
      id,
      type,
      name,
      parent: parent ? parent.id : null,
      subCollections: subCollectionIds,
    });
  });

  return res
    .status(200)
    .json({ recipes: Object.fromEntries(collectionEntryItems) });
});

// ----------------------------------------------------

recipeRouter.get("/:recipeId", async (req, res) => {
  const user = (await req.user) as User;

  const recipe = await Recipe.findOne({
    where: { collectionEntryId: req.params.recipeId },
    relations: ["collectionEntry", "collectionEntry.user"],
  });

  if (!recipe)
    return res.status(404).json({ success: false, message: "could not find" });

  if (recipe.isPrivate) {
    if (user === undefined || user.id !== recipe.collectionEntry.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "this is a private recipe" });
    }
  }

  return res.status(200).json({
    collectionEntry: {
      id: recipe.collectionEntry.id,
      name: recipe.collectionEntry.name,
      type: recipe.collectionEntry.type,
      user: {
        email: recipe.collectionEntry.user.email,
        firstName: recipe.collectionEntry.user.firstName,
        lastName: recipe.collectionEntry.user.lastName,
        id: recipe.collectionEntry.user.id,
      },
    },
    isPrivate: recipe.isPrivate,
    collectionEntryId: recipe.collectionEntryId,
  });
});

// ----------------------------------------------------

// TODO: COMPARE TO USER MAKING REQUEST
recipeRouter.post(
  "/collections/user/:userId",
  async (req: CustomRequest<NewCollectionOrRecipeRequest>, res) => {
    const { id, type, name, parentId } = req.body;

    // Make sure it has a parent
    const parentCollection = await CollectionEntry.findOne({
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

    const newCollectionEntry = new CollectionEntry();
    newCollectionEntry.id = id;
    newCollectionEntry.type = type;
    newCollectionEntry.name = name;
    newCollectionEntry.user = user;
    newCollectionEntry.parent = parentCollection;

    await newCollectionEntry.save();

    if (type === "recipe") {
      const newRecipe = new Recipe();
      newRecipe.collectionEntry = newCollectionEntry;

      await newRecipe.save();
    }

    return res.status(200).json({ success: true });
  }
);

export default recipeRouter;
