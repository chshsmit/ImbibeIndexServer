// ----------------------------------------------------
// Imports
// ----------------------------------------------------

import express, { Response } from "express";
import { Ingredient } from "../../model/Ingredients";
import { User } from "../../model/User";
import { CustomRequest, ErrorResponse } from "../../utils/types";
import {
  CreateIngredientRequest,
  CreateIngredientResponse,
  GetUserIngredientsResponse,
} from "./types";

// ----------------------------------------------------
// Constants
// ----------------------------------------------------

const ingredientsRouter = express.Router();

// ----------------------------------------------------
// Routes
// ----------------------------------------------------

ingredientsRouter.get(
  "/:userId",
  async (req, res: Response<GetUserIngredientsResponse>) => {
    const userIngredients = await Ingredient.find({
      where: { user: { id: Number(req.params.userId) } },
    });

    return res.status(200).json({ userIngredients });
  }
);

// ----------------------------------------------------

// TODO: Allow users to create recipes for their ingredients
ingredientsRouter.post(
  "/",
  async (
    req: CustomRequest<CreateIngredientRequest>,
    res: Response<CreateIngredientResponse | ErrorResponse>
  ) => {
    const { userId, name } = req.body;

    // if (requestUser.id !== userId) {
    //   return res.status(401).json({
    //     errorCode: "UnauthorizedAccess",
    //     message:
    //       "Sorry you must be the user provided to create this ingredient",
    //   });
    // }

    const user = await User.findOne({ where: { id: userId } });
    if (!user)
      return res.status(404).json({
        errorCode: "UserNotFound",
        message: `Could not find user with id: [${userId}]`,
      });

    const newIngredient = new Ingredient();
    newIngredient.ingredientName = name;
    newIngredient.user = user;

    await newIngredient.save();

    const userIngredients = await Ingredient.find({
      where: { user: { id: userId } },
    });

    return res.status(200).json({ success: true, userIngredients });
  }
);

export default ingredientsRouter;
