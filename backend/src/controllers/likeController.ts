import { Request, Response } from 'express';
import {
  toggleLike,
  getLikes,
  checkUserLike,
} from '../services/likeService';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const toggleLikeController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.primarykey;
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Требуется авторизация' 
      });
    }

    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ 
        success: false,
        message: 'ID поста обязателен' 
      });
    }

    const result = await toggleLike(postId, userId);
    
    res.status(200).json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Ошибка в toggleLikeController:', error);
    
    if (error instanceof PrismaClientKnownRequestError) {
      // Обработка специфических ошибок Prisma
      return res.status(400).json({
        success: false,
        message: 'Ошибка базы данных',
        code: error.code
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Внутренняя ошибка сервера' 
    });
  }
};

export const getLikesController = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ 
        success: false,
        message: 'ID поста обязателен' 
      });
    }

    const likes = await getLikes(postId);
    
    res.status(200).json({
      success: true,
      data: { likes }
    });
    
  } catch (error) {
    console.error('Ошибка в getLikesController:', error);
    
    res.status(500).json({ 
      success: false,
      message: 'Внутренняя ошибка сервера' 
    });
  }
};

export const checkUserLikeController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.primarykey;
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Требуется авторизация' 
      });
    }

    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ 
        success: false,
        message: 'ID поста обязателен' 
      });
    }

    const hasLiked = await checkUserLike(postId, userId);
    
    res.status(200).json({
      success: true,
      data: { liked: hasLiked }
    });
    
  } catch (error) {
    console.error('Ошибка в checkUserLikeController:', error);
    
    res.status(500).json({ 
      success: false,
      message: 'Внутренняя ошибка сервера' 
    });
  }
};