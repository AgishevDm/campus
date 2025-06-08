import prisma from '../prisma';

const mapUser = (u: any) => ({
  id: u.primarykey,
  name: u.accountFIO || '',
  avatar: u.avatarUrl || '',
  login: u.login || '',
  email: u.email || ''
});

const mapMessage = (m: any) => ({
  id: m.id,
  text: m.text,
  timestamp: m.timestamp,
  sender: mapUser(m.sender)
});

const mapChat = (c: any, currentUserId?: string) => {
  const participants = c.participants.map((p: any) => mapUser(p.user));
  let avatar = '';
  if (!c.isGroup && currentUserId) {
    const other = participants.find(p => p.id !== currentUserId);
    if (other) avatar = other.avatar;
  }
  return {
    id: c.id,
    name: c.name || '',
    avatar,
    isGroup: c.isGroup,
    creatorId: c.creatorId,
    lastActivity: c.lastActivity,
    isArchived: c.isArchived,
    participants,
    messages: c.messages.map(mapMessage)
  };
};

export const createChatService = async (
  creatorId: string,
  participantIds: string[],
  name?: string,
  isGroup: boolean = false
) => {
  if (!isGroup) {
    const existing = await prisma.chat.findFirst({
      where: {
        isGroup: false,
        participants: {
          every: { userId: { in: participantIds } },
        },
      },
      include: {
        participants: {
          include: { user: { select: { primarykey: true, accountFIO: true, avatarUrl: true, login: true, email: true } } },
        },
        messages: {
          orderBy: { timestamp: 'asc' },
          include: { sender: { select: { primarykey: true, accountFIO: true, avatarUrl: true, login: true, email: true } } },
        },
      },
    });
    if (existing && existing.participants.length === participantIds.length) {
      return mapChat(existing, creatorId);
    }
  }

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
        include: { user: { select: { primarykey: true, accountFIO: true, avatarUrl: true, login: true, email: true } } }
      },
      messages: {
        include: { sender: { select: { primarykey: true, accountFIO: true, avatarUrl: true, login: true, email: true } } }
      }
    }
  });
  return mapChat(chat, creatorId);
};

export const getUserChatsService = async (userId: string) => {
  const chats = await prisma.chat.findMany({
    where: {
      participants: {
        some: { userId }
      }
    },
    include: {
      participants: {
        include: { user: { select: { primarykey: true, accountFIO: true, avatarUrl: true, login: true, email: true } } }
      },
      messages: {
        orderBy: { timestamp: 'asc' },
        include: { sender: { select: { primarykey: true, accountFIO: true, avatarUrl: true, login: true, email: true } } }
      }
    },
    orderBy: { lastActivity: 'desc' }
  });
  return chats.map(c => mapChat(c, userId));
};

export const createMessageService = async (
  chatId: string,
  senderId: string,
  text: string
) => {
  const message = await prisma.message.create({
    data: { chatId, senderId, text },
    include: { sender: { select: { primarykey: true, accountFIO: true, avatarUrl: true, login: true, email: true } } }
  });

  await prisma.chat.update({
    where: { id: chatId },
    data: { lastActivity: new Date() }
  });

  return mapMessage(message);
};

export const getMessagesService = async (chatId: string) => {
  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { timestamp: 'asc' },
    include: { sender: { select: { primarykey: true, accountFIO: true, avatarUrl: true, login: true, email: true } } }
  });
  return messages.map(mapMessage);
};

export const getOrCreateFavoriteChatService = async (userId: string) => {
  const existing = await prisma.chat.findFirst({
    where: {
      isGroup: false,
      name: 'Избранное',
      participants: { some: { userId } },
    },
    include: {
      participants: {
        include: { user: { select: { primarykey: true, accountFIO: true, avatarUrl: true, login: true, email: true } } },
      },
      messages: {
        orderBy: { timestamp: 'asc' },
        include: { sender: { select: { primarykey: true, accountFIO: true, avatarUrl: true, login: true, email: true } } },
      },
    },
  });

  if (existing) return mapChat(existing, userId);

  return createChatService(userId, [userId], 'Избранное', false);
};
