import { Router } from 'express';
import { EtisController } from '../controllers/etisController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/sync', authenticate, EtisController.syncEvents);
router.get('/', authenticate, EtisController.getEvents);
router.get('/ical-url', authenticate, EtisController.getIcalUrl);
router.delete('/delete', authenticate, EtisController.deleteEtisCalendar)

export default router;