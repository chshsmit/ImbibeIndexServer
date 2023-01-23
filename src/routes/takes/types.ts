import { CustomRequest } from "../../types/Requests/CustomRequest";

interface CreateOrUpdateTakeBody {
  takeNumber: number;
  steps?: Array<{ order: number; stepText: string; id?: number }>;
  ingredients?: Array<{
    id?: number;
    amount: string;
    order: number;
    ingredient: { id: string | number };
  }>;
  takeNotes?: string;
  deletedSteps: Array<number>;
  deletedIngredients: Array<number>;
}

export type CreateTakeRequest = CustomRequest<CreateOrUpdateTakeBody>;
