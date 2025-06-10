import { Request, Response } from 'express';
import { createNewsService, getAllNewsService, deleteNewsService, updateNewsService, updateIsFavorite, incrementShareCount, getPostById } from '../services/newsService';
import S3Service from '../services/s3Service';

export const createNewsController = async (req: Request, res: Response) => {
  try {
    const creatorId = req.user?.primarykey;

    if (!creatorId) {
        return res.status(400).json({ message: 'Id пользователя не получен при создании поста (контроллер)' });
    }

    const { title, typeNews, locationMap, dateEvent, advertisingUrl, description } = req.body;
    const files = req.files as Express.Multer.File[];

    const imageUrls = await Promise.all(
      files.map(file => S3Service.uploadFile(file, creatorId, 'maps/postsImage'))
    );

    console.log(imageUrls);

    const news = await createNewsService(creatorId, title, typeNews, locationMap, dateEvent, advertisingUrl, description, imageUrls);
    res.status(200).json(news);
  } catch (error) {
    console.error('Error in createNewsController:', error);
    res.status(500).json({ message: 'Error by creating news' });
  }
}

export const getAllNewsController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.primarykey;
    
        if (!userId) {
            return res.status(400).json({ message: 'Invalid request data' });
        }
    
        const news = await getAllNewsService(userId);
        res.status(200).json(news);
      } catch (error) {
        console.error('Error in getAllNewsController:', error);
        res.status(500).json({ message: 'Error getting news' });
      }
}

export const deleteNewsController = async (req: Request, res: Response) => {
  try {
      const creatorId = req.user?.primarykey;
  
      if (!creatorId) {
          return res.status(400).json({ message: 'Invalid request data' });
      }

      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: 'Не указан ID поста для удаления (контроллер).' });
    }
  
      await deleteNewsService(id);
      res.status(200).json({ message: "Пост успешно удален." });
    } catch (error) {
      console.error('Error in createNewsController:', error);
      res.status(500).json({ message: 'Error by creating news' });
    }
}

export const updateNewsController = async (req: Request, res: Response) => {
  try {
    const creatorId = req.user?.primarykey;

    if (!creatorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Не указан ID поста для удаления (контроллер).' });
    }

    const { title, typeNews, locationMap, dateEvent, advertisingUrl, description, remainingImages } = req.body;
    const files = req.files as Express.Multer.File[];

    const updateNews = await updateNewsService(
      id,
      title,
      typeNews,
      locationMap,
      dateEvent,
      advertisingUrl,
      description,
      Array.isArray(remainingImages) ? remainingImages : [remainingImages],
      files
    );
    
    res.status(200).json(updateNews);
  } catch (error) {
    console.error('Error in createNewsController:', error);
    res.status(500).json({ message: 'Error by creating news' });
  }
}

export const updateFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.primarykey;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id: newsId } = req.params;
    const { isFavorite } = req.body;

    if (!newsId) {
      return res.status(400).json({ message: 'Не указан ID новости' });
    }

    await updateIsFavorite(newsId, userId, isFavorite);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in updateFavorite:', error);
    res.status(500).json({ message: 'Error updating favorite status' });
  }
}

export const sharePostController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.primarykey;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Не указан ID поста' });
    }

    await incrementShareCount(id);

    const baseUrl = process.env.FRONTEND_URL || 'https://example.com';
    const shareLink = `${baseUrl}/share/${id}`;

    res.status(200).json({ link: shareLink });
  } catch (error) {
    console.error('Error in sharePostController:', error);
    res.status(500).json({ message: 'Error creating share link' });
  }
};

export const getPublicPostController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: 'Не указан ID поста' });

    const post = await getPostById(id);
    if (!post) return res.status(404).json({ message: 'Пост не найден' });

    res.status(200).json(post);
  } catch (error) {
    console.error('Error in getPublicPostController:', error);
    res.status(500).json({ message: 'Error getting post' });
  }
};
