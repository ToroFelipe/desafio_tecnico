import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import { verifyToken } from '../services/auth.service';
import type { TokenPayload } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    next(AppError.unauthorized('MISSING_TOKEN', 'Falta el token de acceso.'));
    return;
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    next(error);
  }
}