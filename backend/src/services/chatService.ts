import prisma from '../prisma';

export const createChat = async (userId1: string, userId2: string) => {
  const [participant1Id, participant2Id] = [userId1, userId2].sort();

  const existing = await prisma.chat.findFirst({
    where: {
      participant1Id,
      participant2Id,
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.chat.create({
    data: {
      participant1Id,
      participant2Id,
    },
  });
};

export const getUserChats = async (userId: string) => {
  return prisma.chat.findMany({
    where: {
      OR: [{ participant1Id: userId }, { participant2Id: userId }],
    },
    include: {
      participant1: true,
      participant2: true,
      messages: {
        orderBy: { timestamp: 'asc' },
      },
    },
  });
};

export const createMessage = async (
  chatId: string,
  senderId: string,
  content: string
) => {
  return prisma.message.create({
    data: {
      chatId,
      senderId,
      content,
    },
  });
};

export const getChatMessages = async (chatId: string) => {
  return prisma.message.findMany({
    where: { chatId },
    orderBy: { timestamp: 'asc' },
  });
};
