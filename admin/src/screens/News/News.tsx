import { useState, useRef, useEffect } from 'react';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiEye, FiMoreVertical, FiX, FiCalendar, FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './News.scss';

type PostType = 'news' | 'event' | 'ad';
type PostStatus = 'draft' | 'published';

interface NewsPost {
  id: string;
  author: string;
  location: string;
  content: string;
  photos: string[];
  postType: PostType;
  eventDate?: Date;
  createdAt: Date;
  status: PostStatus;
  likes: number; 
}

export default function News() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<PostType | 'all'>('all');
  const [modalOpen, setModalOpen] = useState<'create' | 'view' | 'edit' | null>(null);
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const [formData, setFormData] = useState<Partial<NewsPost>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showContextMenuId, setShowContextMenuId] = useState<string | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 20;

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || post.postType === filterType;
    return matchesSearch && matchesType;
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const result = event.target?.result;
        if (result) {
          setFormData(prev => ({
            ...prev,
            photos: [...(prev.photos || []), result as string]
          }));
        }
      };
  
      Array.from(files).forEach(file => reader.readAsDataURL(file));
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Node;
    if (contextMenuRef.current && target && !contextMenuRef.current.contains(target)) {
      setShowContextMenuId(null);
    }
  };

  const handleSavePost = () => {
    if (!formData.author || !formData.content) return;

    const newPost: NewsPost = {
      id: Date.now().toString(),
      author: formData.author,
      location: formData.location || '',
      content: formData.content,
      photos: formData.photos || [],
      postType: formData.postType || 'news',
      eventDate: formData.postType === 'event' ? formData.eventDate : undefined,
      createdAt: new Date(),
      status: 'published',
      likes: 0 
    };

    if (modalOpen === 'edit' && selectedPost) {
      setPosts(prev => prev.map(p => p.id === selectedPost.id ? { ...p, ...formData } : p));
    } else {
      setPosts(prev => [newPost, ...prev]);
    }

    setModalOpen(null);
    setFormData({});
  };

  const handleDeletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    setShowContextMenuId(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="admin-page">
      <h1 className="page-header">Управление новостями</h1>
      <div className="content-box">
        <div className="news-management">
          <div className="header">
            <div className="controls">
              <div className="search-filter">
                <input
                  type="text"
                  placeholder="Поиск по новостям..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as PostType | 'all')}
                >
                  <option value="all">Все типы</option>
                  <option value="news">Новости</option>
                  <option value="event">События</option>
                  <option value="ad">Реклама</option>
                </select>
              </div>
              <button
                className="add-news-btn"
                onClick={() => {
                  setModalOpen('create');
                  setFormData({});
                }}
              >
                <FiPlus /> Создать пост
              </button>
            </div>
          </div>

          <div className="news-table">
            <div className="table-header">
              <span>№</span>
              <span>Автор</span>
              <span>Фото</span>
              <span>Текст</span>
              <span>Тип</span>
              <span>Дата публикации</span>
              <span>Статистика</span>
            </div>

            {currentPosts.map((post, index) => (
              <div key={post.id} className="table-row">
                <span>{indexOfFirstPost + index + 1}</span>
                <span>{post.author}</span>
                <div>
                  {post.photos[0] && (
                    <img src={post.photos[0]} alt="Превью" className="photo-preview" />
                  )}
                </div>
                <div className="text-preview">{post.content}</div>
                <span>{{
                  news: 'Новость',
                  event: 'Событие',
                  ad: 'Реклама'
                }[post.postType]}</span>
                <span>{post.createdAt.toLocaleDateString()}</span>
                <span>{post.likes} лайков</span>
                <div className="actions">
                  <FiMoreVertical onClick={() => setShowContextMenuId(post.id)} />
                  {showContextMenuId === post.id && (
                    <div className="context-menu" ref={contextMenuRef}>
                      <button onClick={() => {
                        setSelectedPost(post);
                        setModalOpen('view');
                        setShowContextMenuId(null);
                      }}>
                        <FiEye /> Просмотр
                      </button>
                      <button onClick={() => {
                        setFormData(post);
                        setSelectedPost(post);
                        setModalOpen('edit');
                        setShowContextMenuId(null);
                      }}>
                        <FiEdit /> Редактировать
                      </button>
                      <button onClick={() => handleDeletePost(post.id)}>
                        <FiTrash2 /> Удалить
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FiChevronLeft />
            </button>
            <span>Страница {currentPage} из {totalPages}</span>
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal news-modal">
            <button className="close-btn" onClick={() => setModalOpen(null)}>
              <FiX />
            </button>
            <h3>
              {modalOpen === 'create' ? 'Новый пост' : 
               modalOpen === 'view' ? 'Просмотр поста' : 'Редактирование поста'}
            </h3>

            <div className="form-content">
              <div className="form-group full-width">
                <label>Автор *</label>
                <input
                  value={formData.author || ''}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  disabled={modalOpen === 'view'}
                />
              </div>

              <div className="form-group">
                <label>Локация</label>
                <input
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  disabled={modalOpen === 'view'}
                />
              </div>

              <div className="form-group">
                <label>Тип поста *</label>
                <select
                  value={formData.postType || 'news'}
                  onChange={(e) => setFormData({ ...formData, postType: e.target.value as PostType })}
                  disabled={modalOpen === 'view'}
                >
                  <option value="news">Новость</option>
                  <option value="event">Событие</option>
                  <option value="ad">Реклама</option>
                </select>
              </div>

              {formData.postType === 'event' && (
                <div className="form-group date-time-inputs">
                  <div>
                    <label>Дата события</label>
                    <input
                      type="date"
                      value={formData.eventDate?.toISOString().split('T')[0] || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        eventDate: new Date(e.target.value) 
                      })}
                      disabled={modalOpen === 'view'}
                    />
                  </div>
                  <div>
                    <label>Время события</label>
                    <input
                      type="time"
                      value={formData.eventDate?.toTimeString().substring(0,5) || ''}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':');
                        const newDate = new Date(formData.eventDate || new Date());
                        newDate.setHours(parseInt(hours), parseInt(minutes));
                        setFormData({ ...formData, eventDate: newDate });
                      }}
                      disabled={modalOpen === 'view'}
                    />
                  </div>
                </div>
              )}

              <div className="form-group full-width">
                <label>Текст поста *</label>
                {modalOpen === 'view' ? (
                  <div className="full-text-content">
                    {selectedPost?.content}
                  </div>
                ) : (
                  <textarea
                    value={formData.content || ''}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={5}
                  />
                )}
              </div>

              <div className="form-group full-width">
                <label>Фотографии</label>
                <div className={`photo-upload ${modalOpen === 'view' ? 'view-mode' : ''}`}>
                  {modalOpen === 'view' ? (
                    <div className="full-size-gallery">
                      {selectedPost?.photos?.map((photo, index) => (
                        <img 
                          key={index} 
                          src={photo} 
                          alt={`Фото ${index + 1}`} 
                          className="full-size-image"
                        />
                      ))}
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        style={{ display: 'none' }}
                      />
                      <button 
                        className="add-photo-btn" 
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <FiPlus /> Загрузить фото
                      </button>
                      <div className="photo-preview">
                        {formData.photos?.map((photo, index) => (
                          <img 
                            key={index} 
                            src={photo} 
                            alt={`Upload ${index + 1}`} 
                            className="preview-image"
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {modalOpen !== 'view' && (
                <div className="modal-footer">
                  <button 
                    className="submit-btn" 
                    onClick={handleSavePost}
                    disabled={!formData.author || !formData.content}
                  >
                    {modalOpen === 'create' ? 'Опубликовать' : 'Сохранить изменения'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}