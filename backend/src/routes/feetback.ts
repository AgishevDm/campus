// src/routes/authRoutes.ts
import { Router } from 'express';
import { sendFeetback, sendAnswerController, getFeetbackController, getAllFeetbacksController, deleteFeetbackController, restoreFeetbackController } from '../controllers/feetbackController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/send', authenticate, sendFeetback)
router.post('/sendAnswer', authenticate, sendAnswerController)
router.get('/getFeetbacks', authenticate, getAllFeetbacksController)
router.delete('/:id', authenticate, deleteFeetbackController);
router.put('/:id/restore', authenticate, restoreFeetbackController);
router.get('/:getFeetbackId', authenticate, getFeetbackController)

export default router;