import {
  CustomRequest,
  CustomResponse,
} from "../../types/Requests/CustomRequest";

interface RegisterBody {
  name: string;
  email: string;
  displayName: string;
  password: string;
}
export type RegisterRequest = CustomRequest<RegisterBody>;

interface RegisterResponseData {
  id: string;
  name: string;
  email: string;
  displayName: string;
  token: string;
}
export type RegisterResponse = CustomResponse<RegisterResponseData>;

interface LoginBody {
  email: string;
  password: string;
}
export type LoginRequest = CustomRequest<LoginBody>;

interface LoginResponseData {
  id: string;
  name: string;
  email: string;
  displayName: string;
  token: string;
}
export type LoginResponse = CustomResponse<LoginResponseData>;

interface GetSelfResponseData {
  id: string;
  name: string;
  email: string;
  displayName: string;
}
export type GetSelfResponse = CustomResponse<GetSelfResponseData>;
