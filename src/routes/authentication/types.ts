//---------------------------------------------------------------
// Register
//---------------------------------------------------------------

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface RegisterResponse {
  email: string;
}

//---------------------------------------------------------------
// Login
//---------------------------------------------------------------

export interface LoginRequest {
  email: string;
}

export interface LoginResponse {
  firstName: string;
  lastName: string;
  email: string;
}
