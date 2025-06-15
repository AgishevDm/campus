import prisma from '../prisma';

export const findOrCreateChat = async (userA: string, userB: string) => {
  const existing = await prisma.chat.findFirst({
    where: {
      participants: {
        some: { accountId: userA },
        every: { accountId: { in: [userA, userB] } },
      },
    },
    include: {
      participants: { include: { account: true } },
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });
  if (existing) return existing;

  return prisma.chat.create({
    data: {
      participants: {
        create: [
          { account: { connect: { primarykey: userA } } },
          { account: { connect: { primarykey: userB } } },
        ],
      },
    },
    include: {
      participants: { include: { account: true } },
      messages: true,
    },
  });
};

export const getUserChats = async (userId: string) => {
  return prisma.chat.findMany({
    where: { participants: { some: { accountId: userId } } },
    include: {
      participants: { include: { account: true } },
      messages: { orderBy: { createdAt: 'asc' }, take: 50 },
    },
  });
};

export const createMessage = async (chatId: string, senderId: string, content: string) => {
  return prisma.message.create({
    data: {
      chat: { connect: { id: chatId } },
      sender: { connect: { primarykey: senderId } },
      content,
    },
    include: {
      sender: true,
    },
  });
};
