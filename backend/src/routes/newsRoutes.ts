// src/routes/authRoutes.ts
import { Router } from 'express';
import { createNewsController, deleteNewsController, getAllNewsController, updateNewsController, updateFavorite } from '../controllers/newsController';
import { authenticate } from '../middleware/authMiddleware';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post('/create', authenticate, upload.array('images', 10), createNewsController)
router.get('/allNews', authenticate, getAllNewsController)
router.delete('/delete/:id', authenticate, deleteNewsController)
router.put('/update/:id', authenticate, upload.array('newImages', 10), updateNewsController)
router.put('/updateFavorite/:id', authenticate, updateFavorite)

export default router;