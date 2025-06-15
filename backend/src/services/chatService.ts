import prisma from '../prisma';

export const findOrCreateChat = async (userId: string, targetId: string) => {
  // Проверка существующего личного чата
  const existing = await prisma.chat.findFirst({
    where: {
      isGroup: false,
      AND: [
        { participants: { some: { accountId: userId } } },
        { participants: { some: { accountId: targetId } } }
      ]
    },
    include: {
      participants: { include: { account: true } },
      messages: true
    }
  });

  if (existing && existing.participants.length === 2) {
    return existing;
  }

  const chat = await prisma.chat.create({
    data: {
      isGroup: false,
      participants: {
        create: [
          { account: { connect: { primarykey: userId } } },
          { account: { connect: { primarykey: targetId } } }
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

export const createMessage = async (chatId: string, senderId: string, text: string) => {
  const message = await prisma.message.create({
    data: {
      chatId,
      senderId,
      text
    },
    include: {
      sender: true
    }
  });
  return message;
};

export const getUserChats = async (userId: string) => {
  return prisma.chat.findMany({
    where: { participants: { some: { accountId: userId } } },
    include: {
      participants: { include: { account: true } },
      messages: {
        orderBy: { createdAt: 'asc' }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });
};

export const getChatMessages = async (chatId: string) => {
  return prisma.message.findMany({
    where: { chatId },
    include: { sender: true },
    orderBy: { createdAt: 'asc' }
  });
};
