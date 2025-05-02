// src/routes/authRoutes.ts
import { Router } from 'express';
import { get } from '../controllers/faqController'

const router = Router();

router.get('', get);

export default router;