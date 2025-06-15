import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { createChatController } from '../controllers/chatController';

const router = Router();

router.post('/', authenticate, createChatController);

export default router;
