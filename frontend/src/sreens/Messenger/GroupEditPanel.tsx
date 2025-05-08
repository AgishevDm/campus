import { useState, useRef, useEffect } from 'react';
import { FiX, FiUserPlus, FiSearch, FiTrash2, FiAlertCircle,FiVolume2, FiSave } from 'react-icons/fi';
import { FaRegUser } from 'react-icons/fa';
import { IoImageOutline } from 'react-icons/io5';
import UserInfoPanel from './UserInfoPanel';
import { User, Chat } from './types';
import { mockUsers } from './mockData';
import './GroupEditPanel.scss';
import './Messenger.scss';

type GroupEditPanelProps = {
  chat: Chat;
  currentUser: User;
  onClose: () => void;
  onSave: (updatedChat: Chat) => void;
  isMobile: boolean;
  onStartChat: (user: User) => void;
  chats: Chat[];
};

const GroupEditPanel = ({ chat, currentUser, onClose, onSave, isMobile, onStartChat, chats }: GroupEditPanelProps) => {
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState<User[]>([]);
  const [selectedUserInfo, setSelectedUserInfo] = useState<User | null>(null);
  const [contextMenu, setContextMenu] = useState<{x: number; y: number; user: User} | null>(null);
  const [groupName, setGroupName] = useState(chat.name);
  const [groupAvatar, setGroupAvatar] = useState(chat.avatar);
  const [participants, setParticipants] = useState<User[]>(chat.participants);
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

  const handleClose = () => {
    onClose(); 
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortedParticipants = [...participants].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  const removeGroupAvatar = () => {
    setGroupAvatar('');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setGroupAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddParticipant = (user: User) => {
    if (!participants.some(p => p.id === user.id)) {
      setParticipants([...participants, user]);
      setSearchQuery('');
      setUserSearchResults([]);
    }
  };

  const handleRemoveParticipant = (userId: string) => {
    if (userId !== currentUser.id) {
      setParticipants(participants.filter(p => p.id !== userId));
    }
    setContextMenu(null);
  };

  const handleSaveChanges = () => {
    const updatedChat = {
      ...chat,
      name: groupName,
      avatar: groupAvatar,
      participants: participants
    };
    onSave(updatedChat);
    onClose();
  };

  const checkIfChatExists = (user: User): boolean => {
    return chats.some((chat: Chat) => 
      !chat.isGroup && 
      chat.participants.length === 2 &&
      chat.participants.some((p: User) => p.id === user.id) &&
      chat.participants.some((p: User) => p.id === currentUser.id)
    );
  };

  return (
    <div className={`group-edit-panel-msgr ${isMobile ? 'active' : ''}`}>
      <div className="group-header-msgr">
        <h3>Редактирование</h3>
        <button onClick={handleClose}>
          <FiX size={24} />
        </button>
      </div>

      <div className="group-edit-content">
        <div className="group-avatar-section">
          <div className="avatar-upload-msgr" onClick={() => 
            document.getElementById('group-avatar-input')?.click()
          }>
            {groupAvatar ? (
              <>
                <img src={groupAvatar} alt="Group avatar" className="group-avatar" />
                <button
                  className="remove-avatar-btn-msgr"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeGroupAvatar();
                  }}
                >
                  <FiTrash2 />
                </button>
              </>
            ) : (
              <div className="avatar-placeholder-msgr">
                <IoImageOutline size={24} />
                <label htmlFor="group-avatar-input" className="upload-btn-msgr">
                  <IoImageOutline className="upload-icon-msgr" />
                </label>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              id="group-avatar-input"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
          </div>
          
          <input
            type="text"
            placeholder="Название группы"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            maxLength={50}
            className="group-name-input"
          />
        </div>

        <div className="first-group-edit-section">
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
                  placeholder="Добавить участников..."
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
                      onClick={() => handleAddParticipant(user)}
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

        <div className="group-edit-section">
          <h4>Участники ({participants.length})</h4>
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
                  <img src={user.avatar} alt={user.name} />
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
                {user.id !== currentUser.id && (
                  <button 
                    className="remove-participant-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveParticipant(user.id);
                    }}
                  >
                    <FiTrash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button 
          className="save-changes-btn"
          onClick={handleSaveChanges}
        >
          <FiSave /> Сохранить изменения
        </button>
      </div>

      {contextMenu && (
        <div 
          className="context-menu-msgr"
          ref={menuRef}
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button onClick={() => {
            handleRemoveParticipant(contextMenu.user.id);
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

export default GroupEditPanel;