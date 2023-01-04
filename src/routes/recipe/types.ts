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
// Get a specific recipe
//--------------------------------------------------------------------------------

interface GetRecipeResponseData {
  name: string;
  createdAt: NativeDate | Date;
  createdBy: {
    name: string;
    displayName: string;
  };
}
export type GetRecipeResponse = CustomResponse<GetRecipeResponseData>;
