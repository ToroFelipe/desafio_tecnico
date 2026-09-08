import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { findUserByEmail, getNormalizedRut } from '../data/users';
import { AppError } from '../errors/AppError';
import type { TokenPayload } from '../types';

const DUMMY_HASH = '$2a$10$YfK2LggL2tLm6c2hUXxl4eJaXv0pV2kI2c0NFmF7IfRjYIeUSaBr6';

export interface LoginResult {
  token: string;
  expiresIn: string;
  user: { id: string; email: string; role: TokenPayload['role']; rut?: string };
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const user = findUserByEmail(email);
  const passwordMatches = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !passwordMatches) {
    throw AppError.unauthorized('INVALID_CREDENTIALS', 'Email o contraseña incorrectos.');
  }

  const rut = getNormalizedRut(user);

  const payload: TokenPayload = {
    sub: user.id,
    role: user.role,
    ...(user.role === 'user' && rut ? { rut } : {}),
  };

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
    issuer: 'riesgo-financiero-api',
  } as SignOptions);

  return {
    token,
    expiresIn: env.JWT_EXPIRES_IN,
    user: { id: user.id, email: user.email, role: user.role, ...(rut ? { rut } : {}) },
  };
}

export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      issuer: 'riesgo-financiero-api',
    });

    if (typeof decoded === 'string') {
      throw AppError.unauthorized('INVALID_TOKEN', 'Token con formato invalido.');
    }

    return decoded as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw AppError.unauthorized('TOKEN_EXPIRED', 'La sesion expiro. Vuelve a iniciar sesion.');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw AppError.unauthorized('INVALID_TOKEN', 'Token invalido.');
    }
    throw error;
  }
}