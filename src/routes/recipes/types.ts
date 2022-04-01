//---------------------------------------------------------------
// Recipes for user
//---------------------------------------------------------------

import { CollectionEntry } from "./data";

export interface RecipesForUserResponse {
  recipes: { [k: string]: CollectionEntry };
}

export interface NewCollectionOrRecipeRequest {
  id: string;
  type: "collection" | "recipe";
  name: string;
  parentId: string;
}
