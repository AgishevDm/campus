import { Request, Response } from 'express';
import { createChatService, getUserChatsService, createMessageService, getMessagesService } from '../services/chatService';
import { io } from '../socket';

export const createChatController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.primarykey;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { participantIds, name, isGroup } = req.body as { participantIds: string[]; name?: string; isGroup?: boolean };
    if (!participantIds || participantIds.length === 0) {
      return res.status(400).json({ message: 'Participants required' });
    }

    const chat = await createChatService(userId, Array.from(new Set([userId, ...participantIds])), name, isGroup);
    chat.participants.forEach((p: any) => io.to(p.userId).emit('newChat', chat));
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

    const chats = await getUserChatsService(userId);
    res.json(chats);
  } catch (error) {
    console.error('Error getting chats:', error);
    res.status(500).json({ message: 'Error getting chats' });
  }
};

export const createMessageController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.primarykey;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { chatId } = req.params;
    const { text } = req.body as { text: string };
    if (!text) return res.status(400).json({ message: 'Text required' });

    const message = await createMessageService(chatId, userId, text);
    io.to(chatId).emit('newMessage', message);
    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Error creating message' });
  }
};

export const getMessagesController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.primarykey;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { chatId } = req.params;
    const messages = await getMessagesService(chatId);
    res.json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ message: 'Error getting messages' });
  }
};
