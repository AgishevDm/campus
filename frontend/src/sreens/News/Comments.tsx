import { useState, useEffect, useRef, useCallback } from 'react';
import { FiMoreVertical, FiSend, FiEdit, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { CurrentUser, Comment, CommentsProps } from './types';

const MAX_TEXT_LENGTH = 1000;
const DEFAULT_MAX_HEIGHT = 120;

export default function Comments({ postId, currentUser, onCountChange }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const commentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const normalizeText = useCallback((text: string) => {
    return text
      .replace(/\n{3,}/g, '\n\n')
      .replace(/(\n\s*)+$/, '')
      .trim();
  }, []);

  const adjustTextareaHeight = useCallback((element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 200)}px`;
  }, []);

  const resetTextareaHeight = useCallback((element: HTMLTextAreaElement) => {
    element.style.height = '44px';
  }, []);

  const checkCommentHeight = useCallback((commentId: string) => {
    const element = commentRefs.current[commentId];
    return element ? element.scrollHeight > DEFAULT_MAX_HEIGHT : false;
  }, []);

  // Загрузка комментариев с проверкой высоты
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments/${postId}`);
        const data = await response.json();
        const normalizedComments = data.map((comment: Comment) => ({
          ...comment,
          text: normalizeText(comment.text),
          expanded: false
        }));
        
        // Проверка высоты после загрузки
        const checkedComments = normalizedComments.map((comment: Comment) => ({
          ...comment,
          expanded: checkCommentHeight(comment.id) ? false : true
        }));
        
        setComments(checkedComments);
        onCountChange?.(checkedComments.length);
      } catch (error) {
        console.error('Error loading comments:', error);
      }
    };
    fetchComments();
  }, [postId, normalizeText, checkCommentHeight]);

  // Закрытие меню при клике вне области
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Обработчик отправки нового комментария
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const button = e.currentTarget.querySelector('.submit-button');
    
    if (button) {
        button.classList.add('sending');
        
        // Сбрасываем анимацию после завершения
        button.addEventListener('animationend', () => {
        button.classList.remove('sending');
        }, {once: true});
    }
    const trimmedText = normalizeText(newComment.slice(0, MAX_TEXT_LENGTH));
    if (!trimmedText) return;

    const newCommentData: Comment = {
      id: Date.now().toString(),
      authorId: currentUser.id,
      authorName: currentUser.accountFIO,
      authorLogin: currentUser.accountFIO,
      text: trimmedText,
      date: new Date().toLocaleString(),
      avatar: currentUser.avatarURL,
      expanded: false
    };

    setComments(prev => {
      const updated = [newCommentData, ...prev];
      onCountChange?.(updated.length);
      return updated;
    });
    setNewComment('');
    if (textareaRef.current) resetTextareaHeight(textareaRef.current);
    setEditingCommentId(null); // Закрываем редактирование при новом комментарии
  };

  // Редактирование комментария
  const handleEdit = () => {
    const trimmedText = normalizeText(editText.slice(0, MAX_TEXT_LENGTH));
    if (!trimmedText || !editingCommentId) return;

    setComments(prev =>
      prev.map(comment =>
        comment.id === editingCommentId ? { ...comment, text: trimmedText } : comment
      )
    );
    setEditingCommentId(null);
    setEditText('');
  };

  // Удаление комментария
  const handleDelete = (commentId: string) => {
    setComments(prev => {
      const updated = prev.filter(comment => comment.id !== commentId);
      onCountChange?.(updated.length);
      return updated;
    });
    setMenuOpenId(null);
  };

  // Переключение расширения текста
  const toggleCommentExpansion = (commentId: string) => {
    setComments(prev => 
      prev.map(comment => {
        if (comment.id === commentId) {
          const element = commentRefs.current[commentId];
          if (element) {
            const isExpanding = !comment.expanded;
            
            // Рассчитываем целевую высоту
            const targetHeight = isExpanding 
              ? `${Math.min(element.scrollHeight, window.innerHeight * 0.8)}px`
              : "6em";
  
            // Принудительно задаем высоту перед анимацией
            element.style.maxHeight = isExpanding 
              ? "6em" 
              : `${element.scrollHeight}px`;
  
            // Запускаем анимацию в следующем фрейме
            requestAnimationFrame(() => {
              element.style.maxHeight = targetHeight;
              
              // Сброс после анимации
              element.ontransitionend = () => {
                if (!isExpanding) {
                  element.style.maxHeight = "6em";
                } else {
                  element.style.maxHeight = "none";
                }
                element.ontransitionend = null;
              };
            });
          }
          return { ...comment, expanded: !comment.expanded };
        }
        return comment;
      })
    );
  };

  // Обработчик вставки текста
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text/plain').slice(0, MAX_TEXT_LENGTH);
    const target = e.currentTarget as HTMLTextAreaElement;
    
    const start = target.selectionStart || 0;
    const end = target.selectionEnd || 0;
    const newText = newComment.slice(0, start) + pastedText + newComment.slice(end);
    setNewComment(newText.slice(0, MAX_TEXT_LENGTH));
  };

  return (
    <div className="comments-section">
      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment.id} className="comment">
            <div className="comment-content">
              <div className="comment-header">
                <img src={comment.avatar} alt="avatar" className="comment-avatar" />
                <div className="comment-author-info">
                  <div className="comment-author">
                    <h4>{comment.authorName}</h4>
                    <span className="comment-login">@{comment.authorLogin}</span>
                  </div>
                </div>

                {currentUser.id === comment.authorId && (
                  <div className="comment-menu" ref={menuRef}>
                    <FiMoreVertical
                      size={20}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(prev => prev === comment.id ? null : comment.id);
                        setEditingCommentId(null); // Закрываем редактирование при открытии меню
                      }}
                    />
                    
                    {menuOpenId === comment.id && (
                      <div className="context-menu">
                        <button onClick={() => {
                          setEditText(comment.text);
                          setEditingCommentId(comment.id);
                          setMenuOpenId(null);
                        }}>
                          <FiEdit size={18} /> Изменить
                        </button>
                        <button onClick={() => handleDelete(comment.id)}>
                          <FiTrash2 size={18} /> Удалить
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {editingCommentId === comment.id ? (
                <div className="edit-comment">
                  <textarea
                    value={editText}
                    onChange={(e) => {
                      setEditText(e.target.value.slice(0, MAX_TEXT_LENGTH));
                      adjustTextareaHeight(e.target);
                    }}
                    rows={1}
                    autoFocus
                    onPaste={handlePaste}
                  />
                  <div className="edit-controls">
                    <span className={`char-counter ${editText.length >= 450 ? 'warning' : ''}`}>
                      {editText.length}/{MAX_TEXT_LENGTH}
                    </span>
                    <button 
                      className="save-edit"
                      onClick={handleEdit}
                    >
                      <FiSend size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    ref={el => { commentRefs.current[comment.id] = el; }}
                    className={`comment-text ${comment.expanded ? 'expanded' : ''}`}
                  >
                    {comment.text}
                  </div>
                  <div className="comment-footer">
                    <div className="footer-controls">
                      {checkCommentHeight(comment.id) && (
                        <button
                          className="toggle-expansion"
                          onClick={() => toggleCommentExpansion(comment.id)}
                        >
                          {comment.expanded ? <FiChevronUp /> : <FiChevronDown />}
                          {comment.expanded ? 'Свернуть' : 'Показать полностью'}
                        </button>
                      )}
                      <span className="comment-date">{comment.date}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="comment-input-section">
        <form className="comment-form" onSubmit={handleSubmit}>
          <div className="form-container">
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value.slice(0, MAX_TEXT_LENGTH));
                adjustTextareaHeight(e.target);
              }}
              onPaste={handlePaste}
              onFocus={() => setEditingCommentId(null)}
              placeholder="Напишите комментарий..."
              rows={1}
              className="comment-textarea"
            />
            <div className="form-controls">
              <span className={`char-counter ${newComment.length >= 450 ? 'warning' : ''}`}>
                {newComment.length}/{MAX_TEXT_LENGTH}
              </span>
              <button 
                type="submit" 
                disabled={!newComment.trim()} 
                className="submit-button"
                >
                <span className="icon-wrapper">
                    <FiSend size={24} />
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}