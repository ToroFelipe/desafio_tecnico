import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { AppError } from '../errors/AppError';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(AppError.notFound('ROUTE_NOT_FOUND', `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
      },
    });
    return;
  }

  console.error('[error-no-controlado]', error);

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Ocurrio un error inesperado.',
      ...(env.NODE_ENV === 'development' && error instanceof Error
        ? { details: error.message }
        : {}),
    },
  });
}