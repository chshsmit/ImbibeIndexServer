import { CustomResponse } from "../../types/Requests/CustomRequest";
import { TagData } from "../tags/types";

export interface FavoriteRecipe {
  id: number;
  name: string;
  createdAt: Date;
  tags: Array<TagData>;
}

export type FavoritesForUserResponse = CustomResponse<Array<FavoriteRecipe>>;
