import {
  CustomRequest,
  CustomResponse,
} from "../../types/Requests/CustomRequest";

//--------------------------------------------------------------------------------
// Create a recipe
//--------------------------------------------------------------------------------

interface CreateRecipeBody {
  name: string;
  isPrivate: "Y" | "N";
  collectionId: string;
}
export type CreateRecipeRequest = CustomRequest<CreateRecipeBody>;

interface CreateRecipeResponseData {
  id: string;
  name: string;
}
export type CreateRecipeResponse = CustomResponse<CreateRecipeResponseData>;

//--------------------------------------------------------------------------------
// Update a Recipe
//--------------------------------------------------------------------------------

interface UpdateRecipeBody {
  name?: string;
  recipeDescription?: string;
}
export type UpdateRecipeRequest = CustomRequest<UpdateRecipeBody>;

interface UpdateRecipeResponseData {
  message: string;
}
export type UpdateRecipeResponse = CustomResponse<UpdateRecipeResponseData>;

//--------------------------------------------------------------------------------
// Get a specific recipe
//--------------------------------------------------------------------------------

export interface TakeForRecipeResponse {
  id: string;
  takeNumber: number;
  ingredients: Array<any>;
}
// interface RecipeTake {}

interface GetRecipeResponseData {
  name: string;
  createdAt: NativeDate | Date;
  createdBy: {
    displayName: string;
    id: string;
  };
  takes: Array<TakeForRecipeResponse>;
  recipeDescription?: string;
  // takes: Array<>;
}
export type GetRecipeResponse = CustomResponse<GetRecipeResponseData>;
