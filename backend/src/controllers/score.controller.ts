import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { AppError } from '../errors/AppError';
import { getScoreReport } from '../services/score.service';
import { hasValidRutFormat, isValidRut } from '../utils/rut';

export function getScoreController(
  req: Request<{ rut: string }>,
  res: Response,
  next: NextFunction,
): void {
  try {
    const { rut } = req.params;

    const isValid = env.VALIDATE_RUT_DV ? isValidRut(rut) : hasValidRutFormat(rut);

    if (!isValid) {
      throw AppError.badRequest('INVALID_RUT', 'El RUT no tiene un formato valido. Ejemplo: 12.345.678-5');
    }

    res.status(200).json(getScoreReport(rut));
  } catch (error) {
    next(error);
  }
}