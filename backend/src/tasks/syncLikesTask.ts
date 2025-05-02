import { syncLikesToDatabase } from '../services/likeService';
import { setInterval } from 'timers';
import logger from '../utils/logger';

// Конфигурация синхронизации
const SYNC_INTERVAL_MS = 20 * 1000; // 5 минут
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 120 * 1000; // 30 секунд

export const startLikeSyncTask = () => {
  const syncWithRetry = async (attempt = 1) => {
    try {
      await syncLikesToDatabase();
      logger.info('Синхронизация лайков успешно завершена');
    } catch (error) {
      logger.error(`Ошибка синхронизации лайков (попытка ${attempt}):`, error);
      
      if (attempt < MAX_RETRIES) {
        setTimeout(() => syncWithRetry(attempt + 1), RETRY_DELAY_MS);
      } else {
        logger.error('Превышено максимальное количество попыток синхронизации лайков');
      }
    }
  };

  // Первая синхронизация при запуске
  syncWithRetry();

  // Периодическая синхронизация
  const intervalId = setInterval(syncWithRetry, SYNC_INTERVAL_MS);
  
  // Функция для остановки синхронизации
  return () => {
    clearInterval(intervalId);
    logger.info('Задача синхронизации лайков остановлена');
  };
};