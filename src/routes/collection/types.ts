import { CustomRequest } from "../../types/Requests/CustomRequest";

interface CreateCollectionBody {
  name: string;
  parentCollectionId: string;
}

export type CreateCollectionRequest = CustomRequest<CreateCollectionBody>;
