import {
  CustomRequest,
  CustomResponse,
} from "../../types/Requests/CustomRequest";

//--------------------------------------------------------------------------------
// Create a recipe
//--------------------------------------------------------------------------------

interface CreateRecipeBody {
  name: string;
  isPublished: "Y" | "N";
  collectionId: string;
}
export type CreateRecipeRequest = CustomRequest<CreateRecipeBody>;

interface CreateRecipeResponseData {
  id: string | number;
  name: string;
}
export type CreateRecipeResponse = CustomResponse<CreateRecipeResponseData>;

//--------------------------------------------------------------------------------
// Update a Recipe
//--------------------------------------------------------------------------------

interface UpdateRecipeBody {
  name?: string;
  recipeDescription?: string;
  tags?: Array<string>;
  isPublished?: boolean;
}
export type UpdateRecipeRequest = CustomRequest<UpdateRecipeBody>;

interface UpdateRecipeResponseData {
  message: string;
}
export type UpdateRecipeResponse = CustomResponse<UpdateRecipeResponseData>;

//--------------------------------------------------------------------------------
// Get a specific recipe
//--------------------------------------------------------------------------------

interface TakeStep {
  order: number;
  stepText: string;
}

interface TakeIngredient {
  ingredient: { id: string; name: string };
  amount: string;
  order: number;
}

export interface TakeForRecipeResponse {
  id: string;
  takeNumber: number;
  ingredients: Array<TakeIngredient>;
  steps: Array<TakeStep>;
  takeNotes: string;
}
// interface RecipeTake {}

export interface TagForRecipeReponse {
  _id: string;
  tagName: string;
}

interface GetRecipeResponseData {
  id: string;
  name: string;
  createdAt: NativeDate | Date;
  createdBy: {
    displayName: string;
    id: string;
  };
  takes: Array<TakeForRecipeResponse>;
  recipeDescription?: string;
  isEditable: boolean;
  tags: Array<{ id: string; tagName: string }>;
  image?: string;
  isPublished: boolean;
  likes: Array<string>;
  // takes: Array<>;
}
export type GetRecipeResponse = CustomResponse<GetRecipeResponseData>;
