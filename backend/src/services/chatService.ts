import prisma from '../prisma';

export const createChatService = async (
  creatorId: string,
  participantIds: string[],
  name?: string,
  isGroup: boolean = false
) => {
  const chat = await prisma.chat.create({
    data: {
      name,
      isGroup,
      creatorId,
      participants: {
        create: participantIds.map(id => ({ userId: id }))
      }
    },
    include: {
      participants: {
        include: { user: { select: { primarykey: true, accountFIO: true, avatarUrl: true } } }
      },
      messages: true
    }
  });
  return chat;
};

export const getUserChatsService = async (userId: string) => {
  return prisma.chat.findMany({
    where: {
      participants: {
        some: { userId }
      }
    },
    include: {
      participants: {
        include: { user: { select: { primarykey: true, accountFIO: true, avatarUrl: true } } }
      },
      messages: {
        orderBy: { timestamp: 'asc' },
        include: { sender: { select: { primarykey: true, accountFIO: true, avatarUrl: true } } }
      }
    },
    orderBy: { lastActivity: 'desc' }
  });
};

export const createMessageService = async (
  chatId: string,
  senderId: string,
  text: string
) => {
  const message = await prisma.message.create({
    data: { chatId, senderId, text },
    include: { sender: { select: { primarykey: true, accountFIO: true, avatarUrl: true } } }
  });

  await prisma.chat.update({
    where: { id: chatId },
    data: { lastActivity: new Date() }
  });

  return message;
};

export const getMessagesService = async (chatId: string) => {
  return prisma.message.findMany({
    where: { chatId },
    orderBy: { timestamp: 'asc' },
    include: { sender: { select: { primarykey: true, accountFIO: true, avatarUrl: true } } }
  });
};
