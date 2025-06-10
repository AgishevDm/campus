//тут чисто тестовые данные для пользователей/чатов/панелек
import {Chat, User} from './types'

export const mockUsers: User[] = [
    {
      id: 'current',
      name: 'Вы',
      login: 'dagishev',
      email: 'dagishev@gmail.com',
      avatar: './ava/ava.png',
      online: true,
      status: 'student',
      faculty: 'Факультет компьютерных наук',
      degree: 'Бакалавр',
      course: '3'
    },
    {
      id: '1',
      name: 'Иван Иванов',
      login: 'ivan',
      email: 'ivan@example.com',
      avatar: './ava/ava6.jpg',
      online: true,
      status: 'teacher',
      position: 'Доцент',
      department: 'Кафедра информатики'
    },
    {
      id: '2',
      name: 'Петр Петров', 
      login: 'petr',
      email: 'petr@example.com',
      avatar: './ava/ava23.jpg',
      online: false,
      status: 'student',
      faculty: 'Факультет компьютерных наук',
      degree: 'Бакалавр',
      course: '3'
    },
    {
      id: '3',
      name: 'Алексей Смирнов',
      login: 'alex',
      email: 'alex@example.com',
      avatar: './ava/ava10.jpg',
      online: false,
    },
    {
      id: '4',
      name: 'Мария Иванова',
      login: 'maria',
      email: 'maria@example.com',
      avatar: './ava/ava9.jpg',
      online: false,
    }
  ];
  
  export const mockChats: Chat[] = [
    {
      id: '1',
      name: 'Учебная группа',
      avatar: './ava/ava17.jpg',
      isGroup: true,
      participants: [mockUsers[0], mockUsers[1], mockUsers[2]],
      muted: false,
      messages: [
        { 
          id: '1', 
          text: 'Привет всем!', 
          sender: mockUsers[0],
          timestamp: new Date().toISOString(), 
          read: false 
        },
        { 
          id: '2', 
          text: 'Привет!', 
          sender: mockUsers[1],
          timestamp: new Date().toISOString(), 
          read: false 
        },
        { 
            id: '3', 
            text: 'Привет малышка!', 
            sender: mockUsers[2],
            timestamp: new Date().toISOString(), 
            read: false 
        }
      ],
      unread: 3,
      createdAt: new Date().toISOString(),
      isPinned: false,
      lastActivity: new Date().toISOString(),
      typingUsers: [],
      creatorId: 'current'
    },
    {
      id: '2',
      name: 'Иван Иванов',
      avatar: mockUsers[1].avatar,
      isGroup: false,
      participants: [mockUsers[0], mockUsers[1]],
      muted: false,
      messages: [
        { 
          id: '1', 
          text: 'Привет! Как дела?', 
          sender: mockUsers[2], 
          timestamp: new Date().toISOString(), 
          read: false 
        }
      ],
      unread: 1,
      createdAt: new Date().toISOString(),
      isPinned: false,
      lastActivity: new Date().toISOString(),
      typingUsers: []
    }
  ];

  export const chatServiceMock = {
    simulateIncomingMessage: (callback: (updateFn: (prevChats: Chat[]) => Chat[]) => void) => {
      const newMessage = {
        id: Date.now().toString(),
        text: 'Это тестовое сообщение для проверки',
        sender: mockUsers[1], // Используем существующего мокового пользователя
        timestamp: new Date().toISOString(),
        read: false
      };
  
      const timer = setTimeout(() => {
        callback(prevChats => {
          return prevChats.map(chat => {
            if (chat.id === '2') {
              return {
                ...chat,
                messages: [...chat.messages, newMessage],
                lastActivity: new Date().toISOString(),
                unread: chat.messages.filter(m => !m.read).length + 1,
                typingUsers: ['ivan']
              };
            }
            return chat;
          });
        });
      }, 10000);
  
      const typingTimeout = setTimeout(() => {
        callback(prevChats => prevChats.map(chat => 
          chat.id === '2' ? {...chat, typingUsers: []} : chat
        ));
      }, 20000);
  
      return { timer, typingTimeout };
    }
  };