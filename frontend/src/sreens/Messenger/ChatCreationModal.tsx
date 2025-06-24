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
  // создание чата через API
  const handleCreateChat = async (user: User) => {
    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/chats/private`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ targetId: user.id }),
        },
      );

      if (!response.ok) throw new Error('Failed to create chat');
      const chat = await response.json();
      onCreateChat(chat);
      onClose();
    } catch (err) {
      console.error('create chat error', err);
    }
  };
  // поиск пользователя в базе
  const handleSearchUsers = async () => {
    if (searchQuery.trim().length < 2) {
      setUserSearchResults([]);
      return;
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/search?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          setUserSearchResults([]);
          return;
        }
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
            <div className="search-input-wrapper-msgr">
              <input
                type="text"
                placeholder="Поиск по login или email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button className="search-btn-msgr" onClick={handleSearchUsers}>Найти</button>
            </div>
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