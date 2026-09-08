import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import { normalizeRut } from '../utils/rut';

export function authorizeRutAccess(req: Request, _res: Response, next: NextFunction): void {
  const user = req.user;

  if (!user) {
    next(AppError.unauthorized('MISSING_TOKEN', 'Request sin usuario autenticado.'));
    return;
  }

  if (user.role === 'admin') {
    next();
    return;
  }

  if (!user.rut) {
    next(AppError.forbidden('RUT_NOT_IN_TOKEN', 'Tu token no tiene un RUT asociado.'));
    return;
  }

  const requestedRut = normalizeRut(req.params['rut'] ?? '');

  if (requestedRut !== normalizeRut(user.rut)) {
    next(AppError.forbidden('RUT_FORBIDDEN', 'No tienes permiso para consultar el score de otro RUT.'));
    return;
  }

  next();
}