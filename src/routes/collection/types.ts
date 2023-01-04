import {
  CustomRequest,
  CustomResponse,
} from "../../types/Requests/CustomRequest";

//--------------------------------------------------------------------------------
// Create a collection
//--------------------------------------------------------------------------------

interface CreateCollectionBody {
  name: string;
  parentCollectionId: string;
}

export type CreateCollectionRequest = CustomRequest<CreateCollectionBody>;

interface CreateCollectionResponseData {
  collectionName: string;
  parentCollection: string;
  id: string;
}
export type CreateCollectionResponse =
  CustomResponse<CreateCollectionResponseData>;

//--------------------------------------------------------------------------------
// Get collections for user
//--------------------------------------------------------------------------------

interface CollectionForUserRecipe {
  name: string;
  tags: Array<string>;
  id: string;
}

interface SubCollection {
  collectionName: string;
  collections: Array<SubCollection>;
  recipes: Array<CollectionForUserRecipe>;
}

export interface GetCollectionsForUserResponseData {
  id: string;
  collectionName: string;
  isRootCollection: boolean;
  collections: Array<SubCollection>;
  recipes: Array<CollectionForUserRecipe>;
}

export type GetCollectionsForUserResponse =
  CustomResponse<GetCollectionsForUserResponseData>;
