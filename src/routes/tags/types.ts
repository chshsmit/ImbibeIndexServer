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
  tags: Array<{ id: string; tagName: string }>;
}

export type GetTagsResponse = CustomResponse<GetTagsResponseData>;
