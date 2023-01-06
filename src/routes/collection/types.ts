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

export interface CollectionForUserRecipe {
  name: string;
  tags: Array<string>;
  id: string;
}

export interface SubCollection {
  collectionName: string;
  id: string;
}

export interface CollectionForUser {
  collectionName: string;
  id: string;
  isRootCollection: boolean;
  parentCollection?: string;
  subCollections: Array<SubCollection>;
  recipes: Array<CollectionForUserRecipe>;
}

interface GetCollectionsForUserData {
  collections: Record<string, CollectionForUser>;
  rootCollectionId: string;
}

export type GetCollectionsForUserResponse =
  CustomResponse<GetCollectionsForUserData>;
