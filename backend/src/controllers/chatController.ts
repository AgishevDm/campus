import { Request, Response } from 'express';
import { createChat, getUserChats, createMessage, getChatMessages } from '../services/chatService';

export const createChatController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.primarykey;
    const { participantId } = req.body as { participantId: string };
    if (!userId || !participantId) {
      return res.status(400).json({ message: 'Invalid request data' });
    }
    const chat = await createChat(userId, participantId);
    res.status(200).json(chat);
  } catch (error) {
    console.error('Error in createChatController:', error);
    res.status(500).json({ message: 'Failed to create chat' });
  }
};

export const getChatsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.primarykey;
    if (!userId) {
      return res.status(400).json({ message: 'Invalid request data' });
    }
    const chats = await getUserChats(userId);
    res.status(200).json(chats);
  } catch (error) {
    console.error('Error in getChatsController:', error);
    res.status(500).json({ message: 'Failed to get chats' });
  }
};

export const getChatMessagesController = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const messages = await getChatMessages(chatId);
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error in getChatMessagesController:', error);
    res.status(500).json({ message: 'Failed to get messages' });
  }
};

export const sendMessageController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.primarykey;
    const { chatId, content } = req.body as { chatId: string; content: string };
    if (!userId || !chatId || !content) {
      return res.status(400).json({ message: 'Invalid request data' });
    }
    const message = await createMessage(chatId, userId, content);
    res.status(200).json(message);
  } catch (error) {
    console.error('Error in sendMessageController:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};
