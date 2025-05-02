import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import redisClient from '../config/redis';
import { roles } from '../statik-pk/uuid-statick';
import crypto from 'crypto';
import { sendConfirmationEmail, sendEmail } from './emailService';

export const sendConfirmationCode = async (email: string, type?: string) => {
  try {
    const existingUser = await prisma.account.findUnique({
      where: { email },
    });

    if (existingUser && type !== 'reset') {
      throw new Error('Email уже зарегистрирован');
    } else if (!existingUser && type === 'reset') {
      throw new Error('Email для восстановления пароля не найден');
    }

    const code = crypto.randomInt(100000, 999999).toString();

    if (!redisClient.isOpen) await redisClient.connect();

    if (type === 'reset') {
      await redisClient.set(`reset_code:${email}`, code, { EX: 300 }); // 5 минут в секундах
    } else {
      await redisClient.set(`confirm:${email}`, code, { EX: 900 }); // 15 минут в секундах
    }

    await sendConfirmationEmail(email, code, type);

    // Ограничиваем частоту отправки кодов
    await redisClient.set(`confirm_rate_limit:${email}`, '1', { EX: 60 }); // 1 минута таймаут
  } catch (error) {
    console.error('Error in sendConfirmationCode:', error);
    throw error;
  }
};

export const verifyConfirmationCode = async (email: string, code: string, type?: string) => {
  try {
    if (!redisClient.isOpen) await redisClient.connect();
    
    // Проверяем лимит попыток
    const attemptsKey = `confirm_attempts:${email}`;
    const attempts = Number(await redisClient.get(attemptsKey) || 0);

    if (attempts >= 5) {
      throw new Error('Слишком много попыток. Попробуйте позже.');
    }
    
    let storedCode: string | null;
    if (type === 'reset') {
      storedCode = await redisClient.get(`reset_code:${email}`);
    } else {
      storedCode = await redisClient.get(`confirm:${email}`);
    }
    
    if (!storedCode || storedCode !== code) {
      // Увеличиваем счетчик попыток
      await redisClient.incr(attemptsKey);
      await redisClient.expire(attemptsKey, 3600); // Сбросится через час
      return false;
    }

    if (type === 'reset') {
      await redisClient.del(`reset_code:${email}`);
    } else {
      await redisClient.del(`confirm:${email}`);
    }
    await redisClient.del(attemptsKey);
    return true;
  } catch (error) {
    console.error('Error in verifyConfirmationCode:', error);
    throw error;
  }
};

export const registerUser = async (
  accountFIO: string, 
  email: string, 
  login: string, 
  status: string, 
  password: string,
  isEmailVerified = false
) => {
  try {
    if (!isEmailVerified) {
      throw new Error('Email не подтвержден');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const account = await prisma.account.create({
      data: {
        accountFIO,
        email,
        login,
        status,
        password: hashedPassword,
        isEmailVerified,
        typeAccessRef: {
          connect: { primarykey: roles.user },
        },
      },
      include: {
        typeAccessRef: true,
      },
    });

    await sendEmail(
      email,
      'Добро пожаловать!',
      `Вы успешно зарегистрировались на нашем сервисе. Ваш логин: ${login}`,
      "Приветственное письмо от коллектива iMaps!"
    );

    return account;
  } catch (error) {
    console.error('Error in registerUser:', error);
    throw error;
  }
};

export const loginUser = async (loginOrEmail: string, password: string) => {
  try {
    const isEmail = loginOrEmail.includes('@');

    let account;
    
    if (isEmail) {
      // Ищем по email
      account = await prisma.account.findUnique({
        where: { email: loginOrEmail },
        include: { typeAccessRef: true },
      });
    } else {
      // Ищем по логину
      account = await prisma.account.findUnique({
        where: { login: loginOrEmail },
        include: { typeAccessRef: true },
      });
    }

    if (!account || !(await bcrypt.compare(password, account.password))) {
      throw new Error('Неверный логин/email или пароль');
    }

    const token = jwt.sign({ primarykey: account.primarykey }, process.env.JWT_SECRET!, { expiresIn: '3d' });

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    await redisClient.set(`token:${account.primarykey}`, token, {
      EX: 3600, // Время жизни токена в секундах (1 час)
    });

    return {
      token,
      typeAccess: account.typeAccessRef?.type, // Тип доступа пользователя
    };
  } catch (error) {
    console.error('Error in loginUser:', error);
    throw error;
  }
};

export const logoutUser = async (accountId: string) => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    // Удаляем токен из Redis
    await redisClient.del(`token:${accountId}`);
  } catch (error) {
    console.error('Error in logoutUser:', error);
    throw error;
  }
};

export const verifyToken = async (accountId: string, token: string) => {
  // Проверяем, что токен совпадает с сохраненным в Redis
  const storedToken = await redisClient.get(`token:${accountId}`);
  return storedToken === token;
};


export const resetPasswordService = async (email: string, password: string) => {
  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    await prisma.account.update({
      where: { email: email },
      data: {
        password: hashedPassword,
        editTime: new Date(),
      },
    });

    return { success: true, message: 'Пароль успешно обновлен' };
  } catch (error) {
    console.error('Error in resetPasswordService:', error);
    throw error;
  }
}