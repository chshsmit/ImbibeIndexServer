import { CustomRequest } from "../../types/Requests/CustomRequest";

interface CreateRecipeBody {
  name: string;
  isPrivate: "Y" | "N";
  collectionId: string;
}

export type CreateRecipeRequest = CustomRequest<CreateRecipeBody>;
