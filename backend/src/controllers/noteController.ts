import { Request, Response } from 'express';
import { 
  getNotesByAccount,
  getNoteById,
  createNote,
  updateNote,
  deleteNote, 
  shareNote,
  addHistoryEntry,
//   getNoteHistory
} from '../services/noteService';
import prisma from '../prisma';

export const getNotesController = async (req: Request, res: Response) => {
  try {
    const accountId = req.user?.primarykey;
    if (!accountId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const notes = await getNotesByAccount(accountId);
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error in getNotesController:', error);
    res.status(500).json({ message: 'Error fetching notes' });
  }
};

export const getNoteByIdController = async (req: Request, res: Response) => {
  try {
    const accountId = req.user?.primarykey;
    const noteId = req.params.noteId;

    if (!accountId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const note = await getNoteById(noteId, accountId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error('Error in getNoteByIdController:', error);
    res.status(500).json({ message: 'Error fetching note' });
  }
};

export const createNoteController = async (req: Request, res: Response) => {
  try {
    const accountId = req.user?.primarykey;
    const { title, content, listType } = req.body;

    if (!accountId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const newNote = await createNote(title, content, listType, accountId);
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error in createNoteController:', error);
    res.status(500).json({ message: 'Error creating note' });
  }
};

export const updateNoteController = async (req: Request, res: Response) => {
  try {
    const accountId = req.user?.primarykey;
    const noteId = req.params.noteId;
    const { title, content, listType } = req.body;

    if (!accountId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const updatedNote = await updateNote(noteId, title, content, listType, accountId);
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error('Error in updateNoteController:', error);
    res.status(500).json({ message: 'Error updating note' });
  }
};

export const deleteNoteController = async (req: Request, res: Response) => {
  try {
    const accountId = req.user?.primarykey;
    const noteId = req.params.noteId;

    if (!accountId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    await deleteNote(noteId, accountId);
    res.status(204).end();
  } catch (error) {
    console.error('Error in deleteNoteController:', error);
    res.status(500).json({ message: 'Error deleting note' });
  }
};

export const shareNoteController = async (req: Request, res: Response) => {
    try {
      const accountId = req.user?.primarykey;
      const noteId = req.params.noteId;
      const { targetLogin, access } = req.body;
  
      if (!accountId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const checkCorrentUser = await prisma.account.findUnique({
        where: { primarykey: accountId },
        select: { login: true },
      });

      if (checkCorrentUser?.login === targetLogin) {
        return res.status(404).json({ message: 'Нельзя добавить самого себя в заметку.' });
      }
  
      // Находим пользователя по логину
      const targetUser = await prisma.account.findUnique({
        where: { login: targetLogin }
      });
  
      if (!targetUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      await shareNote(noteId, targetUser.primarykey, access, accountId);
      res.status(204).end();
    } catch (error) {
      console.error('Error in shareNoteController:', error);
      res.status(500).json({ message: 'Error sharing note' });
    }
  };

  export const getSharedUsersController = async (req: Request, res: Response) => {
    try {
      const noteId = req.params.noteId;
      
      const sharedUsers = await prisma.noteShare.findMany({
        where: { noteId },
        include: {
          userRef: {
            select: {
              primarykey: true,
              login: true
            }
          }
        }
      });
  
      const result = sharedUsers ? sharedUsers.map(share => ({
        id: share.userRef.primarykey,
        login: share.userRef.login,
        access: share.access
      })) : [];
  
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in getSharedUsersController:', error);
      res.status(500).json({ message: 'Error fetching shared users' });
    }
  };

  export const unshareNoteController = async (req: Request, res: Response) => {
    try {
      const accountId = req.user?.primarykey;
      const noteId = req.params.noteId;
      const userId = req.params.userId;
  
      if (!accountId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
  
      // Проверяем, что пользователь имеет право отзывать доступ
      const note = await prisma.note.findUnique({
        where: { primarykey: noteId }
      });
  
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
  
      if (note.accountId !== accountId) {
        return res.status(403).json({ message: 'You can only unshare your own notes' });
      }
  
      // Удаляем запись о доступе
      await prisma.noteShare.delete({
        where: {
          noteId_accountId: {
            noteId,
            accountId: userId
          }
        }
      });
  
      // Добавляем запись в историю
      await addHistoryEntry(noteId, 'UNSHARED', accountId);
  
      res.status(204).end();
    } catch (error) {
      console.error('Error in unshareNoteController:', error);
      res.status(500).json({ message: 'Error unsharing note' });
    }
  };