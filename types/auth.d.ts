export interface User {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    username: string;
  };
}

export interface JWTPayload {
  username: string;
  iat?: number;
  exp?: number;
} 