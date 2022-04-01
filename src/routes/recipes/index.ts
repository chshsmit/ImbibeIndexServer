// ----------------------------------------------------
// Imports
// ----------------------------------------------------

import express, { Response } from "express";
import { ErrorResponse } from "../../utils/types";
import { CollectionEntryMap } from "./data";
import { RecipesForUserResponse } from "./types";

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
    console.log(req.params.userId);

    return res
      .status(200)
      .json({ recipes: Object.fromEntries(CollectionEntryMap) });
  }
);

export default recipeRouter;
