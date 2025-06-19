import prisma from '../prisma';

export const getUserChats = async (userId: string) => {
  return prisma.chat.findMany({
    where: { participants: { some: { userId } } },
    include: {
      participants: {
        include: {
          user: {
            select: {
              primarykey: true,
              accountFIO: true,
              login: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      },
      messages: {
        include: {
          sender: {
            select: {
              primarykey: true,
              accountFIO: true,
              login: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { timestamp: 'asc' },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
};

export const createPrivateChat = async (userId: string, targetId: string) => {
  const existing = await prisma.chat.findFirst({
    where: {
      isGroup: false,
      AND: [
        { participants: { some: { userId } } },
        { participants: { some: { userId: targetId } } },
      ],
    },
  });

  if (existing) return existing;

  return prisma.chat.create({
    data: {
      isGroup: false,
      createdBy: userId,
      participants: {
        create: [{ userId }, { userId: targetId }],
      },
    },
  });
};

export const createGroupChat = async (
  creatorId: string,
  name: string,
  participantIds: string[],
) => {
  return prisma.chat.create({
    data: {
      name,
      isGroup: true,
      createdBy: creatorId,
      participants: {
        create: participantIds.map((id) => ({ userId: id })),
      },
    },
  });
};

export const addMessage = async (
  chatId: string,
  senderId: string,
  text: string,
) => {
  const message = await prisma.message.create({
    data: { chatId, senderId, text },
  });

  await prisma.chat.update({
    where: { id: chatId },
    data: { updatedAt: new Date() },
  });

  return message;
};
