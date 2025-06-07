import { Router } from 'express';
import { getUserProfileController, getUsersController, createUserController, verifyToken,
    updateUserController, deleteUserController, searchUsersController
 } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';


const router = Router();

router.get('/profile', authenticate, getUserProfileController);
router.post('/getUsers', authenticate, getUsersController);
router.post('/newUser', authenticate, createUserController);
router.get('/search', authenticate, searchUsersController);
router.put('/:userId', authenticate, updateUserController);
router.delete('/delete/:userId', authenticate, deleteUserController)
router.get('/verify', verifyToken);

export default router;