import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import './Messenger.scss';
import { User, Chat } from './types';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

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
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
// создание чата
  const handleCreateChat = async (user: User) => {
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
  
    try {
      const res = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/api/messenger/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantIds: [user.id] })
      });
      const newChat: Chat = await res.json();
      onCreateChat(newChat);
      onClose();
    } catch (error) {
      console.error('Error creating chat', error);
    }
  };
  // Обработчик изменения строки поиска
  const handleChangeSearch = (value: string) => {
    setSearchQuery(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(async () => {
      if (value.length < 2) {
        setUserSearchResults([]);
        return;
      }
      try {
        const res = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/api/user/search?q=${encodeURIComponent(value)}`);
        const data: User[] = await res.json();
        setUserSearchResults(data);
      } catch (error) {
        console.error('Error searching users', error);
        setUserSearchResults([]);
      }
    }, 300);
    setSearchTimeout(timeout);
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
              onChange={(e) => handleChangeSearch(e.target.value)}
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