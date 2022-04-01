//---------------------------------------------------------------
// Recipes for user
//---------------------------------------------------------------

import { CollectionEntry } from "./data";

export interface RecipesForUserResponse {
  recipes: { [k: string]: CollectionEntry };
}
