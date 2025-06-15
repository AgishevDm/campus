import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import {
  createChatController,
  getChatsController,
  getChatMessagesController,
  sendMessageController,
} from '../controllers/chatController';

const router = Router();

router.post('/create', authenticate, createChatController);
router.get('/', authenticate, getChatsController);
router.get('/:chatId/messages', authenticate, getChatMessagesController);
router.post('/send', authenticate, sendMessageController);

export default router;
