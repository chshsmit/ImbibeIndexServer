import { CustomRequest } from "../../types/Requests/CustomRequest";

interface CreateOrUpdateTakeBody {
  takeNumber: number;
  steps?: Array<{ order: number; stepText: string }>;
  ingredients?: Array<{
    amount: string;
    order: number;
    ingredient: { id: string };
  }>;
  takeNotes?: string;
}

export type CreateTakeRequest = CustomRequest<CreateOrUpdateTakeBody>;
