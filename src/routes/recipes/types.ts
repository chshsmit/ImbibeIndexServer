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
}

export interface CollectionsForUserResponse {
  collections: { [k: string]: CollectionEntryItem };
  recipes: { [k: string]: RecipeEntryItem };
}

//---------------------------------------------------------------
// New Collection or Recipe
// POST /collections/user/:userId
//---------------------------------------------------------------

export interface NewCollectionOrRecipeRequest {
  id: string;
  type: "collection" | "recipe";
  name: string;
  parentId: string;
}

export interface NewCollectionOrRecipeResponse {
  success: boolean;
}

//---------------------------------------------------------------
// Single Recipe
// GET /:recipeId
//---------------------------------------------------------------

export interface RecipeResponse {
  collectionEntry: {
    id: string;
    name: string;
    type: "collection" | "recipe";
    user: {
      email: string;
      firstName: string;
      lastName: string;
      id: number;
    };
  };
  isPrivate: boolean;
  collectionEntryId: string;
}
