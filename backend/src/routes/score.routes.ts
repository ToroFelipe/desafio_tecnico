import { Router } from 'express';
import { getScoreController } from '../controllers/score.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorizeRutAccess } from '../middlewares/authorizeRutAccess';

export const scoreRouter = Router();

scoreRouter.get('/:rut', authenticate, authorizeRutAccess, getScoreController);