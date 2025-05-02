import prisma from '../prisma';
import nodemailer from 'nodemailer';

/**
 * Сохраняет обращение в базу данных
 * @param userId - ID пользователя (внешний ключ для связи с таблицей account)
 * @param title - Заголовок обращения
 * @param message - Сообщение пользователя
 */
export const send = async (id: string, title: string, message: string) => {
  try {
    const user = await prisma.account.findUnique({
      where: {
        primarykey: id,
      },
    });

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    const feedback = await prisma.feetback.create({
      data: {
        userId: id,
        title,
        message
      },
    });

    console.log("Обращение сохранено в базу данных:", feedback);
    return feedback;
  } catch (error) {
    console.error("Ошибка при сохранении обращения:", error);
    throw error;
  }
};

type FeedbackWithAvatar = {
  primarykey: string;
  title: string;
  email: string;
  message: string;
  createTime: Date;
  document: string | null;
  isCheck: boolean;
  isDeleted: boolean;
  avatarUrl: string | null; // Добавляем avatarUrl на верхний уровень
};


export const getAllFeedbacks = async (): Promise<FeedbackWithAvatar[]> => {
  try {
    const feedbacks = await prisma.feetback.findMany({
      select: {
        primarykey: true,
        title: true,
        message: true,
        createTime: true,
        document: true,
        isCheck: true,
        isDeleted: true,
        account: {
          select: {
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    const formattedFeedbacks = feedbacks.map((feedback) => {
      const { account, ...rest } = feedback;
      return {
        primarykey: rest.primarykey,
        title: rest.title,
        email: account?.email || '',
        message: rest.message,
        createTime: rest.createTime,
        document: rest.document || '',
        isCheck: rest.isCheck,
        isDeleted: rest.isDeleted,
        avatarUrl: account?.avatarUrl || '',
      };
    });

    return formattedFeedbacks;
  } catch (error) {
    console.error("Error in getAllFeedbacks:", error);
    throw new Error("Failed to fetch feedbacks");
  }
};

export const getFeetback = async () => {

}

export const sendAnswer = async (key: string, answerText: string, userEmail: string) => {
  const updatedFeedback = await prisma.feetback.update({
    where: { primarykey: key },
    data: { isCheck: true },
  });

  if (!updatedFeedback) {
    throw new Error('Сообщение не найдено');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail', // Используем Gmail (можно заменить на другой сервис)
    auth: {
      user: process.env.EMAIL_USER, // Ваш email
      pass: process.env.EMAIL_PASSWORD, // Ваш пароль от email
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // От кого
    to: userEmail, // Кому
    subject: 'Ответ на ваше обращение', // Тема письма
    text: answerText, // Текст ответа
  };

  // Отправка письма
  await transporter.sendMail(mailOptions);

  // Возвращаем обновленную запись
  return updatedFeedback;
}

export const softDeleteFeetback = async (id: string) => {
  try {
    const updatedFeetback = await prisma.feetback.update({
      where: { primarykey: id },
      data: { isDeleted: true },
    });
    console.log("Обращение помечено как удаленное:", updatedFeetback);
    return updatedFeetback;
  } catch (error) {
    console.error("Ошибка при мягком удалении:", error);
    throw error;
  }
};

export const permanentDeleteFeetback = async (id: string) => {
  try {
    const deletedFeetback = await prisma.feetback.delete({
      where: {
        primarykey: id,
      },
    });

    console.log("Обращение удалено:", deletedFeetback);
    return deletedFeetback;
  } catch (error) {
    console.error("Ошибка при удалении обращения:", error);
    throw error;
  }
};

export const restoreFeetback = async (id: string) => {
  try {
    const updatedFeetback = await prisma.feetback.update({
      where: { primarykey: id },
      data: { isDeleted: false },
    });
    console.log("Обращение восстановлено:", updatedFeetback);
    return updatedFeetback;
  } catch (error) {
    console.error("Ошибка при восстановлении:", error);
    throw error;
  }
};