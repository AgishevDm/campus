import prisma from '../prisma';

export const findOrCreateChat = async (userId: string, targetId: string) => {
  const existing = await prisma.chat.findFirst({
    where: {
      AND: [
        { participants: { some: { accountId: userId } } },
        { participants: { some: { accountId: targetId } } }
      ]
    },
    include: {
      participants: true
    }
  });

  if (existing && existing.participants.length === 2) {
    return existing;
  }

  const chat = await prisma.chat.create({
    data: {
      participants: {
        create: [
          { account: { connect: { primarykey: userId } } },
          { account: { connect: { primarykey: targetId } } }
        ]
      }
    },
    include: { participants: true }
  });

  return chat;
};
