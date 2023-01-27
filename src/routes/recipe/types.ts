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
  collectionId: string | number;
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
  id: number;
}

interface TakeIngredient {
  ingredient: { id: number; name: string };
  amount: string;
  order: number;
  id: number;
}

export interface TakeForRecipeResponse {
  id: number;
  takeNumber: number;
  ingredients: Array<TakeIngredient>;
  steps: Array<TakeStep>;
  takeNotes?: string | null;
}
// interface RecipeTake {}

interface GetRecipeResponseData {
  id: number;
  name: string;
  createdAt: Date;
  createdBy: {
    displayName: string;
    id: number;
  };
  takes: Array<TakeForRecipeResponse>;
  recipeDescription?: string | null;
  isEditable: boolean;
  tags: Array<{ id: number; tagName: string }>;
  image?: string;
  isPublished: boolean;
  likes: Array<number>;
  favoritedUsers: Array<number>;
}
export type GetRecipeResponse = CustomResponse<GetRecipeResponseData>;
