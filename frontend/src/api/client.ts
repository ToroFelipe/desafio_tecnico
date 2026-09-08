import type { ApiErrorBody, LoginResponse, ScoreReport } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options: { method?: 'GET' | 'POST'; body?: unknown; token?: string | null } = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', 'No se pudo conectar con el servidor.');
  }

  if (!response.ok) {
    try {
      const payload = (await response.json()) as Partial<ApiErrorBody>;
      if (!payload.error) throw new ApiError(response.status, 'UNKNOWN_ERROR', 'Error desconocido.');
      throw new ApiError(response.status, payload.error.code, payload.error.message);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(response.status, 'UNKNOWN_ERROR', 'Error al procesar la respuesta.');
    }
  }

  return (await response.json()) as T;
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('/login', { method: 'POST', body: { email, password } });
}

export function fetchScore(rut: string, token: string): Promise<ScoreReport> {
  return request<ScoreReport>(`/score/${encodeURIComponent(rut)}`, { token });
}