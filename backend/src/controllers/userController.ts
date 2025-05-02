import { Request, Response } from 'express';
import { getUserProfile, getAllUsers, createUser, updateUser, deleteUser } from '../services/userService';
import jwt from 'jsonwebtoken';
import redisClient from '../config/redis';

export const getUserProfileController = async (req: Request, res: Response) => {
  try {
    const accountId = req.user?.primarykey;

    if (!accountId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await getUserProfile(accountId);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserProfileController:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Токен отсутствует' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { primarykey: string };
    const storedToken = await redisClient.get(`token:${decoded.primarykey}`);

    if (!storedToken || storedToken !== token) {
      return res.status(401).json({ message: 'Токен недействителен' });
    }

    return res.json({ valid: true });
  } catch (error) {
    console.error('Ошибка при проверке токена:', error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Токен истек' });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Недействительный токен' });
    }

    return res.status(500).json({ message: 'Ошибка сервера при проверке токена' });
  }
};

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const { typeUser } = req.body;
    const users = await getAllUsers(typeUser);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error in getUsersController:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const createUserController = async (req: Request, res: Response) => {
  try {
    const { accountFIO, email, login, status, password, role } = req.body;
    const user = await createUser(accountFIO, email, login, status, password, role);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error in register controller:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
}

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { accountFIO, email, login, status, password, role, faculty, studentDegree, course, direction, about, post, department } = req.body;

    if (!userId || !accountFIO || !login) {
      return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
    }

    // Обновление пользователя
    const updatedUser = await updateUser(userId, accountFIO, email, login, status, password, role, faculty, studentDegree, course, direction, about, post, department);
    console.log(updatedUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in updateUserController:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
    }

    await deleteUser(userId);
    res.status(200).json();
  } catch (error) {
    console.error('Error in deleteUserController:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};