import { Request, Response } from 'express';
import {
  getUserChats,
  createPrivateChat,
  createGroupChat,
} from '../services/chatService';

export const getChatsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.primarykey;
    if (!userId) return res.status(401).json({ message: 'Not authorized' });
    const chats = await getUserChats(userId);
    res.json(chats);
  } catch (err) {
    console.error('getChatsController', err);
    res.status(500).json({ message: 'Failed to fetch chats' });
  }
};

export const createPrivateChatController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.primarykey;
    const { targetId } = req.body;
    if (!userId || !targetId) return res.status(400).json({ message: 'Bad data' });
    const chat = await createPrivateChat(userId, targetId);
    res.json(chat);
  } catch (err) {
    console.error('createPrivateChat', err);
    res.status(500).json({ message: 'Failed to create chat' });
  }
};

export const createGroupChatController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.primarykey;
    const { name, participants } = req.body as { name: string; participants: string[] };
    if (!userId || !name || !participants?.length) {
      return res.status(400).json({ message: 'Bad data' });
    }
    const chat = await createGroupChat(userId, name, [userId, ...participants]);
    res.json(chat);
  } catch (err) {
    console.error('createGroupChat', err);
    res.status(500).json({ message: 'Failed to create group' });
  }
};
