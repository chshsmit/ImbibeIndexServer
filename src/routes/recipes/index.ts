// ----------------------------------------------------
// Imports
// ----------------------------------------------------

import express, { Response } from "express";
import { Collection } from "../../model/Collection";
import { User } from "../../model/User";
import { ErrorResponse } from "../../utils/types";
import {
  CollectionEntryItem,
  CollectionsForUserResponse,
  RecipeEntryItem,
} from "./types";

// interface CollectionEntryItem {
//   type: "recipe" | "collection";
//   name: string;
//   id: string;
//   subCollections: Array<string>;
//   parent: string | null;
// }

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
    const requestUser = req.user as User;

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

// recipeRouter.post(
//   "/collections/user/:userId",
//   async (
//     req: CustomRequest<NewCollectionOrRecipeRequest>,
//     res: Response<NewCollectionOrRecipeResponse | ErrorResponse>
//   ) => {
//     const requestUser = req.user as User;

//     if (
//       requestUser === undefined ||
//       Number(req.params.userId) !== requestUser.id
//     ) {
//       return res.status(401).json({
//         errorCode: "UnauthorizedAccess",
//         message:
//           "Sorry, you must be the user provided to create this new collection or recipe",
//       });
//     }

//     const { id, type, name, parentId } = req.body;

//     // Make sure it has a parent
//     const parentCollection = await CollectionEntry.findOne({
//       where: { id: parentId },
//     });
//     if (!parentCollection)
//       return res.status(401).json({
//         errorCode: "ParentCollectionDoesNotExist",
//         message: "Sorry we did not find a parent collection with that id",
//       });

//     // Make sure the user exists
//     const user = await User.findOne({
//       where: { id: Number(req.params.userId) },
//     });
//     if (!user)
//       return res.status(401).json({
//         errorCode: "UserDoesNotExist",
//         message: "Sorry we did not find a user with your id",
//       });

//     const newCollectionEntry = new CollectionEntry();
//     newCollectionEntry.id = id;
//     newCollectionEntry.type = type;
//     newCollectionEntry.name = name;
//     newCollectionEntry.user = user;
//     newCollectionEntry.parent = parentCollection;

//     await newCollectionEntry.save();

//     if (type === "recipe") {
//       const newRecipe = new Recipe();
//       newRecipe.collectionEntry = newCollectionEntry;

//       await newRecipe.save();
//     }

//     return res.status(200).json({ success: true });
//   }
// );

// ----------------------------------------------------

// recipeRouter.get(
//   "/:recipeId",
//   async (req, res: Response<RecipeResponse | ErrorResponse>) => {
//     const requestUser = (await req.user) as User;

//     const recipe = await Recipe.findOne({
//       where: { recipeId: req.params.recipeId },
//       relations: ["collection", "collection.user"],
//     });

//     if (!recipe)
//       return res.status(404).json({
//         errorCode: "RecipeDoesNotExist",
//         message: "The recipe you requested does not exist",
//       });

//     if (recipe.isPrivate) {
//       if (
//         requestUser === undefined ||
//         requestUser.id !== recipe.collectionEntry.user.id
//       ) {
//         return res.status(401).json({
//           errorCode: "UnauthorizedAccess",
//           message:
//             "Sorry this is a private recipe. Only the user that created it has access",
//         });
//       }
//     }

//     // Desctructuring for Response
//     const { isPrivate, collectionEntryId } = recipe;
//     const { id, name, type } = recipe.collectionEntry;
//     const {
//       email,
//       firstName,
//       lastName,
//       id: userId,
//     } = recipe.collectionEntry.user;

//     return res.status(200).json({
//       collectionEntry: {
//         id,
//         name,
//         type,
//         user: {
//           email,
//           firstName,
//           lastName,
//           id: userId,
//         },
//       },
//       isPrivate,
//       collectionEntryId,
//     });
//   }
// );

export default recipeRouter;
