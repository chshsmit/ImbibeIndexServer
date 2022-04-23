//---------------------------------------------------------------

import { Recipe } from "../../model/Recipe";

export interface RecipeResponse {
  recipe: Recipe;
}

//---------------------------------------------------------------
// Create new Recipe
// POST /user/:userId
//---------------------------------------------------------------

export interface CreateRecipeRequest {
  id: string;
  name: string;
  parentId: string;
  isPrivate: boolean;
  type: "cocktail" | "ingredient";
  ingredientId?: number;
}

export interface CreateRecipeResponse {
  success: boolean;
  id: string;
}

//---------------------------------------------------------------
// Update a recipe's take
// POST /take/:takeId
//---------------------------------------------------------------

interface IngredientRequestItem {
  ingredientAmount: string;
  ingredientUnit: string;
  ingredientId: number;
}

export interface UpdateTakeRequest {
  takeNotes?: string;
  ingredients?: Array<IngredientRequestItem>;
}

export interface UpdateTakeResponse {
  takeNotes?: string;
}
