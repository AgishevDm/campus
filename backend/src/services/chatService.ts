import prisma from '../prisma';

export const createChatBetweenUsers = async (userId1: string, userId2: string) => {
  const existing = await prisma.chat.findFirst({
    where: {
      participants: {
        every: { accountId: { in: [userId1, userId2] } }
      }
    },
    include: {
      participants: { include: { account: true } },
      messages: { orderBy: { createTime: 'asc' } }
    }
  });
  if (existing) return existing;

  const chat = await prisma.chat.create({
    data: {
      participants: {
        create: [
          { account: { connect: { primarykey: userId1 } } },
          { account: { connect: { primarykey: userId2 } } }
        ]
      }
    },
    include: {
      participants: { include: { account: true } },
      messages: true
    }
  });

  return chat;
};

export const getChatsForUser = async (userId: string) => {
  return await prisma.chat.findMany({
    where: { participants: { some: { accountId: userId } } },
    include: {
      participants: { include: { account: true } },
      messages: {
        orderBy: { createTime: 'asc' },
        take: 50
      }
    },
    orderBy: { createTime: 'desc' }
  });
};

export const createMessage = async (chatId: string, senderId: string, text: string) => {
  return await prisma.message.create({
    data: {
      chat: { connect: { primarykey: chatId } },
      sender: { connect: { primarykey: senderId } },
      text
    },
    include: { sender: true }
  });
};
