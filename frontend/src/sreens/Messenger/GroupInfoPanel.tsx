import { useState, useRef, useEffect } from 'react';
import { FiX, FiUserPlus, FiSearch, FiTrash2, FiAlertCircle, FiVolume2, FiEdit } from 'react-icons/fi';
import { FaRegUser } from 'react-icons/fa';
import { IoImageOutline } from 'react-icons/io5';
import UserInfoPanel from './UserInfoPanel';
import { User, Chat } from './types';
import { mockUsers } from './mockData';
import './GroupInfoPanel.scss';
import './Messenger.scss';

type GroupInfoPanelProps = {
  chat: Chat;
  currentUser: User;
  onClose: () => void;
  onAddParticipant: (user: User) => void;
  onRemoveParticipant: (userId: string) => void;
  isMobile: boolean;
  onEditGroup: () => void;
  onStartChat: (user: User) => void;
  chats: Chat[];
};

const GroupInfoPanel = ({ 
  chat, 
  currentUser, 
  onClose, 
  onAddParticipant, 
  onRemoveParticipant, 
  isMobile,
  onEditGroup,
  onStartChat,
  chats
}: GroupInfoPanelProps) => {
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState<User[]>([]);
  const [selectedUserInfo, setSelectedUserInfo] = useState<User | null>(null);
  const [contextMenu, setContextMenu] = useState<{x: number; y: number; user: User} | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSearchUsers = (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setUserSearchResults([]);
      return;
    }
    
    // Фильтруем пользователей, исключая уже добавленных в чат
    const filtered = mockUsers.filter(user => 
      (user.login.toLowerCase().includes(query.toLowerCase()) || 
      user.email.toLowerCase().includes(query.toLowerCase()))
    ).filter(user => 
      !chat.participants.some(p => p.id === user.id)
    );
    
    setUserSearchResults(filtered);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setContextMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortedParticipants = [...chat.participants].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  const getOnlineStatus = (user: User) => {
    if (user.online) return 'online';
    const lastSeenDate = new Date(user.lastSeen || '');
    const hoursAgo = Math.floor((Date.now() - lastSeenDate.getTime()) / (1000 * 60 * 60));
    
    if (hoursAgo < 1) return 'был(а) недавно';
    if (hoursAgo < 24) return `был(а) ${hoursAgo} ч. назад`;
    return `был(а) ${Math.floor(hoursAgo / 24)} д. назад`;
  };

  const checkIfChatExists = (user: User): boolean => {
      return chats.some(chat => 
          !chat.isGroup && 
          chat.participants.length === 2 &&
          chat.participants.some(p => p.id === user.id) &&
          chat.participants.some(p => p.id === currentUser.id)
      );
  };

  return (
    <div className={`group-info-panel-msgr ${isMobile ? 'active' : ''}`}>
      <div className="group-header-msgr">
        <h3>Информация о группе</h3>
        <button onClick={onClose}>
          <FiX size={24} />
        </button>
      </div>

      <div className="group-info-content">
        <button 
          className="edit-group-btn"
          onClick={onEditGroup}
        >
          <FiEdit size={18} />
        </button>

        <div className="group-avatar-section">
          {chat.avatar ? (
            <img src={chat.avatar} alt={chat.name} className="group-avatar" />
          ) : (
            <div className="default-group-avatar">
              <IoImageOutline size={40} />
            </div>
          )}
          <h2>{chat.name}</h2>
          <p className="status-text">{chat.participants.length} участников</p>
        </div>

        <div className="first-group-info-section">
          {!showAddParticipant ? (
            <button 
              className="group-add-participant-btn"
              onClick={() => setShowAddParticipant(true)}
            >
              <FiUserPlus /> Добавить участника
            </button>
          ) : (
            <div className="group-search-container">
              <div className="group-search-bar">
                <FiSearch />
                <input
                  placeholder="Поиск по login или email"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearchUsers(e.target.value);
                  }}
                  autoFocus
                />
                <button 
                  className="group-close-search"
                  onClick={() => {
                    setShowAddParticipant(false);
                    setSearchQuery('');
                    setUserSearchResults([]);
                  }}
                >
                  <FiX />
                </button>
              </div>
              
              {userSearchResults.length > 0 && (
                <div className="group-search-results">
                  {userSearchResults.map(user => (
                    <div 
                      key={user.id} 
                      className="group-user-result"
                      onClick={() => {
                        onAddParticipant(user);
                        setSearchQuery('');
                        setUserSearchResults([]);
                        setShowAddParticipant(false);
                      }}
                    >
                      <img src={user.avatar || '/default-avatar.png'} alt={user.name} className="user-avatar" />
                      <div>
                        <h4>{user.name}</h4>
                        <p>@{user.login} • {user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="group-info-section">
          <h4>Участники ({chat.participants.length})</h4>
          <div className="group-participants-list">
            {sortedParticipants.map(user => (
              <div 
                key={user.id}
                className="group-participant-item"
                onContextMenu={(e) => {
                  if (user.id !== currentUser.id && chat.creatorId === currentUser.id) {
                    e.preventDefault();
                    setContextMenu({
                      x: e.clientX,
                      y: e.clientY,
                      user
                    });
                  }
                }}
                onClick={() => setSelectedUserInfo(user)}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="participant-avatar" />
                ) : (
                  <div className="default-user-avatar">
                    <FaRegUser size={20} />
                  </div>
                )}
                <div className="group-participant-info">
                  <div className="group-name-row">
                    <span>{user.name}</span>
                    {user.online && <span className="group-online-status"></span>}
                  </div>
                  <p>@{user.login}</p>
                </div>
                {user.id !== currentUser.id && chat.creatorId === currentUser.id && (
                  <button 
                    className={`remove-participant-btn ${isMobile ? 'mobile' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveParticipant(user.id);
                    }}
                  >
                    <FiTrash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {contextMenu && (
        <div 
          className="context-menu-msgr"
          ref={menuRef}
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button onClick={() => {
            onRemoveParticipant(contextMenu.user.id);
            setContextMenu(null);
          }}>
            <FiTrash2 /> Удалить
          </button>
          <button onClick={() => setContextMenu(null)}>
            <FiVolume2 /> Замьютить
          </button>
          <button onClick={() => setContextMenu(null)}>
            <FiAlertCircle /> Пожаловаться
          </button>
        </div>
      )}

      {selectedUserInfo && (
        <UserInfoPanel
          user={selectedUserInfo}
          onClose={() => setSelectedUserInfo(null)}
          isMobile={isMobile}            
          onStartChat={onStartChat}
          fromChat={false}
          hasExistingChat={checkIfChatExists(selectedUserInfo)}
        />
      )}
    </div>
  );
};

export default GroupInfoPanel;