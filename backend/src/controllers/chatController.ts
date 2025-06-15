import { Request, Response } from 'express';
import { createChatBetweenUsers, getChatsForUser } from '../services/chatService';

export const createChatController = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user?.primarykey;
    const { targetUserId } = req.body;
    if (!currentUser || !targetUserId) {
      return res.status(400).json({ message: 'Invalid request' });
    }
    const chat = await createChatBetweenUsers(currentUser, targetUserId);
    res.status(201).json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Error creating chat' });
  }
};

export const getChatsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.primarykey;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const chats = await getChatsForUser(userId);
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Error fetching chats' });
  }
};
