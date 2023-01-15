import { CustomRequest } from "../../types/Requests/CustomRequest";

interface CreateTakeBody {
  takeNumber: number;
  steps?: Array<{ order: number; stepText: string }>;
  ingredients?: Array<{
    amount: number;
    unit: string;
    ingredient: { id: string };
  }>;
  takeNotes?: string;
}

export type CreateTakeRequest = CustomRequest<CreateTakeBody>;
