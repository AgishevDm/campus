// routes/likeRoutes.ts
import { Router } from 'express';
import {
  toggleLikeController,
  getLikesController,
  checkUserLikeController,
} from '../controllers/likeController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/:postId/like', authenticate, toggleLikeController);
router.get('/:postId/likes', authenticate, getLikesController);
router.get('/:postId/like/check', authenticate, checkUserLikeController);

export default router;