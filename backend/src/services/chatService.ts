import prisma from '../prisma';

export const createChat = async (accountId: string, otherAccountId: string) => {
  // Check if personal chat already exists
  const existing = await prisma.chat.findFirst({
    where: {
      isGroup: false,
      participants: {
        every: { accountId: { in: [accountId, otherAccountId] } },
      },
    },
    include: { participants: true },
  });
  if (existing) return existing;

  return await prisma.chat.create({
    data: {
      participants: {
        create: [
          { account: { connect: { primarykey: accountId } } },
          { account: { connect: { primarykey: otherAccountId } } },
        ],
      },
    },
    include: { participants: true },
  });
};

export const getChatsForUser = async (accountId: string) => {
  return prisma.chat.findMany({
    where: { participants: { some: { accountId } } },
    include: { participants: { include: { account: true } } },
    orderBy: { updateTime: 'desc' },
  });
};
