import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { createChatController, getChatsController, getMessagesController, sendMessageController } from '../controllers/chatController';

const router = Router();

router.post('/', authenticate, createChatController);
router.get('/', authenticate, getChatsController);
router.get('/:chatId/messages', authenticate, getMessagesController);
router.post('/message', authenticate, sendMessageController);

export default router;
