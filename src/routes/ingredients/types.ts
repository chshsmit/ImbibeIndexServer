import {
  CustomRequest,
  CustomResponse,
} from "../../types/Requests/CustomRequest";

interface CreateIngredientBody {
  name: string;
}
export type CreateIngredientRequest = CustomRequest<CreateIngredientBody>;

interface CreateIngredientResponseData {
  message: string;
}
export type CreateIngredientResponse =
  CustomResponse<CreateIngredientResponseData>;
