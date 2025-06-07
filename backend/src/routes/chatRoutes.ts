import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { createChatController, getChatsController, createMessageController, getMessagesController } from '../controllers/chatController';

const router = Router();

router.post('/chats', authenticate, createChatController);
router.get('/chats', authenticate, getChatsController);
router.post('/chats/:chatId/messages', authenticate, createMessageController);
router.get('/chats/:chatId/messages', authenticate, getMessagesController);

export default router;
