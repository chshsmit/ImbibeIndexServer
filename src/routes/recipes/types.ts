//---------------------------------------------------------------

import { Recipe } from "../../model/Recipe";

export interface RecipeResponse {
  recipe: Recipe;
}

//---------------------------------------------------------------
// Create new Recipe
// POST /
//---------------------------------------------------------------

export interface CreateRecipeRequest {
  id: string;
  name: string;
  parentId: string;
  isPrivate: boolean;
  type: "cocktail" | "syrup" | "liqueur" | "other";
}

export interface CreateRecipeResponse {
  success: boolean;
  id: string;
}
