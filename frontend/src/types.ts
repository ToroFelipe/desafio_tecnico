export type Role = 'admin' | 'user';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
  rut?: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: string;
  user: AuthenticatedUser;
}

export interface ScoreReport {
  rut: string;
  score: number;
  fecha: string;
}

export interface ApiErrorBody {
  error: { code: string; message: string };
}