import { Router } from 'express';
import { 
  getNotesController,
  getNoteByIdController,
  createNoteController,
  updateNoteController,
  deleteNoteController,
  shareNoteController,
  getSharedUsersController,
  unshareNoteController
} from '../controllers/noteController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getNotesController);
router.get('/:noteId', authenticate, getNoteByIdController);
router.post('/', authenticate, createNoteController);
router.put('/:noteId', authenticate, updateNoteController);
router.delete('/:noteId', authenticate, deleteNoteController);
router.post('/:noteId/share', authenticate, shareNoteController);
router.get('/:noteId/shared', authenticate, getSharedUsersController);
router.delete('/:noteId/unshare/:userId', authenticate, unshareNoteController);

export default router;