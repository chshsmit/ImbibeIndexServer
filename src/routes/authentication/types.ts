//---------------------------------------------------------------
// Register
//---------------------------------------------------------------

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface RegisterResponse {
  success: boolean;
  error: string;
}

//---------------------------------------------------------------
// Login
//---------------------------------------------------------------

export interface LoginRequest {
  email: string;
}

export interface LoginResponse {
  data: {
    firstName: string;
    lastName: string;
    email: string;
  };
  error: string | null;
}
