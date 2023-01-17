import {
  CustomRequest,
  CustomResponse,
} from "../../types/Requests/CustomRequest";

//--------------------------------------------------------------------------------
interface CreateIngredientBody {
  name: string;
}
export type CreateIngredientRequest = CustomRequest<CreateIngredientBody>;

interface CreateIngredientResponseData {
  message: string;
}
export type CreateIngredientResponse =
  CustomResponse<CreateIngredientResponseData>;

//--------------------------------------------------------------------------------

type IngredientsArray = Array<{ id: string; name: string }>;

export type GetIngredientsResponse = CustomResponse<IngredientsArray>;
