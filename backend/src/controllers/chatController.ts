import { Request, Response } from 'express';
import { createChat, getChatsForUser } from '../services/chatService';

export const createChatController = async (req: Request, res: Response) => {
  try {
    const accountId = req.user?.primarykey;
    const { otherAccountId } = req.body;
    if (!accountId || !otherAccountId) return res.status(400).json({ message: 'Invalid data' });
    const chat = await createChat(accountId, otherAccountId);
    res.status(201).json(chat);
  } catch (err) {
    console.error('createChatController error:', err);
    res.status(500).json({ message: 'Error creating chat' });
  }
};

export const getChatsController = async (req: Request, res: Response) => {
  try {
    const accountId = req.user?.primarykey;
    if (!accountId) return res.status(401).json({ message: 'User not authenticated' });
    const chats = await getChatsForUser(accountId);
    res.json(chats);
  } catch (err) {
    console.error('getChatsController error:', err);
    res.status(500).json({ message: 'Error fetching chats' });
  }
};
