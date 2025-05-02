import axios from 'axios';
import * as ical from 'node-ical';
import { PrismaClient } from '@prisma/client';
import { CalendarComponent, VEvent } from 'node-ical';

const prisma = new PrismaClient();
const ETIS_TIMEOUT = 30000;

type ICalResponse = Record<string, CalendarComponent>;


function isICalEvent(event: CalendarComponent): event is VEvent {
  if (event.type !== 'VEVENT') return false;
  
  const vevent = event as VEvent;
  return typeof vevent.uid === 'string' &&
         typeof vevent.summary === 'string' &&
         vevent.start instanceof Date &&
         vevent.end instanceof Date;
}

export const EtisService = {
  async parseIcal(icalUrl: string): Promise<{
    etisId: string;
    eventName: string;
    startEvent: Date;
    endEvent: Date;
    description: string;
    location: string;
    eventType: string;
    color: string;
    isFromEtis: boolean;
    calendarType: string;
  }[]> {
    try {

      new URL(icalUrl);

      const source = axios.CancelToken.source();
      const timeout = setTimeout(() => {
        source.cancel('Timeout fetching ETIS calendar');
      }, ETIS_TIMEOUT);

      const response = await axios.get(icalUrl, {
        cancelToken: source.token,
        headers: {
          'User-Agent': 'University-Calendar-Sync/1.0',
          'Accept': 'text/calendar'
        },
        responseType: 'text',
        timeout: ETIS_TIMEOUT
      });

      clearTimeout(timeout);

      if (response.status !== 200) {
        throw new Error(`ETIS returned status ${response.status}`);
      }

      if (!response.data.includes('BEGIN:VCALENDAR')) {
        throw new Error('Invalid iCal data received');
      }
      
      // Используем асинхронный метод fromURL с обработкой ошибок
      // Парсинг данных
      const parsed = await ical.async.parseICS(response.data) as ICalResponse;
      
      // Обработка событий
      return Object.values(parsed)
        .filter(isICalEvent)
        .map(event => ({
          etisId: event.uid,
          eventName: event.summary.trim(),
          startEvent: event.start,
          endEvent: event.end,
          description: event.description?.trim() || '',
          location: this.cleanLocation(event.location),
          eventType: this.determineEventType(event.summary),
          color: this.getColorForType(this.determineEventType(event.summary)),
          isFromEtis: true,
          calendarType: 'university'
        }));
    } catch (error) {
      console.error('ETIS parse error:', error);
      
      // Классификация ошибок
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Превышено время ожидания ответа от ETIS');
        }
        if (error.response) {
          throw new Error(`ETIS вернул ошибку: ${error.response.status} ${error.response.statusText}`);
        }
      }
      
      throw new Error('Не удалось загрузить расписание из ETIS');
    }
  },

  cleanLocation(location?: string): string {
    if (!location) return '';
    return location.replace(/\\,/g, ',').replace(/\\;/g, ';').trim();
  },

  determineEventType(summary: string): string {
    const lower = summary.toLowerCase();
    if (lower.includes('лек')) return 'lecture';
    if (lower.includes('практ')) return 'practice';
    if (lower.includes('лаб')) return 'lab';
    return 'other';
  },

  getColorForType(type: string): string {
    const colors = {
      lecture: '#4ecdc4',
      practice: '#45b7d1',
      lab: '#96ceb4',
      other: '#ff6b6b'
    } as Record<string, string>;
    return colors[type] || '#cccccc';
  },

  async syncUserEvents(accountId: string, icalUrl: string): Promise<{ count: number }> {
    let retryCount = 0;
    const maxRetries = 2;
    let lastError: Error | null = null;
  
    while (retryCount <= maxRetries) {
      // Создаем новый экземпляр Prisma для каждой попытки
      const prisma = new PrismaClient({
        // log: ['query', 'info', 'warn', 'error'] // Для отладки
      });
  
      try {
        const etisEvents = await this.parseIcal(icalUrl);
        
        // Разбиваем на пакеты для уменьшения нагрузки на транзакцию
        const batchSize = 50;
        const batches: Array<{
          etisId: string;
          eventName: string;
          startEvent: Date;
          endEvent: Date;
          description: string;
          location: string;
          eventType: string;
          color: string;
          isFromEtis: boolean;
          calendarType: string;
        }[]> = [];
        for (let i = 0; i < etisEvents.length; i += batchSize) {
          batches.push(etisEvents.slice(i, i + batchSize));
        }
  
        const result = await prisma.$transaction(async (tx) => {
          await tx.accountEvents.deleteMany({
            where: {
              account: accountId,
              isFromEtis: true
            }
          });
  
          // Добавляем новые события пакетами
          const results = [];
          for (const batch of batches) {
            const created = await tx.accountEvents.createMany({
              data: batch.map(event => ({
                ...event,
                account: accountId
              })),
              skipDuplicates: true // Пропускаем дубликаты
            });
            results.push(created);
          }
  
          await tx.account.update({
            where: { primarykey: accountId },
            data: { sheduleEtis: icalUrl }
          });
  
          return { count: etisEvents.length };
        });
  
        await prisma.$disconnect();
        return result;
  
      } catch (error) {
        await prisma.$disconnect().catch(() => {});
      if (error instanceof Error) {
        lastError = error;
      } else {
        lastError = new Error('Unknown error occurred');
      }
        retryCount++;
        
        if (retryCount > maxRetries) {
          console.error(`ETIS sync failed after ${maxRetries} retries`);
          throw lastError;
        }
        
        console.log(`Retry ${retryCount} for ETIS sync`);
        await new Promise(resolve => setTimeout(resolve, 40000 * retryCount));
      }
    }
    
    throw lastError || new Error('Unknown error in syncUserEvents');
  },

  async getUserEtisEvents(accountId: string) {
    return prisma.accountEvents.findMany({
      where: {
        account: accountId,
        isFromEtis: true
      },
      orderBy: {
        startEvent: 'asc'
      }
    });
  }
};