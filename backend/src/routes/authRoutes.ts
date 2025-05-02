// src/routes/authRoutes.ts
import { Router } from 'express';
import { signUp, register, logout, sendConfirmationCodeController, verifyConfirmationCodeController, resetAccountPassword } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', signUp);
router.post('/logout', authenticate, logout);
router.post('/send-confirmation-code', sendConfirmationCodeController);
router.post('/verify-confirmation-code', verifyConfirmationCodeController);
router.post('/reset-password', resetAccountPassword)


export default router;