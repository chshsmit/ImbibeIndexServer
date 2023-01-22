import {
  CustomRequest,
  CustomResponse,
} from "../../types/Requests/CustomRequest";

//--------------------------------------------------------------------------------
// Register
//--------------------------------------------------------------------------------

interface RegisterBody {
  name: string;
  email: string;
  displayName: string;
  password: string;
}
export type RegisterRequest = CustomRequest<RegisterBody>;

interface RegisterResponseData {
  id: number | string;
  name: string;
  email: string;
  displayName: string;
  token: string;
}
export type RegisterResponse = CustomResponse<RegisterResponseData>;

//--------------------------------------------------------------------------------
// Login
//--------------------------------------------------------------------------------

interface LoginBody {
  email: string;
  password: string;
}
export type LoginRequest = CustomRequest<LoginBody>;

interface LoginResponseData {
  id: string | number;
  name: string;
  email: string;
  displayName: string;
  token: string;
}
export type LoginResponse = CustomResponse<LoginResponseData>;

//--------------------------------------------------------------------------------
// Get self
//--------------------------------------------------------------------------------

interface GetSelfResponseData {
  id: string | number;
  name: string;
  email: string;
  displayName: string;
}
export type GetSelfResponse = CustomResponse<GetSelfResponseData>;
