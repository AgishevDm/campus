import redis from '../config/redis';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();
const LIKE_EXPIRE_SECONDS = 60 * 60 * 24 * 30; // 30 дней

// Синхронизация лайков из Redis в PostgreSQL
export const syncLikesToDatabase = async () => {
  try {
    const postKeys = await redis.keys('post:*:likes');
    
    for (const key of postKeys) {
      const postId = key.split(':')[1];
      const likesCount = await redis.get(key);
      
      try {
        await prisma.news.update({
          where: { primarykey: postId },
          data: { likesCount: parseInt(likesCount || '0', 10) }
        });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
          // Пост не найден, возможно был удален
          await redis.del(key);
          await redis.del(`user:*:liked:${postId}`);
        } else {
          throw error;
        }
      }
    }
    
    console.log(`Синхронизировано ${postKeys.length} постов`);
  } catch (error) {
    console.error('Ошибка синхронизации лайков:', error);
    throw error;
  }
};

// Основная функция для работы с лайками
export const toggleLike = async (postId: string, userId: string) => {
  const likeKey = `post:${postId}:likes`;
  const userLikeKey = `user:${userId}:liked:${postId}`;
  
  try {
    // Атомарная проверка и установка в Redis
    const hasLiked = await redis.get(userLikeKey);
    
    if (hasLiked) {
      // Убираем лайк
      const pipeline = redis.multi()
        .decr(likeKey)
        .del(userLikeKey);
      
      const [newLikeCount] = await pipeline.exec();
      
      // Обновляем базу данных
      await prisma.$transaction([
        prisma.newsLike.deleteMany({
          where: { postId, userId }
        }),
        prisma.news.update({
          where: { primarykey: postId },
          data: { likesCount: { decrement: 1 } }
        })
      ]);
      
      return { liked: false, likes: newLikeCount };
    } else {
      // Добавляем лайк
      const pipeline = redis.multi()
        .incr(likeKey)
        .set(userLikeKey, '1', { EX: LIKE_EXPIRE_SECONDS });
      
      const [newLikeCount] = await pipeline.exec();
      
      // Обновляем базу данных
      await prisma.$transaction([
        prisma.newsLike.create({
          data: { postId, userId }
        }),
        prisma.news.update({
          where: { primarykey: postId },
          data: { likesCount: { increment: 1 } }
        })
      ]);
      
      return { liked: true, likes: newLikeCount };
    }
  } catch (error) {
    console.error('Ошибка в toggleLike:', error);
    throw error;
  }
};

// Получение количества лайков
export const getLikes = async (postId: string) => {
  try {
    // Пытаемся получить из Redis
    const redisLikes = await redis.get(`post:${postId}:likes`);
    if (redisLikes) return parseInt(redisLikes, 10);
    
    // Если в Redis нет, берем из базы
    const post = await prisma.news.findUnique({
      where: { primarykey: postId },
      select: { likesCount: true }
    });
    
    if (!post) {
      throw new Error('Пост не найден');
    }
    
    // Сохраняем значение в Redis
    await redis.set(`post:${postId}:likes`, post.likesCount.toString());
    
    return post.likesCount;
  } catch (error) {
    console.error('Ошибка в getLikes:', error);
    throw error;
  }
};

// Проверка, лайкал ли пользователь пост
export const checkUserLike = async (postId: string, userId: string) => {
  try {
    // Пытаемся получить из Redis
    const redisLike = await redis.get(`user:${userId}:liked:${postId}`);
    if (redisLike) return true;
    
    // Если в Redis нет, проверяем базу
    const like = await prisma.newsLike.findFirst({
      where: { postId, userId }
    });
    
    if (like) {
      // Обновляем Redis
      await redis.set(`user:${userId}:liked:${postId}`, '1', { EX: LIKE_EXPIRE_SECONDS });
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Ошибка в checkUserLike:', error);
    throw error;
  }
};

// Восстановление состояния Redis из базы
export const restoreLikesFromDatabase = async () => {
  try {
    console.log('Восстановление лайков из базы данных...');
    
    const posts = await prisma.news.findMany({
      include: { likes: true }
    });
    
    let restoredCount = 0;
    
    for (const post of posts) {
      // Устанавливаем общее количество лайков
      await redis.set(`post:${post.primarykey}:likes`, post.likesCount.toString());
      
      // Восстанавливаем информацию о лайках пользователей
      for (const like of post.likes) {
        await redis.set(
          `user:${like.userId}:liked:${post.primarykey}`, 
          '1', 
          { EX: LIKE_EXPIRE_SECONDS }
        );
        restoredCount++;
      }
    }
    
    console.log(`Восстановлено ${posts.length} постов и ${restoredCount} лайков`);
  } catch (error) {
    console.error('Ошибка восстановления лайков:', error);
    throw error;
  }
};