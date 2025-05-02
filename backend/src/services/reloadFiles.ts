import cron from "node-cron";
import S3Service from "../services/s3Service";
import { PrismaClient } from "@prisma/client";
import { PassThrough } from "stream";

const prisma = new PrismaClient();

function createLogContent(logs: string[]): string {
  return logs.join("\n");
}

async function uploadLogsToS3(logs: string[]) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-"); // Форматируем дату и время
    const logFileName = `reloadFile-${timestamp}.log`; // Имя файла логов
    const logContent = createLogContent(logs); // Содержимое логов
  
    // Создаем "виртуальный файл" для загрузки
    const logFile: Express.Multer.File = {
        fieldname: "logs", // Имя поля (не используется, но обязательно)
        originalname: logFileName, // Имя файла
        encoding: "utf-8", // Кодировка
        mimetype: "text/plain", // MIME-тип
        size: logContent.length, // Размер файла в байтах
        buffer: Buffer.from(logContent, "utf-8"), // Содержимое файла
        stream: new PassThrough(),
        destination: "", // Путь назначения (не используется, но обязательно)
        filename: logFileName, // Имя файла (дублирует originalname)
        path: "", // Путь к файлу (не используется, но обязательно)
    };
  
    // Загружаем файл логов в S3
    const logFileUrl = await S3Service.uploadFile(logFile, "system", "maps/logs/reloadFile");
    console.log("Log file uploaded to S3:", logFileUrl);
  }

async function getFilesToRefresh() {
  try {
    const accounts = await prisma.account.findMany({
      where: {
        avatarUrl: {
          not: null,
        },
      },
      select: {
        primarykey: true,
        avatarUrl: true,
      },
    });

    return accounts.map((account) => {
      const avatarUrl = account.avatarUrl!;

      // Извлекаем ключ файла из URL
      const url = new URL(avatarUrl);
      const fileKey = url.pathname.split("/").slice(2).join("/"); // Убираем имя бакета

      return {
        fileKey,
        accountId: account.primarykey,
      };
    });
  } catch (error) {
    console.error("Error fetching files to refresh:", error);
    return [];
  }
}

async function updateFileUrlInDatabase(accountId: string, newAvatarUrl: string) {
    try {
      await prisma.account.update({
        where: {
          primarykey: accountId,
        },
        data: {
          avatarUrl: newAvatarUrl,
        },
      });
  
      console.log("Updated avatarUrl for account:", accountId);
    } catch (error) {
      console.error("Error updating avatarUrl in database:", error);
    }
  }

  const refreshSignedUrls = async () => {
    const logs: string[] = []; // Массив для хранения логов
  
    try {
      logs.push("Starting refreshSignedUrls task...");
  
      // Получаем список файлов, для которых нужно обновить подписанный URL
      const filesToRefresh = await getFilesToRefresh();
      logs.push(`Found ${filesToRefresh.length} files to refresh.`);
  
      for (const file of filesToRefresh) {
        const newSignedUrl = await S3Service.generateNewSignedUrl(file.fileKey);
        logs.push(`Refreshed signed URL for file: ${file.fileKey} -> ${newSignedUrl}`);
  
        await updateFileUrlInDatabase(file.accountId, newSignedUrl);
        logs.push(`Updated avatarUrl for account: ${file.accountId}`);
      }
  
      logs.push("refreshSignedUrls task completed successfully.");
    } catch (error) {
      logs.push(`Error refreshing signed URLs: ${error}`);
      console.error("Error refreshing signed URLs:", error);
    } finally {
      // Загружаем логи в S3
      await uploadLogsToS3(logs);
    }
  };

// Запускаем задачу каждые 6 дней
cron.schedule("0 0 */6 * *", refreshSignedUrls);

refreshSignedUrls();