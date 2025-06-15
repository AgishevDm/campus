import { Request, Response } from 'express';
import { findOrCreateChat } from '../services/chatService';

export const createChatController = async (req: Request, res: Response) => {
  try {
    const currentId = req.user?.primarykey;
    const { targetId } = req.body;

    if (!currentId || !targetId) {
      return res.status(400).json({ message: 'Missing user ids' });
    }

    if (currentId === targetId) {
      return res.status(400).json({ message: 'Cannot create chat with yourself' });
    }

    const chat = await findOrCreateChat(currentId, targetId);

    res.status(200).json({ id: chat.primarykey });
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Error creating chat' });
  }
};
