import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import './Messenger.scss';
import { User, Chat } from './types';


type ChatCreationModalProps = {
    show: boolean;
    onClose: () => void;
    currentUser: User;
    chats: Chat[]; 
    onCreateChat: (newChat: Chat) => void;
  };
  
  const ChatCreationModal = ({ show, onClose, currentUser, chats, onCreateChat }: ChatCreationModalProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [userSearchResults, setUserSearchResults] = useState<User[]>([]);
  // создание чата
    const handleCreateChat = (user: User) => {
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
      onCreateChat(existingChat);
      onClose();        
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
  
      onCreateChat(newChat);
      onClose();
    };
  // поиск пользователя в базе
  const handleSearchUsers = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setUserSearchResults([]);
      return;
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/search?q=${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) {
        throw new Error('Error searching users');
      }

      const data = await response.json();
      setUserSearchResults(data);
    } catch (err) {
      console.error('Ошибка поиска пользователей:', err);
      setUserSearchResults([]);
    }
  };
  
    if (!show) return null;
  
    return (
      <div className="modal-overlay-msgr">
        <div className="modal-content-msgr" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header-msgr">
            <h3>Новый чат</h3>
            <button onClick={onClose}>
              <FiX size={24} />
            </button>
          </div>
  
          <div className="search-section-msgr">
            <input
              type="text"
              placeholder="Поиск по login или email"
              value={searchQuery}
              onChange={(e) => handleSearchUsers(e.target.value)}
              autoFocus
            />
            <div className="search-results-msgr">
              {userSearchResults.length > 0 ? (
                userSearchResults.map(user => (
                  <div 
                    key={user.id} 
                    className="user-result-msgr" 
                    onClick={() => {
                         handleCreateChat(user);
                         setSearchQuery('');
                         setUserSearchResults([]);
                        }}
                    >
                    <img src={user.avatar || '/default-avatar.png'} alt={user.name} />
                    <div>
                      <h4>{user.name}</h4>
                      <p>@{user.login} • {user.email}</p>
                      {user.online ? (
                        <span className="online-status-msgr">online</span>
                      ) : (
                        <span className="offline-status-msgr">
                          был(а) {user.lastSeen || 'недавно'}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results-msgr">
                  {searchQuery ? 'Пользователь не найден' : 'Введите минимум 2 символа'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ChatCreationModal;