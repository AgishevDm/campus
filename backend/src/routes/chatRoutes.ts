import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { createChatController, getChatsController, sendMessageController } from '../controllers/chatController';

const router = Router();

router.post('/', authenticate, createChatController);
router.get('/', authenticate, getChatsController);
router.post('/message', authenticate, sendMessageController);

export default router;
