import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { createChatController, getChatsController } from '../controllers/chatController';

const router = Router();

router.post('/create', authenticate, createChatController);
router.get('/', authenticate, getChatsController);

export default router;
