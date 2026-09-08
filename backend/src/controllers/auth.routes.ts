import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { login } from '../services/auth.service';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'El email es obligatorio.').email('Email invalido.'),
  password: z.string().min(1, 'La contrasena es obligatoria.'),
});

export type LoginBody = z.infer<typeof loginSchema>;

export async function loginController(
  req: Request<unknown, unknown, LoginBody>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password } = req.body;
    res.status(200).json(await login(email, password));
  } catch (error) {
    next(error);
  }
}