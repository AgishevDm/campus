// ChatList.tsx
import React, { useState, useRef } from 'react';
import { FiPlus,FiInbox, FiSearch,FiArchive, FiLogOut, FiBell, FiTrash2, FiBellOff, FiSlash, FiUsers, FiX } from 'react-icons/fi';
import { RxDrawingPinFilled } from "react-icons/rx";
import { Chat, User } from './types';
import './Messenger.scss';

type ChatListProps = {
  chats: Chat[];
  selectedChat: Chat | null;
  chatFilter: 'all' | 'groups' | 'personal';
  searchQuery: string;
  pinnedChats: string[];
  countUnreadMessages: (type: 'all' | 'groups' | 'personal') => number;
  filteredChats: Chat[];
  setSearchQuery: (query: string) => void;
  setChatFilter: (filter: 'all' | 'groups' | 'personal') => void;
  setShowNewChatModal: (show: boolean) => void;
  setGroupCreationState: (state: any) => void;
  handleSelectChat: (chat: Chat) => void;
  togglePinChat: (chatId: string) => void;
  getLastMessagePreview: (chat: Chat) => React.ReactNode;
  formatLastMessageDate: (dateString: string) => string;
  setContextMenu: (menu: {x: number; y: number; chat: Chat} | null) => void;
  chatListWidth: number;
  showCreateMenu: boolean;
  setShowCreateMenu: (show: boolean) => void;
  createMenuRef: React.RefObject<HTMLDivElement>;
  menuRef: React.RefObject<HTMLDivElement>;
  isArchiveView: boolean;
  toggleArchiveView: () => void;
};

const ChatList = ({
  chats,
  selectedChat,
  chatFilter,
  searchQuery,
  pinnedChats,
  countUnreadMessages,
  filteredChats,
  setSearchQuery,
  setChatFilter,
  setShowNewChatModal,
  setGroupCreationState,
  handleSelectChat,
  getLastMessagePreview,
  formatLastMessageDate,
  setContextMenu,
  chatListWidth,
  showCreateMenu,
  setShowCreateMenu,
  createMenuRef,
  menuRef,
  isArchiveView,
  toggleArchiveView,
}: ChatListProps) => {

  // Позиционирование контекстного меню
  const getContextMenuPosition = (x: number, y: number, width: number) => {
    const menuWidth = 200;
    const rightSpace = window.innerWidth - x;
    
    if (rightSpace < menuWidth && x > menuWidth) {
      return { left: x - menuWidth, top: y };
    }
    return { left: x, top: y };
  };

  // ----- Long press handling for mobile -----
  const LONG_PRESS_DURATION = 500;
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStartCoords = useRef({ x: 0, y: 0 });
  const longPressTriggered = useRef(false);

  const startLongPress = (e: React.TouchEvent<HTMLDivElement>, chat: Chat) => {
    const touch = e.touches[0];
    touchStartCoords.current = { x: touch.clientX, y: touch.clientY };
    longPressTimer.current = setTimeout(() => {
      const position = getContextMenuPosition(touch.clientX, touch.clientY, chatListWidth);
      setContextMenu({ x: position.left, y: position.top, chat });
      longPressTriggered.current = true;
      longPressTimer.current = null;
    }, LONG_PRESS_DURATION);
  };

  const moveLongPress = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!longPressTimer.current) return;
    const touch = e.touches[0];
    if (
      Math.abs(touch.clientX - touchStartCoords.current.x) > 10 ||
      Math.abs(touch.clientY - touchStartCoords.current.y) > 10
    ) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <div className={`chat-list-msgr ${selectedChat ? 'with-active-chat' : ''}`}>
      <div className="header-msgr">
        <h2>{isArchiveView ? 'Архив' : 'Чаты'}</h2>
          <div className="header-controls-msgr">
             <button
                className="archive-btn-msgr"
                onClick={toggleArchiveView}>
                {isArchiveView ? <FiInbox size={24} /> : <FiArchive size={24} />}
              </button>
          <button
            className="new-chat-btn-msgr"
            onClick={() => setShowCreateMenu(!showCreateMenu)}
          >
            <FiPlus size={24} />
          </button>

          {showCreateMenu && (
            <div className="context-menu-msgr create-menu-msgr" ref={createMenuRef}>
              <button onClick={() => {
                setShowNewChatModal(true);
                setShowCreateMenu(false);
              }}>
                <FiUsers /> Начать общение
              </button>
              
              <button onClick={() => {
                setGroupCreationState((prev: any) => ({
                  ...prev,
                  show: true,
                  selectedUsers: [],
                  groupData: {name: '', avatar: ''}
                }));
                setShowCreateMenu(false);
              }}>
                <FiUsers /> Создать группу
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="search-bar-msgr">
        <FiSearch />
        <input
          placeholder="Поиск по чатам"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {!isArchiveView && (
      <div className="chat-filter-msgr">
        <button 
          className={`filter-btn-msgr ${chatFilter === 'all' ? 'active' : ''}`}
          onClick={() => setChatFilter('all')}
        >
          Все ({countUnreadMessages('all')})
        </button>
        <button 
          className={`filter-btn-msgr ${chatFilter === 'groups' ? 'active' : ''}`}
          onClick={() => setChatFilter('groups')}
        >
          Группы ({countUnreadMessages('groups')})
        </button>
        <button 
          className={`filter-btn-msgr ${chatFilter === 'personal' ? 'active' : ''}`}
          onClick={() => setChatFilter('personal')}
        >
          Личные ({countUnreadMessages('personal')})
        </button>
      </div>
       )}

      <div className="chats-msgr">
        {filteredChats.map(chat => (
          <div
            key={chat.id}
            className={`chat-item-msgr ${selectedChat?.id === chat.id ? 'active' : ''} ${chat.isPinned ? 'pinned' : ''}`}
            onClick={() => {
              if (longPressTriggered.current) {
                longPressTriggered.current = false;
                return;
              }
              handleSelectChat(chats.find(c => c.id === chat.id)!);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              const position = getContextMenuPosition(e.clientX, e.clientY, chatListWidth);
              setContextMenu({x: position.left, y: position.top, chat});
            }}
            onTouchStart={(e) => startLongPress(e, chat)}
            onTouchMove={moveLongPress}
            onTouchEnd={() => {
              cancelLongPress();
              longPressTriggered.current = false;
            }}
            onTouchCancel={() => {
              cancelLongPress();
              longPressTriggered.current = false;
            }}
          >
            <div className="chat-status-msgr">
              {chat.unread > 0 && (
                <span className="unread-count-msgr">{chat.unread}</span>
              )}
            </div>
            
            {chat.isPinned && <RxDrawingPinFilled className="pin-icon-msgr" />}
            <img 
              src={chat.avatar || '/ava/ava6.jpg'} 
              alt={chat.name} 
              className="chat-avatar-msgr"
            />
            <div className="chat-info-msgr">
              <h3>
                {chat.name}
                {chat.muted && <FiSlash className="mute-icon-header-msgr" />}
              </h3>
              <p className="last-message-preview-msgr">
                {getLastMessagePreview(chat)}
              </p>
              <span className="last-activity-msgr">
                {formatLastMessageDate(chat.lastActivity)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;