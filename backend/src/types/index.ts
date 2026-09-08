export type Role = 'admin' | 'user';

export interface TokenPayload {
  sub: string;
  role: Role;
  rut?: string;
}

export interface MockUser {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  rut?: string;
}

export interface ScoreResponse {
  rut: string;
  score: number;
  fecha: string;
}