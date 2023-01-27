//--------------------------------------------------------------------------------
// Create tags
//--------------------------------------------------------------------------------

import {
  CustomRequest,
  CustomResponse,
} from "../../types/Requests/CustomRequest";

interface CreateTagsBody {
  tags: Array<string>;
}

export type CreateTagsRequest = CustomRequest<CreateTagsBody>;

interface CreateTagsResponseData {
  message: string;
}

export type CreateTagsResponse = CustomResponse<CreateTagsResponseData>;

//--------------------------------------------------------------------------------
// Get all tags
//--------------------------------------------------------------------------------

interface GetTagsResponseData {
  tags: Array<TagData>;
}

export type GetTagsResponse = CustomResponse<GetTagsResponseData>;

// Overall tag data
export interface TagData {
  id: number;
  tagName: string;
}
