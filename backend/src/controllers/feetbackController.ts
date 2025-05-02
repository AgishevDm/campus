import { Request, Response } from 'express';
import { send, getAllFeedbacks, getFeetback, sendAnswer, softDeleteFeetback, permanentDeleteFeetback, restoreFeetback } from '../services/feetbackService';

export const sendFeetback = async (req: Request, res: Response) => {
  try {
    const { id, title, message } = req.body;

    if (!id || !title || !message) {
        return res.status(400).json({ message: "Все поля обязательны для заполнения." });
    }

    const feetback = await send(id, title, message);
    res.status(200).json({ message: "Обращение отправлено!", feetback });
  } catch (error) {
    console.error("Ошибка при отправке обращения:", error);
    res.status(500).json({ message: "Произошла ошибка при отправке обращения." });
  }
};

export const getAllFeetbacksController = async (req: Request, res: Response) => {
  try {
    const feetbacks = await getAllFeedbacks();
    res.status(200).json(feetbacks);
  } catch (error) {
    console.error('Error in getAllFeetback:', error);
    res.status(500).json({ message: 'Error fetching feetbacks' });
  }
}

export const getFeetbackController = async (req: Request, res: Response) => {
  try {
    const accountId = req.user?.primarykey;

    if (!accountId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await getFeetback();
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserProfileController:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
}

export const sendAnswerController = async (req: Request, res: Response) => {
  const { id, message, email } = req.body;

  if (!id || !message || !email) {
    return res.status(400).json({ error: 'Необходимо указать id, message и email' });
  }

  try {
    const updatedFeedback = await sendAnswer(id, message, email);

    res.status(200).json({ message: 'Ответ успешно отправлен', feedback: updatedFeedback });
  } catch (error) {
    console.error('Ошибка при отправке ответа:', error);
    res.status(500).json({ error: 'Произошла ошибка при отправке ответа' });
  }
}

export const deleteFeetbackController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { deleteType } = req.body; // Тип удаления: 'soft' или 'permanent'

    if (!id || !deleteType) {
      return res.status(400).json({ message: "ID и тип удаления обязательны." });
    }

    if (deleteType === 'soft') {
      // Мягкое удаление
      await softDeleteFeetback(id);
      return res.status(200).json({ message: "Обращение помечено как удаленное." });
    } else if (deleteType === 'permanent') {
      // Перманентное удаление
      await permanentDeleteFeetback(id);
      return res.status(200).json({ message: "Обращение полностью удалено." });
    } else {
      return res.status(400).json({ message: "Неверный тип удаления." });
    }
  } catch (error) {
    console.error("Ошибка при удалении обращения:", error);
    res.status(500).json({ message: "Произошла ошибка при удалении обращения." });
  }
};

export const restoreFeetbackController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID обращения обязателен." });
    }

    await restoreFeetback(id);
    return res.status(200).json({ message: "Обращение успешно восстановлено." });
  } catch (error) {
    console.error("Ошибка при восстановлении обращения:", error);
    res.status(500).json({ message: "Произошла ошибка при восстановлении обращения." });
  }
};