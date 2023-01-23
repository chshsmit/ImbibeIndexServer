import {
  CustomRequest,
  CustomResponse,
} from "../../types/Requests/CustomRequest";

//--------------------------------------------------------------------------------
// Create a collection
//--------------------------------------------------------------------------------

interface CreateCollectionBody {
  name: string;
  parentCollectionId: string | number;
}

export type CreateCollectionRequest = CustomRequest<CreateCollectionBody>;

interface CreateCollectionResponseData {
  collectionName: string;
  parentCollection: string | number;
  id: string | number;
}
export type CreateCollectionResponse =
  CustomResponse<CreateCollectionResponseData>;

//--------------------------------------------------------------------------------
// Get collections for user
//--------------------------------------------------------------------------------

export interface CollectionForUserRecipe {
  name: string;
  tags: Array<string>;
  id: string | number;
}

export interface SubCollection {
  collectionName: string;
  id: string | number;
}

export interface CollectionForUser {
  collectionName: string;
  id: string | number;
  isRootCollection: boolean;
  parentCollection?: string | number;
  subCollections: Array<SubCollection>;
  recipes: Array<CollectionForUserRecipe>;
}

interface GetCollectionsForUserData {
  collections: Record<string | number, CollectionForUser>;
  rootCollectionId: number;
}

export type GetCollectionsForUserResponse =
  CustomResponse<GetCollectionsForUserData>;
