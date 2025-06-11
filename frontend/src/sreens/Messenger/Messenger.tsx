import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiPlus, FiArchive, FiSearch, FiMoreHorizontal, FiEdit, FiUsers, FiTrash2, 
  FiLogOut, FiX, FiBell, FiArrowDown, FiBellOff, FiInfo, FiImage, 
  FiUser,FiClock, FiCalendar, FiMapPin, FiSlash,FiCornerUpLeft,FiPaperclip, FiCopy, FiShare, FiBook, FiSmile, FiArrowLeft } from 'react-icons/fi';
import { RxDrawingPinFilled } from "react-icons/rx";
import { IoSend } from "react-icons/io5";
import './Messenger.scss';
import {Chat, User, CalendarEvent, Message} from './types'
import UserInfoPanel from './UserInfoPanel';
import GroupInfoPanel from './GroupInfoPanel';
import GroupCreationModal from './GroupCreationModal';
import ChatCreationModal from './ChatCreationModal';
import ChatList from './ChatList';
import GroupEditPanel from './GroupEditPanel'
import FileUploadPreview from './FileUploadPreview';
import FileMessage from './FileMessage';
import EventModal from './EventModal';
import EventMessage from './EventMessage';
import MessageInput from "./MessageInput";
import ForwardMessageModal from './ForwardMessageModal';
//import { LocationPreview, LocationModal } from './LocationMessage';
import { mockUsers, mockChats, chatServiceMock  } from './mockData';

const Messenger = () => {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
 // const [showGroupCreateModal, setShowGroupCreateModal] = useState(false);
 // const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [contextMenu, setContextMenu] = useState<{x: number; y: number; chat: Chat} | null>(null);
  const [messageContextMenu, setMessageContextMenu] = useState<{x: number; y: number; message: Message} | null>(null);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
 // const [userSearchResults, setUserSearchResults] = useState<User[]>([]);
 // const [groupCreationData, setGroupCreationData] = useState<{name: string; avatar: string}>({name: '', avatar: ''});
  const [currentUser] = useState<User>(mockUsers[0]);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [pinnedChats, setPinnedChats] = useState<string[]>([]);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const createMenuRef = useRef<HTMLDivElement>(null!);
  const menuRef = useRef<HTMLDivElement>(null!);
  const [chatFilter, setChatFilter] = useState<'all' | 'groups' | 'personal'>('all');
  const [typingAnimation, setTypingAnimation] = useState(0);
  //const [hasNewMessages, setHasNewMessages] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [chatListWidth] = useState(350);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState<User | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const prevMessageCountRef = useRef<number>(0);
  const [unreadOthersMessages, setUnreadOthersMessages] = useState(0);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const prevMessagesLengthRef = useRef<number>(0);
  const [showGroupEdit, setShowGroupEdit] = useState(false);
  const [isArchiveView, setIsArchiveView] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  //const [showAttachMenu, setShowAttachMenu] = useState(false);
  const attachBtnRef = useRef<HTMLButtonElement>(null);
  const [attachMenuPosition, setAttachMenuPosition] = useState({ top: 0, left: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  //const [selectedLocation, setSelectedLocation] = useState<{lat: number; lng: number; address?: string} | null>(null);

  const [groupCreationState, setGroupCreationState] = useState<{
    show: boolean;
    selectedUsers: User[];
    groupData: {name: string; avatar: string};
  }>({
    show: false,
    selectedUsers: [],
    groupData: {name: '', avatar: ''}
  });

  const [filesToUpload, setFilesToUpload] = useState<Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    progress: number;
    url?: string;
  }>>([]);

  const [showForwardModal, setShowForwardModal] = useState(false);
  const [messageToForward, setMessageToForward] = useState<Message | null>(null);

  // Обработчик для загрузки файлов
  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  // Функции для работы с файлами:
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles)
      .slice(0, 10 - filesToUpload.length) // Максимум 10 файлов
      .map(file => ({
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
      }));

    if (selectedFiles.length > 10 - filesToUpload.length) {
      alert('Максимум 10 файлов');
    }

    setFilesToUpload(prev => [...prev, ...newFiles]);
    e.target.value = ''; 
  };

  const handleFileUploadComplete = (fileId: string, url: string) => {
    setFilesToUpload(prev => 
      prev.map(file => 
        file.id === fileId ? { ...file, progress: 100, url } : file
      )
    );
  };
  
  const handleRemoveFile = (fileId: string) => {
    setFilesToUpload(prev => prev.filter(file => file.id !== fileId));
  };
  
  const handleClearAllFiles = () => {
    setFilesToUpload([]);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles) return;
  
    const newFiles = Array.from(droppedFiles)
      .slice(0, 10 - filesToUpload.length) // Максимум 10 файлов
      .map(file => ({
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
      }));
  
    if (droppedFiles.length > 10 - filesToUpload.length) {
      alert('Максимальное количество файлов - 10. Будут добавлены первые 10 файлов.');
    }
  
    setFilesToUpload(prev => [...prev, ...newFiles]);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Форматирование даты для списка чатов
  const formatLastMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    } else if (date > yesterday) {
      return 'Вчера ' + date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    } else if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('ru-RU', {day: 'numeric', month: 'long'});
    } else {
      return date.toLocaleDateString('ru-RU', {day: 'numeric', month: 'long', year: 'numeric'});
    }
  };

  // Форматирование даты для сообщений в чате
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) return 'Сегодня';
    
    const options: Intl.DateTimeFormatOptions = date.getFullYear() === today.getFullYear() 
      ? { day: 'numeric', month: 'long' } 
      : { day: 'numeric', month: 'long', year: 'numeric' };
    
    return date.toLocaleDateString('ru-RU', options);
  };

  // Прокрутка к последнему сообщению
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const container = messagesContainerRef.current;
    if (!container) return;
  
    const isNearBottom = container.scrollHeight - (container.scrollTop + container.clientHeight) < 100;
    
    // Всегда прокручиваем вниз при отправке сообщения
    if (!isNearBottom || behavior === 'auto') {
      messagesEndRef.current?.scrollIntoView({ behavior });
    }
  }, []);

  useEffect(() => {
    if (selectedChat) {
      const currentMessageCount = selectedChat.messages.length;
      if (currentMessageCount > prevMessageCountRef.current) {
        scrollToBottom('auto');
      }
      prevMessageCountRef.current = currentMessageCount;
    }
  }, [selectedChat?.messages?.length]);

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth <= 1023);
    window.addEventListener('resize', checkMobile);
    checkMobile(); // Проверить сразу при монтировании
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const openUserInfo = (user: User) => {
    setSelectedUserInfo(user);
    setShowUserInfo(true);
    setShowGroupInfo(false);
  };

  // Анимация печатания
  useEffect(() => {
    if (selectedChat?.typingUsers?.length) {
      const interval = setInterval(() => {
        setTypingAnimation(prev => (prev + 1) % 4);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [selectedChat?.typingUsers?.length]);

  // Проверка новых сообщений при скролле
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || !selectedChat) return;
  
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const currentIsNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
      setIsNearBottom(currentIsNearBottom);
      
      // Показывать индикатор если пользователь не внизу
      setShowScrollIndicator(!currentIsNearBottom);

      // Если пользователь приблизился к низу - сбрасываем счетчик непрочитанных
      if (currentIsNearBottom && unreadOthersMessages > 0) {
        setUnreadOthersMessages(0);
      }
    };
  
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [selectedChat, unreadOthersMessages]);

  // Эффект для отслеживания новых сообщений от других пользователей
  useEffect(() => {
    if (!selectedChat) return;
    
    const currentMessagesLength = selectedChat.messages.length;
    const prevMessagesLength = prevMessagesLengthRef.current;
    
    if (currentMessagesLength > prevMessagesLength) {
      const newMessages = selectedChat.messages.slice(prevMessagesLength);
      const othersMessagesCount = newMessages.filter(
        msg => msg.sender.id !== currentUser.id && !isNearBottom
      ).length;
  
      if (othersMessagesCount > 0) {
        setUnreadOthersMessages(prev => prev + othersMessagesCount);
      }
    }
    
    prevMessagesLengthRef.current = currentMessagesLength;
  }, [selectedChat?.messages, isNearBottom, currentUser.id]);

  // Отметить сообщения как прочитанные при открытии чата
  useEffect(() => {
    if (!selectedChat) return;
  
    // Оптимизация: проверяем есть ли непрочитанные сообщения
    const hasUnread = selectedChat.unread > 0 || 
      selectedChat.messages.some(msg => !msg.read);
  
    if (!hasUnread) return;
  
    // Атомарное обновление состояния
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === selectedChat.id) {
          return {
            ...chat,
            unread: 0,
            messages: chat.messages.map(msg => ({ ...msg, read: true }))
          };
        }
        return chat;
      });
    });
  
    // Синхронизация selectedChat с обновленным списком чатов
    setSelectedChat(prev => {
      if (!prev) return null;
      return {
        ...prev,
        unread: 0,
        messages: prev.messages.map(msg => ({ ...msg, read: true }))
      };
    });
  
  }, [selectedChat?.id]);

  // Имитация получения нового сообщения (в mockData пример происходит)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let typingTimeout: NodeJS.Timeout;
  
    if (!selectedChat) {
      const result = chatServiceMock.simulateIncomingMessage(
        (updateFn) => setChats(updateFn)
      );
      timer = result.timer;
      typingTimeout = result.typingTimeout;
    }
    // Чистим таймеры при анмаунте или изменении selectedChat
    return () => {
      clearTimeout(timer);
      clearTimeout(typingTimeout);
    };
  }, [selectedChat]); 

  // Открытие панели информации о группе
  const handleOpenGroupInfo = () => {
    if (selectedChat?.isGroup) {
      setShowGroupInfo(true);
      setShowGroupEdit(false);
      setShowUserInfo(false);
    }
  };

  // Обработчик открытия меню
  const handleAttachClick = () => {
    if (!attachBtnRef.current) return;

    const rect = attachBtnRef.current.getBoundingClientRect();
    const menuHeight = 150; // Примерная высота меню

    // Контекстное меню всегда отображаем над иконкой скрепки
    let top = rect.top - menuHeight - 5;
    let left = rect.left - 100; // Смещение для центрирования

    // Корректировка по горизонтали
    if (left < 0) left = 5;
    if (left + 200 > window.innerWidth) left = window.innerWidth - 205;

    setAttachMenuPosition({ top, left });
  };

  const handleSaveGroupChanges = (updatedChat: Chat) => {
    setChats(chats.map(c => c.id === updatedChat.id ? updatedChat : c));
    setSelectedChat(updatedChat);
    setShowGroupEdit(false);
  };

  const handleStartChat = (user: User) => {
    const targetParticipantIds = [user.id, currentUser.id].sort();
    const existingChat = chats.find(chat => 
      !chat.isGroup && 
      chat.participants.length === 2 &&
      chat.participants
        .map(p => p.id)           
        .sort()
        .join() === targetParticipantIds.join()
    );
    
    if (existingChat) {
      setSelectedChat(existingChat);
      setShowUserInfo(false);
      return;
    }
  
    const newChat: Chat = {
      id: Date.now().toString(),
      name: user.name,
      avatar: user.avatar,
      isGroup: false,
      participants: [user, currentUser],
      messages: [],
      muted: false,
      unread: 0,
      createdAt: new Date().toISOString(),
      isPinned: false,
      lastActivity: new Date().toISOString(),
      typingUsers: []
    };
  
    setChats([newChat, ...chats]);
    setSelectedChat(newChat);
    setShowUserInfo(false);
  };

  // Отправка сообщения
  const handleSendMessage = () => {
    if (!newMessage.trim() && filesToUpload.length === 0 && !messageToForward) return;
    
    const uploadedFiles = filesToUpload.filter(f => f.progress === 100);
  
    const messageToSend = editingMessage
      ? {
          ...editingMessage,
          text: newMessage,
          isEdited: true,
          timestamp: new Date().toISOString(),
          files: uploadedFiles.map(f => ({
            id: f.id,
            name: f.name,
            size: f.size,
            type: f.type,
            url: f.url || ''
          }))
        }
      : {
          id: Date.now().toString(),
          text: newMessage,
          sender: currentUser,
          timestamp: new Date().toISOString(),
          read: false,
          files: uploadedFiles.map(f => ({
            id: f.id,
            name: f.name,
            size: f.size,
            type: f.type,
            url: f.url || ''
          })),
          ...(messageToForward
            ? {
                forwardedFrom: {
                  sender: messageToForward.sender,
                  text: messageToForward.text,
                },
              }
            : {}),
        };
  
    const updatedChat = {
      ...selectedChat!,
      messages: editingMessage
        ? selectedChat!.messages.map(msg => 
            msg.id === editingMessage.id ? {...messageToSend, read: true} : msg
          )
        : [...selectedChat!.messages, messageToSend],
      lastActivity: new Date().toISOString(),
      typingUsers: []
    };
  
    setChats(prevChats => {
      const updatedChats = prevChats.map(chat => 
        chat.id === selectedChat!.id ? updatedChat : chat
      );
      setSelectedChat(updatedChat);
      return updatedChats;
    });
  
    setNewMessage('');
    setEditingMessage(null);
    setFilesToUpload([]);
    setMessageToForward(null);
    
    setTimeout(() => {
      scrollToBottom('auto');
      setUnreadOthersMessages(0);
    }, 50);
  };

  // Открытие выбранного чата
  const handleSelectChat = (chat: Chat) => {
    if (chat.isArchived && !isArchiveView) return;
      setSelectedChat(chat);
      setShowUserInfo(false); 
  };

  // Индикатор набора сообщения
  const handleTyping = useCallback(() => {
    if (!selectedChat) return;

    if (typingTimeout) clearTimeout(typingTimeout);
    
    setTypingTimeout(setTimeout(() => {
      // Логика остановки индикатора
      setChats(chats.map(chat => 
        chat.id === selectedChat.id 
          ? {...chat, typingUsers: []} 
          : chat
      ));
      if (selectedChat) {
        setSelectedChat({
          ...selectedChat,
          typingUsers: []
        });
      }
    }, 0));
  }, [selectedChat, typingTimeout]);

  // Группировка сообщений по датам
  const groupMessagesByDate = (messages: Message[]) => {
    const grouped: {[key: string]: Message[]} = {};
    messages.forEach(message => {
      const dateKey = formatMessageDate(message.timestamp);
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(message);
    });
    return grouped;
  };

  // Закрепление чатов
  const togglePinChat = (chatId: string) => {
    setPinnedChats(prev => {
      if (prev.includes(chatId)) {
        return prev.filter(id => id !== chatId);
      } else if (prev.length < 5) {
        return [...prev, chatId];
      }
      return prev;
    });

    setChats(chats.map(chat => 
      chat.id === chatId ? {...chat, isPinned: !chat.isPinned} : chat
    ));
  };

  // Фильтрация чатов
  const sortedChats = [...chats].sort((a, b) => {
    if (pinnedChats.includes(a.id) && !pinnedChats.includes(b.id)) return -1;
    if (!pinnedChats.includes(a.id) && pinnedChats.includes(b.id)) return 1;
    return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
  });

  // Сортировка чатов
  const filteredChats = sortedChats.filter(chat => {
    if (isArchiveView) {
      return chat.isArchived;
    }
  
    return !chat.isArchived && (chatFilter === 'all' ? true : 
           chatFilter === 'groups' ? chat.isGroup : 
           !chat.isGroup);
  });

  // Закрытие меню при клике вне области
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
        setContextMenu(null);
        setMessageContextMenu(null);
      }
      if (createMenuRef.current && !createMenuRef.current.contains(e.target as Node)) {
        setShowCreateMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Получение последнего сообщения для отображения в списке чатов
  const getLastMessagePreview = (chat: Chat) => {
    if (!chat.messages || chat.messages.length === 0) return 'Нет сообщений';

    if (chat.typingUsers?.length > 0) {
      const dots = '.'.repeat(typingAnimation + 1);
      if (chat.isGroup) {
        const typingUser = chat.participants.find(p => p.id === chat.typingUsers?.[0]);
        return (
            <span className="glow-effect">
              {chat.isGroup ? `${typingUser?.name} ` : ''}
              печатает
              <span className="typing-dots">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </span>
            </span>
          );
      }
      return (
        <span className="glow-effect">
          Печатает
          <span className="typing-dots">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </span>
        </span>
      );
    }
    
    const lastMessage = chat.messages[chat.messages.length - 1];
    const senderName = lastMessage.sender.id === currentUser.id 
      ? 'Вы' 
      : chat.isGroup 
        ? `${lastMessage.sender.name}:` 
        : '';
    
    return `${senderName} ${lastMessage.text.slice(0, 30)}${lastMessage.text.length > 30 ? '...' : ''}`;
  };

  // Обработчик создания события
  const handleCreateEvent = (event: CalendarEvent) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: '',
      sender: currentUser,
      timestamp: new Date().toISOString(),
      read: false,
      event
    };

    const updatedChat = {
      ...selectedChat!,
      messages: [...selectedChat!.messages, newMessage],
      lastActivity: new Date().toISOString()
    };

    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === selectedChat!.id ? updatedChat : chat
      )
    );
    setSelectedChat(updatedChat);
  };
// ДОДЕЛАТЬ ИНТЕГРАЦИЮ С КАЛЕНДАРЕМ
  const handleAddToCalendar = (event: CalendarEvent) => {
    // Здесь интеграция с API календаря
    alert(`Событие "${event.title}" добавлено в календарь`);
  };

  //
  // Обработчики
  const handleAttachLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newMessage: Message = {
            id: Date.now().toString(),
            text: 'Мое местоположение',
            sender: currentUser,
            timestamp: new Date().toISOString(),
            read: false,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: 'Текущая позиция' // Можно реализовать геокодирование
            }
          };

          const updatedChat = {
            ...selectedChat!,
            messages: [...selectedChat!.messages, newMessage],
            lastActivity: new Date().toISOString()
          };

          setChats(chats.map(c => c.id === selectedChat!.id ? updatedChat : c));
          setSelectedChat(updatedChat);
        },
        (error) => {
          alert('Не удалось получить геопозицию: ' + error.message);
        }
      );
    } else {
      alert('Геолокация не поддерживается вашим браузером');
    }
  };

  // 5. Логика удаления сообщений
  const handleDeleteMessage = (messageId: string) => {
    setChats(chats.map(chat => {
      if (chat.id === selectedChat?.id) {
        return {
          ...chat,
          messages: chat.messages.filter(msg => msg.id !== messageId)
        };
      }
      return chat;
    }));
    setMessageContextMenu(null);
  };

  const handleForwardToChat = (chatId: string) => {
    if (!messageToForward) return;

    const chatToOpen = chats.find(c => c.id === chatId);
    if (chatToOpen) {
      setSelectedChat(chatToOpen);
      setTimeout(() => scrollToBottom('auto'), 50);
    }

    setShowForwardModal(false);
  };

  // Проверка, можно ли редактировать сообщение (не старше 7 дней)
  const canEditMessage = (message: Message) => {
    const messageDate = new Date(message.timestamp);
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return messageDate > sevenDaysAgo;
  };

  // Получение статуса пользователя
  const getUserStatus = (user: User) => {
    if (user.online) return 'online';
    if (user.lastSeen) {
      const lastSeenDate = new Date(user.lastSeen);
      const now = new Date();
      const diffHours = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60 * 60);
      
      if (diffHours < 1) return 'был(а) недавно';
      if (diffHours < 24) return `был(а) ${Math.floor(diffHours)} ч. назад`;
      return `был(а) ${Math.floor(diffHours / 24)} д. назад`;
    }
    return 'offline';
  };

 //обработчик открытия окна редактирования
  const handleEditGroup = () => {
    setShowGroupEdit(true);
    setShowGroupInfo(false);
  };
 //обработчик закрытия окна редактирования
  const handleCloseGroupEdit = () => {
    setShowGroupEdit(false);
    setShowGroupInfo(true);
  };

  // Позиционирование контекстного меню
  const getContextMenuPosition = (x: number, y: number, width: number) => {
    const menuWidth = 160;
    const rightSpace = window.innerWidth - x;
    
    if (rightSpace < menuWidth && x > menuWidth) {
      return { left: x - menuWidth, top: y };
    }
    return { left: x, top: y };
  };

  // ----- Long press handling for messages -----
  const MSG_LONG_PRESS_DURATION = 500;
  const msgLongPressTimer = useRef<NodeJS.Timeout | null>(null);
  const msgTouchStart = useRef({ x: 0, y: 0 });

  const startMessageLongPress = (
    e: React.TouchEvent<HTMLDivElement>,
    message: Message
  ) => {
    const touch = e.touches[0];
    msgTouchStart.current = { x: touch.clientX, y: touch.clientY };
    msgLongPressTimer.current = setTimeout(() => {
      const position = getContextMenuPosition(
        touch.clientX,
        touch.clientY,
        window.innerWidth - chatListWidth
      );
      setMessageContextMenu({ x: position.left, y: position.top, message });
      msgLongPressTimer.current = null;
    }, MSG_LONG_PRESS_DURATION);
  };

  const moveMessageLongPress = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!msgLongPressTimer.current) return;
    const touch = e.touches[0];
    if (
      Math.abs(touch.clientX - msgTouchStart.current.x) > 10 ||
      Math.abs(touch.clientY - msgTouchStart.current.y) > 10
    ) {
      clearTimeout(msgLongPressTimer.current);
      msgLongPressTimer.current = null;
    }
  };

  const cancelMessageLongPress = () => {
    if (msgLongPressTimer.current) {
      clearTimeout(msgLongPressTimer.current);
      msgLongPressTimer.current = null;
    }
  };

  // Подсчет непрочитанных сообщений
  const countUnreadMessages = (type: 'all' | 'groups' | 'personal') => {
    return chats.reduce((count, chat) => {
      // Игнорируем архивные чаты
      if (chat.isArchived) return count;
      
      const matchesType = 
        type === 'all' ||
        (type === 'groups' && chat.isGroup) ||
        (type === 'personal' && !chat.isGroup);
      
      return matchesType ? count + chat.unread : count;
    }, 0);
  };

  return (
    <div className="messenger-container-msgr">
      {/* Список чатов */}
      <ChatList
        chats={chats}
        selectedChat={selectedChat}
        chatFilter={chatFilter}
        searchQuery={searchQuery}
        pinnedChats={pinnedChats}
        countUnreadMessages={countUnreadMessages}
        filteredChats={filteredChats}
        setSearchQuery={setSearchQuery}
        setChatFilter={setChatFilter}
        setShowNewChatModal={setShowNewChatModal}
        setGroupCreationState={setGroupCreationState}
        handleSelectChat={handleSelectChat}
        togglePinChat={togglePinChat}
        getLastMessagePreview={getLastMessagePreview}
        formatLastMessageDate={formatLastMessageDate}
        setContextMenu={setContextMenu}
        chatListWidth={chatListWidth}
        showCreateMenu={showCreateMenu}
        setShowCreateMenu={setShowCreateMenu}
        createMenuRef={createMenuRef}
        menuRef={menuRef}
        isArchiveView={isArchiveView}
        toggleArchiveView={() => setIsArchiveView(!isArchiveView)}
     />

     <input
        type="file"
        ref={fileInputRef}
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Активный чат */}
      {selectedChat && (
        <div 
          className="chat-window-msgr"
        >
          <div className="chat-header-msgr">
            <button 
                className="back-btn-msgr" 
                onClick={() => {
                    setSelectedChat(null);
                    setShowUserInfo(false);
                    setShowGroupInfo(false);
                }}
                >
                <FiX />
            </button>
            
            <div className="chat-info-msgr" onClick={() => {
                if (!selectedChat?.isGroup && selectedChat.participants.length > 0) {
                    openUserInfo(selectedChat.participants.find(p => p.id !== currentUser.id)!);
                }
                handleOpenGroupInfo()
                }}>
                <img src={selectedChat.avatar} alt={selectedChat.name} />
                <div>
                    <h3>
                    {selectedChat.name}
                    {selectedChat.muted && <FiSlash className="mute-icon-header-msgr" />}
                    </h3>
                {!selectedChat.isGroup && (
                  <p className="user-status-msgr">
                    {selectedChat.typingUsers?.length > 0
                        ? `Печатает${'.'.repeat(typingAnimation + 1)}` 
                        : getUserStatus(selectedChat.participants.find(p => p.id !== currentUser.id) || mockUsers[0])
                    }
                  </p>
                )}
                {selectedChat.isGroup && (
                  <p className="participants-count-msgr">
                    {selectedChat.typingUsers?.length > 0
                      ? `Печатает${'.'.repeat(typingAnimation + 1)}` 
                      : `${selectedChat.participants.length} участников`
                    }
                  </p>
                )}
              </div>
            </div>

            <div className="chat-actions-msgr">
              <button onClick={(e) => {
                e.stopPropagation();
                const position = getContextMenuPosition(e.clientX, e.clientY, window.innerWidth - chatListWidth);
                setMenuOpenId(selectedChat.id);
              }}>
                <FiMoreHorizontal />
              </button>

              {menuOpenId === selectedChat.id && (
                <div 
                  className="context-menu-msgr" 
                  ref={menuRef}
                  style={{
                    left: menuOpenId === selectedChat.id ? 'auto' : 'unset',
                    right: 0
                  }}
                >
                  <button onClick={() => {
                    if (!selectedChat.isGroup && selectedChat.participants.length > 0) {
                        openUserInfo(selectedChat.participants.find(p => p.id !== currentUser.id)!);
                    }
                    setMenuOpenId(null);
                    handleOpenGroupInfo()
                    }}>
                    <FiInfo /> Инфо
                  </button>
                  <button onClick={() => {/* Поиск по сообщениям */}}>
                    <FiSearch /> Поиск
                  </button>
                  <button onClick={() => {
                    const updatedChats = chats.map(c => 
                      c.id === selectedChat.id ? {...c, muted: !c.muted} : c
                    );
                    setChats(updatedChats);
                    setSelectedChat(updatedChats.find(c => c.id === selectedChat.id)!);
                    setMenuOpenId(null);
                  }}>
                    {selectedChat.muted ? <FiBell /> : <FiBellOff />}
                    {selectedChat.muted ? 'Вкл уведомления' : 'Выкл уведомления'}
                  </button>
                  {selectedChat.isGroup && selectedChat.creatorId === currentUser.id && (
                    <button onClick={() => {
                      setShowGroupEdit(true);
                      setShowGroupInfo(false);
                      setShowUserInfo(false);
                      setMenuOpenId(null);
                    }}>
                      <FiEdit /> Редактировать
                    </button>
                  )}
                  <button onClick={() => {
                    setChats(chats.filter(c => c.id !== selectedChat.id));
                    setSelectedChat(null);
                    setMenuOpenId(null);
                  }}>
                    <FiLogOut /> Выйти
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="messages-msgr" ref={messagesContainerRef}>
            {Object.entries(groupMessagesByDate(selectedChat.messages)).map(([date, messages]) => (
              <div key={date} className="date-section-msgr">
                <span className="date-label-msgr">{date}</span>
                {messages.map((message, index) => {
                  const isContinuation = index > 0 && 
                    messages[index - 1].sender.id === message.sender.id &&
                    new Date(message.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() < 60000;
                  
                  const isLastInGroup = index === messages.length - 1 || 
                    messages[index + 1].sender.id !== message.sender.id ||
                    new Date(messages[index + 1].timestamp).getTime() - new Date(message.timestamp).getTime() > 60000;

                  return (
                    <div
                        key={message.id}
                        className={`message-msgr ${message.sender.id === currentUser.id ? 'outgoing' : 'incoming'} ${isContinuation ? 'continuation' : ''} ${isLastInGroup ? 'last-in-group' : ''}`}
                        onContextMenu={(e) => {
                        e.preventDefault();
                        const position = getContextMenuPosition(e.clientX, e.clientY, window.innerWidth - chatListWidth);
                        setMessageContextMenu({x: position.left, y: position.top, message});
                        }}
                        onTouchStart={(e) => startMessageLongPress(e, message)}
                        onTouchMove={moveMessageLongPress}
                        onTouchEnd={cancelMessageLongPress}
                        onTouchCancel={cancelMessageLongPress}
                    >
                    <img 
                        src={message.sender.avatar || '/default-avatar.png'} 
                        alt={message.sender.name} 
                        className="message-avatar-msgr"
                    />
                      <div className="message-content-msgr">
                        {selectedChat.isGroup && message.sender.id !== currentUser.id && !isContinuation && (
                          <div className="message-sender-msgr">{message.sender.name}</div>

                        )}
                        {message.forwardedFrom && (
                          <>
                            <div className="forwarded-label-msgr">Переслано от {message.forwardedFrom.sender.name}</div>
                            <div className="forwarded-text-msgr">{message.forwardedFrom.text}</div>
                          </>
                        )}
                        {message.text && (
                          <div className="message-text-msgr">{message.text}</div>
                        )}
                        <span className="message-time-msgr">
                          {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                          {message.isEdited && <span className="edited-label-msgr">(ред.)</span>}
                        </span>
                        {message.files && message.files.length > 0 && (
                          <div className="message-files">
                            {message.files.map(file => (
                              <FileMessage 
                                key={file.id} 
                                file={file} 
                                onDownload={() => window.open(file.url, '_blank')}
                              />
                            ))}
                          </div>
                        )}
                        {message.event && (
                          <EventMessage 
                            message={message}
                            onAddToCalendar={() => handleAddToCalendar(message.event!)}
                            onViewDetails={() => setSelectedEvent(message.event!)}
                          />
                        )}
                        {/* {message.location && (
                          <LocationPreview
                            lat={message.location.lat}
                            lng={message.location.lng}
                            address={message.location.address}
                            onViewDetails={() => setSelectedLocation(message.location!)}
                          />
                        )} */}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {showScrollIndicator && (
            <button 
                className={`scroll-indicator-msgr ${unreadOthersMessages > 0 ? 'has-new' : ''}`}
                onClick={() => {
                scrollToBottom();
                setUnreadOthersMessages(0);
                }}
            >
                {unreadOthersMessages > 0 ? (
                `Новых сообщений: ${unreadOthersMessages}`
                ) : (
                <FiArrowDown className="scroll-icon" />
                )}
            </button>
            )}

            <div 
              className="message-input-msgr"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <button
                ref={attachBtnRef}
                className="attach-btn"
                onClick={handleAttachClick}
              >
                <FiPaperclip size={20} />
              </button>

              {messageToForward && (
                <div className="forward-preview-msgr">
                  <div className="forward-info">
                    Переслано от {messageToForward.sender.name}: {messageToForward.text}
                  </div>
                  <button
                    className="forward-cancel-btn"
                    onClick={() => setMessageToForward(null)}
                  >
                    <FiX />
                  </button>
                </div>
              )}
              
              <textarea
                placeholder={editingMessage ? "Редактирование сообщения..." : "Написать сообщение..."}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                rows={1}
              />
              
              <button 
                onClick={handleSendMessage}
                className="send-button-msgr"
                disabled={filesToUpload.some(f => f.progress < 100)}
              >
                <IoSend />
              </button>
              
              <FileUploadPreview
                files={filesToUpload}
                onRemove={handleRemoveFile}
                onUploadComplete={handleFileUploadComplete}
                onClearAll={handleClearAllFiles}
              />
            </div>
        </div>
      )}

       {/* Модальное окно просмотра локации */}
      {/* {selectedLocation && (
        <LocationModal
          lat={selectedLocation.lat}
          lng={selectedLocation.lng}
          address={selectedLocation.address}
          onClose={() => setSelectedLocation(null)}
        />
      )} */}

      {/* Модальное окно нового чата */}
      <ChatCreationModal
        show={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        currentUser={currentUser}
        chats={chats} 
        onCreateChat={(newChat) => {
            // Проверка на дубликаты перед добавлением
            if (!chats.some(c => c.id === newChat.id)) {
                setChats([newChat, ...chats]);
            }
            setSelectedChat(newChat);
        }}
       />

      {/* Модальное окно создания группы */}
      <GroupCreationModal 
        show={groupCreationState.show}
        onClose={() => setGroupCreationState(prev => ({...prev, show: false}))}
        onCreate={(newChat) => {
            setChats([newChat, ...chats]);
            setSelectedChat(newChat);
            setGroupCreationState(prev => ({...prev, show: false}));
        }}
         currentUser={currentUser}
    />
      {/* Модальное окно просмотра события */}
      {showEventModal && (
        <EventModal
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
          onSubmit={handleCreateEvent}
          currentUser={currentUser}
        />
      )}

      {selectedEvent && (
        <div className="modal-overlay">
          <div className="event-details-modal">
            <div className="modal-header">
              <h2>{selectedEvent.title}</h2>
              <FiX onClick={() => setSelectedEvent(null)} />
            </div>
            <div className="event-content">
              <p><FiClock /> {formatMessageDate(selectedEvent.start)}</p>
              {selectedEvent.location && <p><FiMapPin /> {selectedEvent.location}</p>}
              {selectedEvent.description && <p>{selectedEvent.description}</p>}
              <button 
                className="add-calendar-btn"
                onClick={() => handleAddToCalendar(selectedEvent)}
              >
                <FiCalendar /> Добавить в календарь
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Контекстное меню чата */}
      {contextMenu && (
        <div
          className="context-menu-msgr"
          style={{ 
            top: contextMenu.y, 
            left: contextMenu.x,
            zIndex: 1000
          }}
          ref={menuRef}
        >
          <button onClick={() => {
            togglePinChat(contextMenu.chat.id);
            setContextMenu(null);
          }}>
            {contextMenu.chat.isPinned ? <FiX /> : <RxDrawingPinFilled />}
            {contextMenu.chat.isPinned ? 'Открепить' : 'Закрепить'}
          </button>
          
          <button onClick={() => {
            const updatedChats = chats.map(c => 
              c.id === contextMenu.chat.id ? {...c, muted: !c.muted} : c
            );
            setChats(updatedChats);
            if (selectedChat?.id === contextMenu.chat.id) {
              setSelectedChat(updatedChats.find(c => c.id === contextMenu.chat.id)!);
            }
            setContextMenu(null);
          }}>
            {contextMenu.chat.muted ? <FiBell /> : <FiBellOff />}
            {contextMenu.chat.muted ? 'Вкл уведомления' : 'Выкл уведомления'}
          </button>

          {!contextMenu.chat.isArchived && !isArchiveView && (
      <button onClick={() => {
          setChats(chats.map(c => 
              c.id === contextMenu.chat.id ? {...c, isArchived: true} : c
          ));
          setContextMenu(null);
      }}>
          <FiArchive /> Архивировать
      </button>
    )}
      
    {isArchiveView && (
        <button onClick={() => {
            setChats(chats.map(c => 
                c.id === contextMenu.chat.id ? {...c, isArchived: false} : c
            ));
            setContextMenu(null);
        }}>
            <FiCornerUpLeft /> Вернуть
        </button>
    )}
          
          {contextMenu.chat.isGroup && contextMenu.chat.creatorId === currentUser.id && (
            <button onClick={() => {
              setSelectedChat(contextMenu.chat);
              setContextMenu(null);
              setShowGroupEdit(true);
              setShowGroupInfo(false);
              setShowUserInfo(false);
              setMenuOpenId(null);
            }}>
              <FiEdit /> Редактировать
            </button>
          )}
          
          <button onClick={() => {
            if (contextMenu.chat.isGroup) {
              setChats(chats.filter(c => c.id !== contextMenu.chat.id));
              if (selectedChat?.id === contextMenu.chat.id) {
                setSelectedChat(null);
              }
            } else {
              setChats(chats.filter(c => c.id !== contextMenu.chat.id));
              if (selectedChat?.id === contextMenu.chat.id) {
                setSelectedChat(null);
              }
            }
            setContextMenu(null);
          }}>
            {contextMenu.chat.isGroup ? <FiLogOut /> : <FiTrash2 />}
            {contextMenu.chat.isGroup ? 'Покинуть чат' : 'Удалить чат'}
          </button>
        </div>
      )}
     {/* контекстное меню скрепки (событие/ файл/ локация) */}
      <MessageInput
        showMenu={Boolean(attachMenuPosition.top)}
        menuPosition={attachMenuPosition}
        onCloseMenu={() => setAttachMenuPosition({ top: 0, left: 0 })}
        onAttachFile={handleAttachFile}
        onAttachEvent={() => setShowEventModal(true)}
        onAttachLocation={handleAttachLocation}
      />

      {/* Контекстное меню сообщения */}
      {messageContextMenu && (
    <div
      className="context-menu-msgr"
      style={{ 
        top: messageContextMenu.y, 
        left: messageContextMenu.x,
        zIndex: 1000
      }}
      ref={menuRef}
    >
      {messageContextMenu.message.sender.id === currentUser.id && (
        <>
          {canEditMessage(messageContextMenu.message) && (
            <button onClick={() => {
              setNewMessage(messageContextMenu.message.text);
              setEditingMessage(messageContextMenu.message);
              setMessageContextMenu(null);
            }}>
              <FiEdit /> Редактировать
            </button>
          )}
          <button onClick={() => handleDeleteMessage(messageContextMenu.message.id)}>
            <FiTrash2 /> Удалить
          </button>
        </>
      )}
      
      {/* Общие кнопки для всех сообщений */}
      <button onClick={() => {/* Ответить */}}><FiCornerUpLeft /> Ответить</button>
      <button
        onClick={() => {
          setMessageToForward(messageContextMenu.message);
          setShowForwardModal(true);
          setMessageContextMenu(null);
        }}
      >
        <FiShare /> Переслать
      </button>
      <button onClick={() => navigator.clipboard.writeText(messageContextMenu.message.text)}>
        <FiCopy /> Копировать
      </button>
    </div>
      )}

        {/* Панель информации о пользователе*/}
        {showUserInfo && selectedUserInfo && (
            <UserInfoPanel 
                user={selectedUserInfo}
                onClose={() => {
                    setShowUserInfo(false);
                    if (selectedChat?.isGroup) setShowGroupInfo(true);
                }}
                isMobile={isMobileView}
                onStartChat={handleStartChat}
                fromChat={true}
            />
        )}

        {/* Панель информации о группе */}
        {showGroupInfo && selectedChat?.isGroup && !showGroupEdit && (
          <GroupInfoPanel
            chat={selectedChat}
            currentUser={currentUser}
            onClose={() => setShowGroupInfo(false)}
            onAddParticipant={(user) => {
              const updatedChat = {
                ...selectedChat,
                participants: [...selectedChat.participants, user]
              };
              setChats(chats.map(c => c.id === selectedChat.id ? updatedChat : c));
              setSelectedChat(updatedChat);
            }}
            onRemoveParticipant={(userId) => {
              const updatedChat = {
                ...selectedChat,
                participants: selectedChat.participants.filter(p => p.id !== userId)
              };
              setChats(chats.map(c => c.id === selectedChat.id ? updatedChat : c));
              setSelectedChat(updatedChat);
            }}
            isMobile={isMobileView}
            onEditGroup={handleEditGroup}
            onStartChat={handleStartChat}
            chats={chats} 
          />
        )}
       {/* Панель редактирования группы */}
        {showGroupEdit && selectedChat?.isGroup && (
          <GroupEditPanel
            chat={selectedChat}
            currentUser={currentUser}
            onClose={handleCloseGroupEdit}
            onSave={(updatedChat) => {
              setChats(chats.map(c => c.id === updatedChat.id ? updatedChat : c));
              setSelectedChat(updatedChat);
              setShowGroupEdit(false);
              setShowGroupInfo(true);
            }}
            isMobile={isMobileView}
            onStartChat={handleStartChat}
            chats={chats}
          />
        )}

        <ForwardMessageModal
          show={showForwardModal}
          onClose={() => {
            setShowForwardModal(false);
            setMessageToForward(null);
          }}
          chats={chats}
          onForward={handleForwardToChat}
        />

    </div>
  );
};

export default Messenger;