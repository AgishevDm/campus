import prisma from '../prisma';
import bcrypt from 'bcryptjs';
import { roles } from '../statik-pk/uuid-statick'
import { integer } from 'aws-sdk/clients/cloudfront';

export const getUserProfile = async (accountId: string) => {
  try {
    const user = await prisma.account.findUnique({
      where: { primarykey: accountId },
      select: {
        primarykey: true,
        accountFIO: true,
        email: true,
        login: true,
        status: true,
        avatarUrl: true,
        studentDegree: true,
        course: true,
        direction: true,
        about: true,
        post: true,
        department: true,
        createTime: true,
        typeAccessRef: {
          select: {
            type: true,
          },
        },
        facultiesRef: {
          select: {
            primarykey: true,
          }
        }
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const formattedUser = {
      id: user.primarykey,
      accountFIO: user.accountFIO || '',
      login: user.login,
      status: user.status,
      email: user.email || '',
      avatar: user.avatarUrl || '',
      studentDegree: user.studentDegree,
      course: user.course,
      direction: user.direction,
      createTime: user.createTime,
      about: user.about,
      post: user.post,
      department: user.department,
      role: user.typeAccessRef?.type, // По умолчанию 'admin', если тип доступа не указан
      faculty: user.facultiesRef?.primarykey,
    };

    return formattedUser;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
};

export const getAllUsers = async (type: string) => {
  try {
    let userRoles: string[];
    if (type === 'notUser') {
      userRoles = [roles.admin, roles.superuser];
    } else if (type === 'user') {
      userRoles = [roles.user];
    } else {
      userRoles = [roles.admin, roles.superuser, roles.user];
    }

    console.log('Тип в сервисе - ', userRoles)

    const users = await prisma.account.findMany({
      where: { typeAccess: { in: userRoles } },
      select: {
        primarykey: true,
        accountFIO: true,
        login: true,
        email: true,
        password: true,
        typeAccessRef: {
          select: {
            type: true,
          },
        },
        avatarUrl: true,
      },
    });

    console.log(users)

    // Преобразуем данные для фронтенда
    const formattedUsers = users.map((user) => ({
      id: user.primarykey,
      accountFIO: user.accountFIO || '',
      login: user.login,
      email: user.email || '',
      password: user.password,
      role: user.typeAccessRef?.type, // По умолчанию 'admin', если тип доступа не указан
      avatar: user.avatarUrl || '',
    }));

    return formattedUsers;
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    throw error;
  }
};

export const createUser = async (accountFIO: string, email: string, login: string, status: string, password: string, role: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const account = await prisma.account.create({
      data: {
        accountFIO,
        email,
        login,
        status,
        password: hashedPassword,
        typeAccessRef: {
          connect: { primarykey: role }, // Связь с типом доступа
        },
      },
      include: {
        typeAccessRef: true, // Включаем информацию о типе доступа
      },
    });
    return account;
  } catch (error) {
    console.error('Error in registerUser:', error);
    throw error;
  }
}

export const searchUsers = async (query: string, excludeUserId?: string) => {
  try {
    return prisma.account.findMany({
      where: {
        AND: [
          excludeUserId ? { primarykey: { not: excludeUserId } } : {},
          {
            OR: [
              { login: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } }
            ]
          }
        ]
      },
      select: {
        primarykey: true,
        accountFIO: true,
        login: true,
        email: true,
        avatarUrl: true
      }
    });
  } catch (error) {
    console.error('Error in searchUsers:', error);
    throw error;
  }
};

export const updateUser = async (
  userId: string, // ID пользователя, которого нужно обновить
  accountFIO: string,
  email: string,
  login: string,
  status: string,
  password: string,
  role: string, // primarykey записи из TypeAccess
  faculty: string,
  studentDegree: string,
  course: integer,
  direction: string,
  about: string,
  post: string,
  department: string
) => {
  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const account = await prisma.account.update({
      where: { primarykey: userId },
      data: {
        accountFIO,
        email,
        login,
        status,
        password: hashedPassword,
        typeAccessRef: role ? { connect: { primarykey: role } } : undefined,
        facultiesRef: faculty ? { connect: { primarykey: faculty} } : undefined,
        studentDegree,
        course,
        direction,
        about,
        post,
        department,
      },
      include: {
        typeAccessRef: true,
      },
    });

    console.log(account);
    return account;
  } catch (error) {
    console.error('Error in updateUser:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    // Удаляем все связанные данные пользователя в правильном порядке
    await prisma.$transaction([
      // Удаляем лайки пользователя
      prisma.newsLike.deleteMany({
        where: { userId }
      }),
      
      // Удаляем избранные новости пользователя
      prisma.favoriteNews.deleteMany({
        where: { userId }
      }),
      
      // Удаляем события пользователя
      prisma.accountEvents.deleteMany({
        where: { account: userId }
      }),
      
      // Удаляем отзывы пользователя
      prisma.feetback.deleteMany({
        where: { userId }
      }),
      
      // Удаляем новости, созданные пользователем (и их лайки/избранное)
      prisma.newsLike.deleteMany({
        where: { post: { createdBy: userId } }
      }),
      prisma.favoriteNews.deleteMany({
        where: { newsRef: { createdBy: userId } }
      }),
      prisma.news.deleteMany({
        where: { createdBy: userId }
      }),
      
      // Наконец, удаляем самого пользователя
      prisma.account.delete({
        where: { primarykey: userId }
      })
    ]);

    console.log(`Пользователь ${userId} и все связанные данные успешно удалены`);

    // Дополнительно: удаляем аватар из S3, если он есть
    // (реализация зависит от вашего хранилища)
    // await deleteUserAvatarFromS3(userId);

  } catch (error) {
    console.error('Error in deleteUser:', error);
    throw new Error('Не удалось удалить пользователя и связанные данные');
  }
};