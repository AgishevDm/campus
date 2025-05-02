// src/routes/authRoutes.ts
import { Router } from 'express';
import { getInfoProjectController } from '../controllers/analitycsController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/getUsersInfo', authenticate, getInfoProjectController);


export default router;