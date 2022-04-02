//---------------------------------------------------------------
// Collections and Recipes for a User
// GET /collections/user/:userId
//---------------------------------------------------------------

export interface CollectionEntryItem {
  name: string;
  id: string;
  parent: string;
  subCollections: Array<string>;
  recipes: Array<string>;
}

export interface RecipeEntryItem {
  recipeId: string;
  name: string;
  isPrivate: boolean;
  collectionId: string;
  type: "cocktail" | "syrup" | "liqueur" | "other";
}

export interface CollectionsForUserResponse {
  collections: { [k: string]: CollectionEntryItem };
  recipes: { [k: string]: RecipeEntryItem };
}

//---------------------------------------------------------------
// New Collection or Recipe
// POST /collections/user/:userId
//---------------------------------------------------------------

export interface NewCollectionRequest {
  id: string;
  name: string;
  parentId: string;
  isPrivate: boolean;
}

export interface NewCollectionResponse {
  success: boolean;
}
