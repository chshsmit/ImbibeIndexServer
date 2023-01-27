import {
  CustomRequest,
  CustomResponse,
} from "../../types/Requests/CustomRequest";

//--------------------------------------------------------------------------------
// Create a collection
//--------------------------------------------------------------------------------

interface CreateCollectionBody {
  name: string;
  parentCollectionId: number;
}

export type CreateCollectionRequest = CustomRequest<CreateCollectionBody>;

interface CreateCollectionResponseData {
  collectionName: string;
  parentCollection: number;
  id: number;
}
export type CreateCollectionResponse =
  CustomResponse<CreateCollectionResponseData>;

//--------------------------------------------------------------------------------
// Get collections for user
//--------------------------------------------------------------------------------

export interface CollectionForUserRecipe {
  name: string;
  tags: Array<string>;
  id: number;
  imageUrl?: string;
}

export interface SubCollection {
  collectionName: string;
  id: number;
}

export interface CollectionForUser {
  collectionName: string;
  id: number;
  isRootCollection: boolean;
  parentCollection?: number;
  subCollections: Array<SubCollection>;
  recipes: Array<CollectionForUserRecipe>;
}

interface GetCollectionsForUserData {
  collections: Record<number, CollectionForUser>;
  rootCollectionId: number;
}

export type GetCollectionsForUserResponse =
  CustomResponse<GetCollectionsForUserData>;
