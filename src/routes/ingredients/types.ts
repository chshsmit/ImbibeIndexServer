import {
  CustomRequest,
  CustomResponse,
} from "../../types/Requests/CustomRequest";

//--------------------------------------------------------------------------------
interface CreateIngredientBody {
  name: string;
  category?: string;
}
export type CreateIngredientRequest = CustomRequest<CreateIngredientBody>;

interface CreateIngredientResponseData {
  message: string;
}
export type CreateIngredientResponse =
  CustomResponse<CreateIngredientResponseData>;

//--------------------------------------------------------------------------------

interface UpdateIngredientBody {
  name?: string;
  category?: string;
}

export type UpdateIngredientRequest = CustomRequest<UpdateIngredientBody>;
//--------------------------------------------------------------------------------

type IngredientsArray = Array<{
  id: string | number;
  name: string;
  category?: string | null;
}>;

export type GetIngredientsResponse = CustomResponse<IngredientsArray>;
