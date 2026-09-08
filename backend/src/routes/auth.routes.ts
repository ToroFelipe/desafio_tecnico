import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { loginController, loginSchema } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validate';
import { env } from '../config/env';

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: () => env.NODE_ENV === 'test',
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Demasiados intentos. Intenta de nuevo en unos minutos.',
    },
  },
});

export const authRouter = Router();

authRouter.post('/', loginRateLimit, validateBody(loginSchema), loginController);