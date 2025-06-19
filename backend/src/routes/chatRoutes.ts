import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import {
  getChatsController,
  createPrivateChatController,
  createGroupChatController,
} from '../controllers/chatController';

const router = Router();

router.get('/', authenticate, getChatsController);
router.post('/private', authenticate, createPrivateChatController);
router.post('/group', authenticate, createGroupChatController);

export default router;
