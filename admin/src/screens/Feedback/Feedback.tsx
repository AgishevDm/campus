import { useState, useEffect } from 'react';
import { FiTrash2, FiSearch, FiFilter, FiPaperclip, FiCornerUpLeft } from 'react-icons/fi';
import './Feedback.scss';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  avatar: string;
  from: string;
  subject: string;
  content: string;
  date: string;
  attachments: string[];
  replies: Message[];
  isCheck: boolean;
  isDeleted: boolean;
}

export default function Feedback() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'inbox' | 'processed' | 'trash'>('inbox');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    subject: '',
    content: '',
    date: ''
  });
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState<string | null>(null); // Состояние ошибки

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
        if (!token) {
          alert('Вы не авторизованы. Пожалуйста, войдите в систему.');
          navigate('/');
          return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/feetback/getFeetbacks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Не удалось загрузить сообщения');
        }

        const data = await response.json();

        const formattedMessages: Message[] = data.map((item: any) => ({
          id: item.primarykey,
          avatar: item.avatarUrl,
          from: item.email,
          subject: item.title,
          content: item.message,
          date: new Date(item.createTime).toLocaleDateString(),
          attachments: item.document ? [item.document] : [],
          replies: [],
          isCheck: item.isCheck,
          isDeleted: item.isDeleted,
        }));


        setMessages(formattedMessages);
      } catch (error) {
        console.error('Ошибка при загрузке сообщений:', error);
        setError('Не удалось загрузить сообщения. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(msg => {
    if (activeTab === 'trash' && !msg.isDeleted) return false;
    if (activeTab !== 'trash' && msg.isDeleted) return false;

    const matchesSearch = msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters =
      msg.from.toLowerCase().includes(filters.from.toLowerCase()) &&
      msg.subject.toLowerCase().includes(filters.subject.toLowerCase()) &&
      msg.content.toLowerCase().includes(filters.content.toLowerCase()) &&
      (filters.date ? msg.date === filters.date : true);

    if (activeTab === 'processed') return msg.isCheck && matchesSearch;
    if (activeTab === 'inbox') return !msg.isCheck && matchesSearch;
    
    return matchesFilters && matchesSearch;
  });

  const handleDelete = async (id: string, deleteType: 'soft' | 'permanent') => {
    if (window.confirm('Вы уверены, что хотите удалить это сообщение?')) {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
        if (!token) {
          alert('Вы не авторизованы. Пожалуйста, войдите в систему.');
          navigate('/');
          return;
        }

        console.log(deleteType)
  
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/feetback/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ deleteType }), // Передаем тип удаления
        });
  
        if (response.ok) {
          if (deleteType === 'soft') {
            // Обновляем состояние для мягкого удаления
            setMessages(messages.map(msg => msg.id === id ? { ...msg, isDeleted: true } : msg));
          } else {
            // Удаляем сообщение из состояния для перманентного удаления
            setMessages(messages.filter(msg => msg.id !== id));
          }
          alert('Сообщение успешно удалено!');
        } else {
          const errorData = await response.json();
          alert(`Ошибка: ${errorData.message || "Произошла ошибка при удалении."}`);
        }
      } catch (error) {
        console.error('Ошибка сети:', error);
        alert('Произошла ошибка сети. Пожалуйста, попробуйте позже.');
      }
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
      if (!token) {
        alert('Вы не авторизованы. Пожалуйста, войдите в систему.');
        navigate('/');
        return;
      }
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/feetback/${id}/restore`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        setMessages(messages.map(msg => msg.id === id ? { ...msg, isDeleted: false } : msg));
        alert('Сообщение успешно восстановлено!');
      } else {
        const errorData = await response.json();
        alert(`Ошибка: ${errorData.message || "Произошла ошибка при восстановлении."}`);
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
      alert('Произошла ошибка сети. Пожалуйста, попробуйте позже.');
    }
  };

  const sendEmail = async (messageId: string, replyText: string, userEmail: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/feetback/sendAnswer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          id: messageId,
          message: replyText,
          email: userEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Не удалось отправить письмо');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при отправке письма:', error);
      throw error;
    }
  };


  const handleReplySend = async () => {
    if (!selectedMessage) return;
  
    const newReply: Message = {
      id: Date.now().toString(),
      avatar: '', 
      from: 'admin@company.com',
      subject: `Re: ${selectedMessage.subject}`,
      content: replyText,
      date: new Date().toLocaleDateString(),
      attachments: [],
      replies: [],
      isCheck: true,
      isDeleted: false
    };
  
    setMessages(messages.map(msg =>
      msg.id === selectedMessage.id
        ? { 
            ...msg, 
            replies: [...msg.replies, newReply], 
            isCheck: true 
          }
        : msg
    ));

    try {
      await sendEmail(selectedMessage.id, replyText, selectedMessage.from);
      console.log('Письмо успешно отправлено');
    } catch (error) {
      console.error('Ошибка при отправке письма:', error);
      setError('Не удалось отправить письмо. Пожалуйста, попробуйте позже.');
    }
    
    setReplyText('');
    setIsReplying(false);
    setSelectedMessage(null);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const filtersElement = document.querySelector('.filters-dropdown');
      if (showFilters && filtersElement && !filtersElement.contains(e.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilters]);

  return (
    <div className="feedback-page">
      <h1 className="page-header">Обратная связь</h1>
      <div className="content-box">
      <div className="search-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Поиск по письмам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setShowFilters(false)}
          />
          <FiSearch className="search-icon" />
          <FiFilter
            className="filter-icon"
            onClick={() => setShowFilters(!showFilters)}
          />
        </div>

        {showFilters && (
          <div className="filters-dropdown">
            <input
              type="text"
              placeholder="От"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            />
            <input
              type="text"
              placeholder="Тема"
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            />
            <input
              type="text"
              placeholder="Содержит слова"
              value={filters.content}
              onChange={(e) => setFilters({ ...filters, content: e.target.value })}
            />
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            />
            <button onClick={() => setShowFilters(false)}>Применить фильтры</button>
          </div>
        )}
      </div>

      <div className="tabs-container">
        <button
          className={`tab ${activeTab === 'inbox' ? 'active' : ''}`}
          onClick={() => setActiveTab('inbox')}
        >
          Необработанные ({messages.filter(m => !m.isDeleted && !m.isCheck && m.replies.length === 0).length})
        </button>
        <button
          className={`tab ${activeTab === 'processed' ? 'active' : ''}`}
          onClick={() => setActiveTab('processed')}
        >
          Обработанные ({messages.filter(m => !m.isDeleted && m.isCheck).length})
        </button>
        <button
          className={`tab ${activeTab === 'trash' ? 'active' : ''}`}
          onClick={() => setActiveTab('trash')}
        >
          Корзина ({messages.filter(m => m.isDeleted).length})
        </button>
      </div>

      <div className="messages-list">
        <div className="list-header">
          <div>Аватар</div>
          <div>От кого</div>
          <div>Тема</div>
          <div>Содержание</div>
          <div>Дата</div>
          <div>Действия</div>
        </div>

        {filteredMessages.map(msg => (
          <div
            key={msg.id}
            className={`message-item ${!msg.isCheck ? 'unread' : ''}`}
            onClick={() => {
              setSelectedMessage(msg);
              if (!msg.isCheck) {
                setMessages(messages.map(m => (m.id === msg.id ? { ...m, isCheck: true } : m)));
              }
            }}
          >
            <div className="avatar-cell">
              <img src={msg.avatar} alt="Аватар" />
            </div>
            <div className="from">{msg.from}</div>
            <div className="subject">{msg.subject}</div>
            <div className="content">{msg.content.slice(0, 80)}...</div>
            <div className="date">{msg.date}</div>
            <div className="actions">
              {activeTab === 'trash' ? (
                <>
                  <FiCornerUpLeft
                    className="restore-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestore(msg.id);
                    }}
                  />
                  <FiTrash2
                    className="trash-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(msg.id, 'permanent');
                    }}
                  />
                </>
              ) : (
                <FiTrash2
                  className="trash-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(msg.id, 'soft');
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedMessage && (
        <div className="message-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setSelectedMessage(null)}>
              ×
            </button>

            <div className="message-header">
              <div className="avatar-circle">
                <img src={selectedMessage.avatar} alt="Аватар" />
              </div>
              <div className="message-info">
                <h2>{selectedMessage.subject}</h2>
                <div>От: {selectedMessage.from}</div>
                <div>Дата: {selectedMessage.date}</div>
              </div>
            </div>

            <div className="message-body">
              <p>{selectedMessage.content}</p>

              {selectedMessage.attachments.length > 0 && (
                <div className="attachments">
                  <h4>Вложения:</h4>
                  {selectedMessage.attachments.map((file, index) => (
                    <div key={index} className="file-item">
                      <FiPaperclip /> {file}
                    </div>
                  ))}
                </div>
              )}

              {selectedMessage.replies.length > 0 && (
                <div className="replies">
                  <h4>История переписки:</h4>
                  {selectedMessage.replies.map(reply => (
                    <div key={reply.id} className="reply">
                      <div className="reply-header">
                        <span>{reply.from}</span>
                        <span>{reply.date}</span>
                      </div>
                      <p>{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="reply-section">
              {isReplying ? (
                <>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Напишите ответ..."
                    style={{ width: '90%', fontFamily: 'Segoe UI, sans-serif' }}
                  />
                  <div className="reply-buttons">
                    <button className="send-btn" onClick={handleReplySend}>
                      Отправить
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setIsReplying(false)}
                    >
                      Отмена
                    </button>
                  </div>
                </>
              ) : (
                <button className="reply-btn" 
                 onClick={() => setIsReplying(true)}>
                  Ответить
                </button>
              )}
            </div>
          </div>
        </div>
      )}
       </div>
    </div>
  );
}