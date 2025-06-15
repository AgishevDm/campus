import { Request, Response } from 'express';
import { findOrCreateChat, getUserChats, createMessage } from '../services/chatService';
import { sendToUser } from '../websocket';

export const createChatController = async (req: Request, res: Response) => {
  try {
    const accountId = req.user?.primarykey;
    const { targetUserId } = req.body as { targetUserId: string };

    if (!accountId || !targetUserId) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    const chat = await findOrCreateChat(accountId, targetUserId);

    // уведомляем второго пользователя о новом чате
    chat.participants.forEach(p => {
      sendToUser(p.accountId, { type: 'chatCreated', chat });
    });

    res.json(chat);
  } catch (e) {
    console.error('createChatController error', e);
    res.status(500).json({ message: 'Failed to create chat' });
  }
};

export const getChatsController = async (req: Request, res: Response) => {
  try {
    const accountId = req.user?.primarykey;
    if (!accountId) return res.status(401).json({ message: 'Unauthorized' });
    const chats = await getUserChats(accountId);
    res.json(chats);
  } catch (e) {
    console.error('getChatsController error', e);
    res.status(500).json({ message: 'Failed to get chats' });
  }
};

export const sendMessageController = async (req: Request, res: Response) => {
  try {
    const accountId = req.user?.primarykey;
    const { chatId, content } = req.body as { chatId: string; content: string };
    if (!accountId || !chatId || !content) {
      return res.status(400).json({ message: 'Invalid data' });
    }
    const message = await createMessage(chatId, accountId, content);

    // find chat participants to notify
    const chat = await getUserChats(accountId).then(chats => chats.find(c => c.id === chatId));
    if (chat) {
      chat.participants.forEach(p => sendToUser(p.accountId, { type: 'message', chatId, message }));
    }

    res.json(message);
  } catch (e) {
    console.error('sendMessageController error', e);
    res.status(500).json({ message: 'Failed to send message' });
  }
};
