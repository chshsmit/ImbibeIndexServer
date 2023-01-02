import { CustomRequest } from "../../types/Requests/CustomRequest";

interface RegisterBody {
  name: string;
  email: string;
  displayName: string;
  password: string;
}

export type RegisterRequest = CustomRequest<RegisterBody>;

interface LoginBody {
  email: string;
  password: string;
}

export type LoginRequest = CustomRequest<LoginBody>;
