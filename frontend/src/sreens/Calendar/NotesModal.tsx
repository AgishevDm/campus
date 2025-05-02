import { useState, useEffect, useRef, useCallback } from 'react';
import { FiPlus, FiMoreVertical, FiTrash2, FiShare2, FiArrowLeft, FiCheck, FiX,
FiCheckSquare, FiClock } from 'react-icons/fi';
import { HiOutlineSave } from "react-icons/hi";
import { FaHistory } from "react-icons/fa";
import { FaListCheck, FaListOl, FaListUl, FaBars  } from "react-icons/fa6";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import './NotesModal.scss';
import { useNavigate } from 'react-router-dom';

type ListType = 'checkbox' | 'dash' | 'number' | 'none';
type Note = {
    id: string;
    title: string;
    content: NoteItem[];
    listType: ListType;
    createdAt: string;
    updatedAt: string;
    history: HistoryEntry[];
};

type NoteItem = {
    id: string;
    text: string;
    checked: boolean;
};

type HistoryEntry = {
    timestamp: string;
    accountId: string;
    action: string;
};

type AccessLevel = 'VIEW' | 'EDIT';

type SharedUser = {
    id: string;
    login: string;
    access: AccessLevel;
  };

export const NotesModal = ({ isOpen, onClose, onSave }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (notes: Note[]) => void;
}) => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [showMenu, setShowMenu] = useState<string | null>(null);
    const [draftNote, setDraftNote] = useState<NoteItem[]>([]);
    const [title, setTitle] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [lastEnterTime, setLastEnterTime] = useState(0);
    const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [shareLogin, setShareLogin] = useState('');
    const [shareAccess, setShareAccess] = useState<AccessLevel>('EDIT');
    const [activeTab, setActiveTab] = useState<'history' | 'access'>('history');
    const [historyPosition, setHistoryPosition] = useState<DOMRect | null>(null);
    const [shareError, setShareError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchNotes();
        } else {
            setNotes([]);
            setSelectedNote(null);
            setDraftNote([]);
            setTitle('');
            setFocusedIndex(0);
            setShowHistory(false);
        }
    }, [isOpen]);
    
    const fetchNotes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            if (!token) {
                alert('Вы не авторизованы. Пожалуйста, войдите в систему.');
                navigate('/login');
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notes`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch notes');
            const data = await response.json();
            setNotes(data.map((note: any) => ({
                ...note,
                createdAt: note.createdAt || new Date().toISOString(),
                updatedAt: note.updatedAt || new Date().toISOString(),
                history: note.history || []
            })));
        } catch (err) {
            console.error('Error fetching notes:', err);
            setError('Не удалось загрузить заметки');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSharedUsers = async (noteId: string) => {
        try {
          const token = localStorage.getItem('token') || sessionStorage.getItem('token');
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${noteId}/shared`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) throw new Error('Failed to fetch shared users');
          const data = await response.json();
          setSharedUsers(data);
        } catch (err) {
          console.error('Error fetching shared users:', err);
          setError('Не удалось загрузить список пользователей с доступом');
        }
      };

      const handleShareNote = async () => {
        if (!selectedNote) return;
        
        setIsLoading(true);
        setShareError(null); 
        
        try {
          const token = localStorage.getItem('token') || sessionStorage.getItem('token');
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${selectedNote.id}/share`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              targetLogin: shareLogin,
              access: shareAccess
            })
          });
      
          if (!response.ok) throw new Error('Failed to share note');
          
          // Обновляем список пользователей с доступом
          await fetchSharedUsers(selectedNote.id);
          setShareDialogOpen(false);
          setShareLogin('');
        } catch (err) {
          console.error('Error sharing note:', err);
          setShareError('Не удалось предоставить доступ');
        } finally {
          setIsLoading(false);
        }
      };

      const handleUnshareNote = async (userId: string) => {
        if (!selectedNote) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
          const token = localStorage.getItem('token') || sessionStorage.getItem('token');
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${selectedNote.id}/unshare/${userId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
      
          if (!response.ok) throw new Error('Failed to unshare note');
          
          // Обновляем список пользователей с доступом
          await fetchSharedUsers(selectedNote.id);
        } catch (err) {
          console.error('Error unsharing note:', err);
          setError('Не удалось отозвать доступ');
        } finally {
          setIsLoading(false);
        }
      };

      useEffect(() => {
        if (selectedNote && 'id' in selectedNote && selectedNote.id) {
            fetchSharedUsers(selectedNote.id);
        }
      }, [selectedNote]);

    const saveNoteToServer = async (note: Note) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            if (!token) {
                alert('Вы не авторизованы. Пожалуйста, войдите в систему.');
                navigate('/login');
                return;
            }

            const isNewNote = !('id' in note) || !notes.some(n => n.id === note.id);
            const url = isNewNote 
                ? `${process.env.REACT_APP_API_URL}/api/notes`
                : `${process.env.REACT_APP_API_URL}/api/notes/${note.id}`;

            const response = await fetch(url, {
                method: isNewNote ? 'POST' : 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: note.title,
                    content: note.content,
                    listType: note.listType
                })
            });

            if (!response.ok) throw new Error('Failed to save note');
            return await response.json();
        } catch (err) {
            console.error('Error saving note:', err);
            throw err;
        }
    };

    const deleteNoteFromServer = async (id: string) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            if (!token) {
                alert('Вы не авторизованы. Пожалуйста, войдите в систему.');
                navigate('/login');
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete note');
        } catch (err) {
            console.error('Error deleting note:', err);
            throw err;
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {

          if (showMenu !== null) {
            const contextMenu = document.querySelector('.context-menu');
            const menuButton = document.querySelector(`.note-menu button`);
            
            if (
              !contextMenu?.contains(e.target as Node) &&
              !menuButton?.contains(e.target as Node)
            ) {
              setShowMenu(null);
            }
          }

          if (showHistory) {
            const historyModal = document.querySelector('.history-context-modal');
            const historyButton = document.querySelector('.history-btn');
            
            if (
              !historyModal?.contains(e.target as Node) &&
              !historyButton?.contains(e.target as Node)
            ) {
              setShowHistory(false);
              setHistoryPosition(null);
            }
          }
        };
    
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showMenu, showHistory]); 

    const focusTextarea = useCallback((index: number) => {
        const textarea = textareaRefs.current[index];
        if (textarea) {
            textarea.focus();
            const length = textarea.value.length;
            textarea.setSelectionRange(length, length);
        }
        setFocusedIndex(index);
    }, []);

    const handleCreateNote = () => {
        const newNote: Omit<Note, 'id'> = {
            title: 'Новая заметка',
            content: [{ id: '1', text: '', checked: false }],
            listType: 'none',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            history: [],
        };
        setSelectedNote(newNote as Note);
        setDraftNote(newNote.content);
        setTitle(newNote.title);
        setSharedUsers([]);
        setTimeout(() => focusTextarea(0), 0);
    };

    const toggleCheck = (id: string) => {
        setDraftNote(prev =>
            prev.map(item => 
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const handleTextChange = (id: string, text: string, index: number) => {
        setDraftNote(prev =>
          prev.map((item, i) => 
            item.id === id ? { 
              ...item, 
              text: selectedNote?.listType === 'none' 
                ? text 
                : item.text.replace(/^(\d+\.\s|-?\s?)/, '') + text 
            } : item
          )
        );
    };

    const generateId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      };

    const createNewItem = (listType: ListType, index: number): NoteItem => {
        const baseText = selectedNote?.listType === 'number' 
            ? `${index + 2}. ` 
            : selectedNote?.listType === 'dash' 
                ? '- ' 
                : '';
                
        return {
            id: generateId(),
            text: baseText,
            checked: false
        };
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLTextAreaElement>, 
        index: number
    ) => {
        const text = draftNote[index].text;
        const now = Date.now();
        
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            
            if (now - lastEnterTime < 300) {
                const newItem: NoteItem = {
                    id: Math.random().toString(36).substr(2, 9),
                    text: '',
                    checked: false
                };
                
                const newDraft = [...draftNote];
                newDraft.splice(index + 1, 0, newItem);
                setDraftNote(newDraft);
                setLastEnterTime(0);
                setTimeout(() => focusTextarea(index + 1), 0);
                return;
            }
            
            setLastEnterTime(now);

            if (text.trim() === '' && index === 0) return;
            if (text.trim() === '') return;

            const newItem = createNewItem(selectedNote?.listType || 'none', index);
            
            const newDraft = [...draftNote];
            newDraft.splice(index + 1, 0, newItem);
            setDraftNote(newDraft);
            
            setTimeout(() => focusTextarea(index + 1), 0);
        }

        if (e.key === 'Backspace' && text === '') {
            e.preventDefault();
            
            if (index === 0 && draftNote.length > 1) {
                const newDraft = draftNote.filter((_, i) => i !== 0);
                setDraftNote(newDraft);
                focusTextarea(0);
            } 
           
            else if (index > 0) {
                const newDraft = draftNote.filter((_, i) => i !== index);
                setDraftNote(newDraft);
                focusTextarea(index - 1);
            }
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (index > 0) focusTextarea(index - 1);
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (index < draftNote.length - 1) focusTextarea(index + 1);
        }

        if (e.key === 'Enter' && e.shiftKey) {
            const textarea = e.target as HTMLTextAreaElement;
            setTimeout(() => {
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight}px`;
            }, 0);
        }
    };

    const toggleListType = (type: ListType) => {
        if (!selectedNote) return;
        
        const updatedNote = {
            ...selectedNote,
            listType: type
        };
        
        const updatedContent = draftNote.map((item, index) => {
            let newText = item.text;
            if (type === 'number') {
                newText = `${index + 1}. ${item.text.replace(/^(\d+\.\s|-?\s?)/, '')}`;
            } else if (type === 'dash') {
                newText = `- ${item.text.replace(/^(\d+\.\s|-?\s?)/, '')}`;
            } else {
                newText = item.text.replace(/^(\d+\.\s|-?\s?)/, '');
            }
            
            return { ...item, text: newText };
        });

        setSelectedNote(updatedNote);
        setDraftNote(updatedContent);
    };

    const saveNote = async () => {
        if (!selectedNote) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            const updatedNote = {
                ...selectedNote,
                title: title.trim() || 'Без названия',
                content: draftNote.filter(item => item.text.trim() !== ''),
                updatedAt: new Date().toISOString()
            };
            
            const savedNote = await saveNoteToServer(updatedNote);
            
            setNotes(prev => {
                const existingNotes = 'id' in selectedNote 
                  ? prev.filter(n => n.id !== selectedNote.id)
                  : prev;
                return [...existingNotes, savedNote]
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
              });

              setSelectedNote(savedNote);
        } catch (err) {
            console.error('Error saving note:', err);
            setError('Не удалось сохранить заметку');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteNote = async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await deleteNoteFromServer(id);
            setNotes(prev => prev.filter(note => note.id !== id));
            if (selectedNote?.id === id) {
                setSelectedNote(null);
            }
        } catch (err) {
            console.error('Error deleting note:', err);
            setError('Не удалось удалить заметку');
        } finally {
            setIsLoading(false);
            setShowMenu(null);
        }
    };

    const renderMarker = (index: number) => {
        if (!selectedNote) return null;
        
        switch(selectedNote.listType) {
            case 'checkbox':
                return (
                    <input
                        type="checkbox"
                        checked={draftNote[index]?.checked || false}
                        onChange={() => toggleCheck(draftNote[index].id)}
                    />
                );
            case 'dash':
                return <span className="dash-marker">-</span>;
            case 'number':
                return <span className="number-marker">{index + 1}.</span>;
            default:
                return null;
        }
    };

    const renderShareDialog = () => {
        if (!shareDialogOpen) return null;
      
        return (
          <div className="modal-overlay">
            <div className="share-dialog">
              <h3>Предоставить доступ</h3>
              {shareError && (
                <div className="share-error-message">
                    {shareError}
                </div>
                )}
              <div className="form-group">
                <label>Логин пользователя:</label>
                <input
                  type="text"
                  value={shareLogin}
                  onChange={(e) => {
                    setShareLogin(e.target.value);
                    setShareError(null); 
                  }}
                  placeholder="Введите логин"
                />
              </div>
              <div className="form-group">
                <label>Уровень доступа:</label>
                <select
                  value={shareAccess}
                  onChange={(e) => setShareAccess(e.target.value as AccessLevel)}
                >
                  <option value="EDIT">Редактирование</option>
                  <option value="VIEW">Просмотр</option>
                </select>
              </div>
              <div className="dialog-actions">
                <button onClick={() => setShareDialogOpen(false)}>Отмена</button>
                <button onClick={handleShareNote} disabled={!shareLogin}>
                  Предоставить доступ
                </button>
              </div>
            </div>
          </div>
        );
      };

      const renderHistory = () => {
        if (!showHistory || !selectedNote || !historyPosition) return null;

        const isNewNote = !('id' in selectedNote);
      
        return (
            <div 
            className="history-context-modal"
            style={{
              '--origin-x': `${historyPosition.left + historyPosition.width/2}px`,
              '--origin-y': `${historyPosition.top}px`,
            } as React.CSSProperties}
          >
          <div className="history-panel">
            <div className="panel-tabs">
              <button 
                className={activeTab === 'history' ? 'active' : ''}
                onClick={() => setActiveTab('history')}
              >
                История
              </button>
              <button 
                    className={activeTab === 'access' ? 'active' : ''}
                    onClick={() => {
                        if (!isNewNote && selectedNote.id) {
                        setActiveTab('access');
                        fetchSharedUsers(selectedNote.id);
                        }
                    }}
                    disabled={isNewNote}
                    title={isNewNote ? "Сначала сохраните заметку" : ""}
                >
                Доступ
              </button>
              <button 
                    className="close-history-btn" 
                    onClick={() => {
                        setShowHistory(false);
                        setHistoryPosition(null);
                    }}
                    >
                    <FiX />
                </button>
            </div>
            
            <div className="panel-content">
              {activeTab === 'access' ? (
                <>
                  <div className="shared-users-list">
                    {sharedUsers.map(user => (
                      <div key={user.id} className="shared-user">
                        <span>{user.login}</span>
                        <span className={`access-${user.access.toLowerCase()}`}>
                          {user.access === 'EDIT' ? 'Редактирование' : 'Просмотр'}
                        </span>
                        <button 
                            onClick={() => handleUnshareNote(user.id)}
                            disabled={isLoading}
                            >
                            <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button 
                    className="add-share-btn"
                    onClick={() =>  {
                         setShareDialogOpen(true);
                         setShowHistory(false);
                         setHistoryPosition(null);
                        }}
                    >
                    <FiPlus /> Добавить пользователя
                  </button>
                </>
              ) : (
                <>
                  <div className="history-header">
                    <h4>История изменений</h4>
                  </div>
                  <div className="history-list">
                    {selectedNote.history.length > 0 ? (
                      [...selectedNote.history]
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map((entry, index) => (
                          <div key={index} className="history-entry">
                            <div className="history-action">
                              {getActionText(entry.action)}
                            </div>
                            <div className="history-time">
                              {format(new Date(entry.timestamp), 'dd MMM yyyy, HH:mm', { locale: ru })}
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="no-history">Нет данных об изменениях</div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          </div>
        );
      };

    const getActionText = (action: string) => {
        switch(action) {
            case 'CREATED':
                return 'Создание заметки';
            case 'UPDATED_TITLE':
                return 'Изменение заголовка';
            case 'UPDATED_CONTENT':
                return 'Изменение содержимого';
            case 'UPDATED_LIST_TYPE':
                return 'Изменение типа списка';
            case 'SHARED':
                return 'Поделился заметкой';
            case 'UNSHARED':
                return 'Отменил доступ';
            default:
                return action;
        }
    };

    return (
        <div className={`modal-overlay-notes ${isOpen ? 'open' : ''}`}>
            <div className="notes-modal">
                <div className="modal-header fixed-header">
                    {selectedNote ? (
                        <>
                            <div className="header-top-row">
                                <button 
                                    className="back-btn-note" 
                                    onClick={async () => {
                                        if ('id' in selectedNote) {
                                          await saveNote();
                                        }
                                        setSelectedNote(null);
                                        setShowHistory(false);
                                      }}
                                >
                                    <FiArrowLeft />
                                </button>
                                
                                <input
                                    type="text"
                                    className="note-title-input"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Название заметки"
                                    disabled={isLoading}
                                />
                                <button 
                                    className="save-btn" 
                                    onClick={async () => {
                                        await saveNote();
                                        setSelectedNote(null);
                                        setShowHistory(false);
                                    }}
                                    >
                                    <HiOutlineSave />
                                    <span>{isLoading }</span>
                                </button>
                            </div>

                            <div className="toolbar-note">
                                <button
                                    className={selectedNote.listType === 'checkbox' ? 'active' : ''}
                                    onClick={() => toggleListType('checkbox')}
                                    disabled={isLoading}
                                >
                                    <FaListCheck />
                                </button>
                                <button
                                    className={selectedNote.listType === 'dash' ? 'active' : ''}
                                    onClick={() => toggleListType('dash')}
                                    disabled={isLoading}
                                >
                                    <FaListUl />
                                </button>
                                <button
                                    className={selectedNote.listType === 'number' ? 'active' : ''}
                                    onClick={() => toggleListType('number')}
                                    disabled={isLoading}
                                >
                                    <FaListOl />
                                </button>
                                <button
                                    className={selectedNote.listType === 'none' ? 'active' : ''}
                                    onClick={() => toggleListType('none')}
                                    disabled={isLoading}
                                >
                                    <FaBars />
                                </button>
                                <button
                                    className="history-btn"
                                    onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const modalWidth = 300;
                                        const rightSpace = window.innerWidth - rect.right;
                                        const left = rightSpace > modalWidth 
                                            ? rect.left 
                                            : window.innerWidth - modalWidth - 16;
                                            
                                        setHistoryPosition({
                                            ...rect,
                                            left: left,
                                            right: left + modalWidth
                                        });
                                        setShowHistory(!showHistory);
                                    }}
                                    disabled={isLoading}
                                >
                                    <FaHistory />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="header-main-row">
                                <h3>Заметки</h3>
                                <button 
                                className="new-note-btn" 
                                onClick={handleCreateNote}
                                disabled={isLoading}
                                >
                                <FiPlus />
                                <span>Создать</span>
                                </button>
                            </div>
                            <button 
                                className="close-btn-notes" 
                                onClick={async () => {
                                    await saveNote();
                                    onClose();
                                }}
                                disabled={isLoading}
                            >
                                <FiX />
                            </button>
                        </>
                    )}
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                        <button onClick={() => setError(null)}>
                            <FiX />
                        </button>
                    </div>
                )}

                {isLoading && !selectedNote ? (
                    <div className="loading-overlay">
                        <div className="loading-spinner" />
                    </div>
                ) : !selectedNote ? (
                    <div className="notes-list">
                        {notes.sort((a, b) => 
                            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                        ).map(note => (
                            <div key={note.id} className="note-item">
                                <div className="note-content" onClick={() => {
                                    const content = note.content.length > 0 
                                        ? note.content 
                                        : [{ id: '1', text: '', checked: false }];
                                    setSelectedNote(note);
                                    setDraftNote(content);
                                    setTitle(note.title);
                                    setTimeout(() => focusTextarea(0), 0);
                                }}>
                                    <h4>{note.title || 'Без названия'}</h4>
                                    <p>{note.content[0]?.text.substring(0, 50)}...</p>
                                    <div className="note-date">
                                        {format(new Date(note.updatedAt), 'dd MMM yyyy, HH:mm', { locale: ru })}
                                    </div>
                                </div>
                                <div className="note-menu">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowMenu(note.id);
                                        }}
                                        disabled={isLoading}
                                    >
                                        <FiMoreVertical />
                                    </button>
                                    {showMenu === note.id && (
                                        <div className="context-menu">
                                            <button onClick={() => deleteNote(note.id)}>
                                                <FiTrash2 /> Удалить
                                            </button>
                                            <button>
                                                <FiShare2 /> Поделиться
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="note-editor-container">
                    {renderHistory()}
                    {renderShareDialog()}
                    <div className={`note-editor ${showHistory ? 'with-history' : ''}`}>
                        <div className="scroll-content">
                            {draftNote.map((item, index) => (
                                <div key={item.id} className="note-item-row">
                                    <div className="marker-container">
                                        {renderMarker(index)}
                                    </div>
                                    <textarea
                                        ref={el => {
                                            textareaRefs.current[index] = el;
                                        }}
                                        value={item.text.replace(/^(\d+\.\s|-?\s?)/, '')}
                                        onChange={e => handleTextChange(item.id, e.target.value, index)}
                                        onKeyDown={e => handleKeyDown(e, index)}
                                        placeholder={index === 0 ? "Начните вводить текст..." : ""}
                                        rows={1}
                                        style={{ height: 'auto' }}
                                        onFocus={() => setFocusedIndex(index)}
                                        disabled={isLoading}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};