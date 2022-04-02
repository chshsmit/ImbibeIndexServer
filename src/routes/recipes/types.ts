//---------------------------------------------------------------
// Single Recipe
// GET /:recipeId
//---------------------------------------------------------------

export interface RecipeResponse {
  recipeId: string;
  name: string;
  collectionId: string;
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
