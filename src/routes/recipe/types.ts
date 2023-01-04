import { CustomRequest } from "../../types/Requests/CustomRequest";

interface CreateRecipeBody {
  name: string;
  isPrivate: "Y" | "N";
}

export type CreateRecipeRequest = CustomRequest<CreateRecipeBody>;
