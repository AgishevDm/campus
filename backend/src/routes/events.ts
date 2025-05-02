// src/routes/authRoutes.ts
import { Router } from 'express';
import { create, getAllController, updateEventController, deleteEventController } from '../controllers/eventController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/createEvent', authenticate, create);
router.get('/getAll', authenticate, getAllController);
router.put('/updateEvent/:id', authenticate, updateEventController)
router.delete('/deleteEvent/:id', authenticate, deleteEventController)

export default router;