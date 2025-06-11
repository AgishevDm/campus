import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { Chat } from './types';
import './Messenger.scss';

type Props = {
  show: boolean;
  onClose: () => void;
  chats: Chat[];
  onForward: (chatId: string) => void;
};

const ForwardMessageModal = ({ show, onClose, chats, onForward }: Props) => {
  const [query, setQuery] = useState('');

  if (!show) return null;

  const filteredChats = chats.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-overlay-msgr">
      <div className="modal-content-msgr" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-msgr">
          <h3>Переслать сообщение</h3>
          <button onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>
        <div className="search-section-msgr">
          <input
            type="text"
            placeholder="Поиск чатов"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="search-results-msgr">
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                className="user-result-msgr"
                onClick={() => onForward(chat.id)}
              >
                <img src={chat.avatar} alt={chat.name} />
                <div>
                  <h4>{chat.name}</h4>
                </div>
              </div>
            ))}
            {filteredChats.length === 0 && (
              <div className="no-results-msgr">Чат не найден</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForwardMessageModal;
