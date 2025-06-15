import { Request, Response } from 'express';
import { findOrCreateChat, createMessage, getUserChats, getChatMessages } from '../services/chatService';
import { broadcastChatCreated, broadcastMessage } from '../websocket';

export const createChatController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.primarykey;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const { targetUserId } = req.body as { targetUserId: string };

    if (!targetUserId) return res.status(400).json({ message: 'targetUserId required' });

    const chat = await findOrCreateChat(userId, targetUserId);

    broadcastChatCreated(chat, [userId, targetUserId]);

    res.json(chat);
  } catch (e) {
    console.error('createChatController error', e);
    res.status(500).json({ message: 'Failed to create chat' });
  }
};

export const getChatsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.primarykey;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const chats = await getUserChats(userId);
    res.json(chats);
  } catch (e) {
    console.error('getChatsController error', e);
    res.status(500).json({ message: 'Failed to load chats' });
  }
};

export const getMessagesController = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.chatId;
    const messages = await getChatMessages(chatId);
    res.json(messages);
  } catch (e) {
    console.error('getMessagesController error', e);
    res.status(500).json({ message: 'Failed to load messages' });
  }
};

export const sendMessageController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.primarykey;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const { chatId, text } = req.body as { chatId: string; text: string };
    const message = await createMessage(chatId, userId, text);
    broadcastMessage(message, chatId);
    res.json(message);
  } catch (e) {
    console.error('sendMessageController error', e);
    res.status(500).json({ message: 'Failed to send message' });
  }
};
