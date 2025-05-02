import prisma from '../prisma';

export const analitycsInfoService = async () => {
  try {
    const totalUsers = await prisma.account.count();

    const usersByType = await prisma.account.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
        orderBy: {
          _count: {
            status: 'desc',
          },
        },
      });

    const result = {
    totalUsers,
    usersByType: usersByType.map(group => ({
        status: group.status || 'UNKNOWN',
        count: group._count.status,
    })),
    };

    return result;
  } catch (error) {
    console.error('Ошибка при получении аналитики:', error);
    throw ({ error: 'Внутренняя ошибка сервера' });
  }
};