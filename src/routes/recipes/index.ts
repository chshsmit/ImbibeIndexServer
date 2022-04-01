// ----------------------------------------------------
// Imports
// ----------------------------------------------------

import express from "express";
import { CollectionMap } from "./data";

// ----------------------------------------------------
// Constants
// ----------------------------------------------------

const recipeRouter = express.Router();

// ----------------------------------------------------
// Routes
// ----------------------------------------------------

recipeRouter.get("/", async (req, res) => {
  return res.status(200).json({ recipes: Object.fromEntries(CollectionMap) });
});

// ----------------------------------------------------

recipeRouter.get("/collection/:collectionId", (req, res) => {
  console.log(req.params.collectionId);

  const collection = CollectionMap.get(req.params.collectionId);

  if (collection) {
    return res.status(200).json(collection);
  } else {
    return res.status(200).json({});
  }
});

export default recipeRouter;
