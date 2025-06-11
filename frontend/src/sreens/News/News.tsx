import {useRef, useState, useEffect } from 'react';
import {
  FiPlus,
  FiCalendar,
  FiLink,
  FiImage,
  FiFilter,
  FiHeart,
  FiMoreVertical,
  FiX,
  FiTrash2,
  FiEdit,
  FiMapPin,
  FiChevronDown,
  FiClock,
  FiBookmark,
  FiChevronLeft,
  FiChevronRight,
  FiMessageCircle,
  FiSearch,
  FiGrid,
  FiList
} from 'react-icons/fi';
import { FaHeart } from "react-icons/fa6";
import { RiShareCircleFill } from "react-icons/ri";
import './News.scss';
import CreatePostModal from './СreatePostModal';
import EditPostModal from './EditPostModal';
import CalendarEventModal from './CalendarEventModal';
import DeletePostModal from './DeletePostModal';
import ImageCarousel from './ImageCarousel';
import Comments from './Comments';
import ShareButtons from './ShareButtons';
import { useNavigate } from 'react-router-dom';
import {Post, UserRole, ProfileProps, PostType,CurrentUser, ColorOption} from './types';
import Stories from './Stories';

export default function News({ setIsAuthenticated, setShowSessionAlert }: ProfileProps) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    id: '',
    role: '', 
    accountFIO: '',
    avatarURL: ''
  });
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // Состояния для избранного
  const [showFavorites, setShowFavorites] = useState(false);
  //это посты примеры (3 штуки для вида надо удалить) :
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [modals, setModals] = useState({
    create: false,
    calendar: false,
    edit: false,
    delete: false,
    contextMenu: false
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likeAnimation, setLikeAnimation] = useState<{ postId: string | null; visible: boolean }>({
    postId: null,
    visible: false,
  });
  const [lastTap, setLastTap] = useState(0);
  const [sharePostId, setSharePostId] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState('');
  const [shareAnchor, setShareAnchor] = useState<{x:number;y:number}|null>(null);

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<'date-desc' | 'date-asc' | 'likes-desc' | 'likes-asc'>('date-desc');

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
    if (!token) {
      throw new Error('Токен отсутствует');
    }
  
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  
    const response = await fetch(url, { ...options, headers });
  
    if (response.status === 401) {
      // Если сервер вернул 401, удаляем токен и перенаправляем на страницу входа
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setIsAuthenticated(false);
      if (setShowSessionAlert) {
        setShowSessionAlert(true); // Проверяем наличие функции перед вызовом
      }
      navigate('/login');
      throw new Error('Токен истек или недействителен');
    }
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Произошла ошибка');
    }
  
    return response;
  };

  const parseDate = (d: string) => {
    if (!d) return 0;
    const parts = d.split('.');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return new Date(`${year}-${month}-${day}`).getTime();
    }
    return new Date(d).getTime();
  };

  const filteredPosts = posts
    .filter(post => {
      if (showFavorites && !post.isFavorite) return false;
      if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortMode) {
        case 'date-asc':
          return parseDate(a.date) - parseDate(b.date);
        case 'date-desc':
          return parseDate(b.date) - parseDate(a.date);
        case 'likes-asc':
          return a.likes - b.likes;
        case 'likes-desc':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modals.contextMenu && !(e.target as Element).closest('.post-actions')) {
        setModals(prev => ({...prev, contextMenu: false}));
      }
      if (sharePostId && !(e.target as Element).closest('.share-pill') && !(e.target as Element).closest('.share-toggle')) {
        setSharePostId(null);
        setShareAnchor(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [modals.contextMenu, sharePostId]);

  useEffect(() => {
    return () => {
      previewImages.forEach(img => {
        if (img.startsWith('blob:')) {
          URL.revokeObjectURL(img);
        }
      });
    };
  }, [previewImages]);

  const fetchUserData = async () => {
    try {
      const response = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/api/user/profile`);
      const userData = await response.json();
      setCurrentUser({
        id: userData.id,
        role: userData.role,
        accountFIO: userData.accountFIO,
        avatarURL: userData.avatar
      });
    } catch (error) {
      console.error('Ошибка при загрузке данных пользователя:', error);
      navigate('/login');
    }
  };

  const fetchPostsData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/api/news/allNews`);
      const { formattedEvents } = await response.json();
    
      if (!formattedEvents || !Array.isArray(formattedEvents)) {
        console.log('Нет данных о новостях или неверный формат');
        return;
      }

      // Загружаем информацию о лайках для каждого поста
      const postsWithLikes = await Promise.all(
        formattedEvents.map(async (post) => {
          try {
            // Получаем количество лайков
            const likesResponse = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/api/news/likes/${post.id}/likes`);
            const likesData = await likesResponse.json();

            
            // Проверяем, лайкнул ли текущий пользователь пост
            let hasLiked = false;
            if (token) {
              const likeCheckResponse = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/api/news/likes/${post.id}/like/check`);
              const likeCheckData = await likeCheckResponse.json();
              hasLiked = likeCheckData.data.liked;
            }

            let eventDate, eventTime;
            if (post.dateEvent) {
              const dateObj = new Date(post.dateEvent);
              eventDate = dateObj.toISOString().split('T')[0];
              const hours = String(dateObj.getHours()).padStart(2, '0');
              const minutes = String(dateObj.getMinutes()).padStart(2, '0');
              eventTime = `${hours}:${minutes}`;
            }

            return {
              id: post.id,
              type: post.typeNews,
              title: post.title || '',
              author: post.createdBy,
              authorId: post.authorId || '',
              avatar: post.avatar,
              location: post.locationMap || '',
              images: post.images || [],
              text: post.description || '',
              date: post.createTime ? 
                new Date(post.createTime).toLocaleString('ru-RU', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  // hour: '2-digit',
                  // minute: '2-digit'
                }) : '',
              isFavorite: post.isFavorite,
              eventDate,
              eventTime,
              link: undefined,
              likes: likesData.data.likes,
              liked: hasLiked,
              expanded: false,
              showComments: false,
              commentsCount: 0,
              shareCount: post.shareCount || 0,
            };
          } catch (error) {
            console.error('Error fetching likes for post:', post.id, error);
          return {
            ...post,
            likes: 0,
            liked: false,
            showComments: false,
            commentsCount: 0,
            shareCount: 0,
          };
          }
        })
      );

      // Сортируем по дате
      // const sortedPosts = [...postsWithLikes].sort((a, b) => {
      //   const dateA = a.date ? new Date(a.date).getTime() : 0;
      //   const dateB = b.date ? new Date(b.date).getTime() : 0;
      //   return dateB - dateA;
      // });

      setPosts(postsWithLikes);
    } catch (error) {
      console.error('Ошибка при загрузке новостей:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchUserData(), fetchPostsData()]);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [navigate]);

//штука для сброса состояния при создании нового поста
const resetCurrentPost = () => {
  setCurrentPost({
    type: 'news',
    likes: 0,
    liked: false,
    expanded: false,
    author: currentUser.accountFIO,
    authorId: currentUser.id,
    avatar: '',
    date: new Date().toISOString(),
    location: '',
    locationLink: '',
    images: [],
    title: '',
    text: '',
    eventDate: '',
    eventTime: '',
    link: '',
    showComments: false,
    commentsCount: 0,
    shareCount: 0
  });
  setPreviewImages([]);
};

  const [currentPost, setCurrentPost] = useState<Partial<Post>>({
    type: 'news',
    likes: 0,
    liked: false,
    expanded: false,
    author: currentUser.accountFIO,
    authorId: currentUser.id,
    avatar: '',
    date: new Date().toISOString(),
    location: '',
    images: [],
    showComments: false,
    commentsCount: 0,
    shareCount: 0
  });

  const [calendarEvent, setCalendarEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    color: '#ff6b6b' as ColorOption
  });

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const handleLike = async (postId: string, isDoubleTap = false) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        alert('Для оценки постов необходимо авторизоваться');
        navigate('/login');
        return;
      }

      // Находим текущий пост для получения актуального количества лайков
      const currentPost = posts.find(p => p.id === postId);
      if (!currentPost) return;

      if (isDoubleTap) {
        setLikeAnimation({ postId, visible: true });
        setTimeout(() => setLikeAnimation({ postId: null, visible: false }), 1000);
        
        // Если лайк уже стоит - ничего не делаем
        if (currentPost.liked) return;
      }

      // Определяем новое состояние лайка
      const newLikedState = !currentPost.liked;
      const likesDelta = newLikedState ? 1 : -1;
      const newLikesCount = currentPost.likes + likesDelta;

      // Оптимистичное обновление UI
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: newLikesCount,
            liked: newLikedState
          };
        }
        return post;
      }));

      // Показываем анимацию только для двойного клика
      if (isDoubleTap) {
        setLikeAnimation({ postId, visible: true });
        setTimeout(() => setLikeAnimation({ postId: null, visible: false }), 1000);
      }
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/news/likes/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        // Откатываем изменения, если запрос не удался
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes: currentPost.likes,
              liked: currentPost.liked
            };
          }
          return post;
        }));
        throw new Error('Не удалось обновить лайк');
      }
  
      const result = await response.json();
      setPosts(posts.map(post => 
        post.id === postId ? { 
          ...post, 
          likes: Number(result.data?.likes) || newLikesCount,
          liked: result.data?.liked ?? newLikedState
        } : post
      ));
    } catch (error) {
      console.error('Ошибка при обновлении лайка:', error);
    }
  };

  //обработчик двойного тапа на мобилках
  const handleDoubleTap = (postId: string, e: React.TouchEvent) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    
    if (tapLength < 300 && tapLength > 0) {
      handleLike(postId, true);
      setLastTap(0);
    } else {
      setLastTap(currentTime);
    }
  };

  // Локальное открытие меню репоста
  const handleShare = (postId: string, btn: HTMLButtonElement) => {
    const link = `${window.location.origin}/news/public/${postId}`;
    const postEl = btn.closest('.post') as HTMLElement | null;
    if (postEl) {
      const postRect = postEl.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setShareAnchor({
        x: btnRect.left - postRect.left + btnRect.width / 2,
        y: btnRect.top - postRect.top
      });
    } else {
      setShareAnchor(null);
    }
    setShareLink(link);
    setSharePostId(postId);
  };

  const handleShared = (postId: string) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === postId ? { ...p, shareCount: p.shareCount + 1 } : p
      )
    );
    setSharePostId(null);
    setShareAnchor(null);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPost.title || !currentPost.text || !currentPost.location) {
      alert('Заполните обязательные поля!');
      return;
    }

    if (currentPost.type === 'event' && (!currentPost.eventDate || !currentPost.eventTime)) {
      alert('Для события укажите дату и время!');
      return;
    }

    if (currentPost.type === 'ad' && !currentPost.link) {
      alert('Для рекламы требуется ссылка!');
      return;
    }

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) throw new Error('Токен отсутствует');

      const formData = new FormData();

      formData.append('title', currentPost.title || '');
      formData.append('typeNews', currentPost.type || 'news');
      formData.append('locationMap', currentPost.location || '');
      formData.append('createdById', currentUser.id);
      formData.append('dateEvent', new Date(`${currentPost.eventDate}T${currentPost.eventTime}:00`).toISOString());
      formData.append('advertisingUrl', currentPost.link || '');
      formData.append('description', currentPost.text || '');

      // Добавляем файлы
      imageFiles.forEach((file, index) => {
        formData.append(`images`, file);
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/news/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Ошибка создания поста');
      }

      const createdPostData = await response.json();
      const createdPost = {
        id: createdPostData.primarykey,
        type: createdPostData.typeNews,
        title: createdPostData.title || '',
        author: currentUser.accountFIO,
        authorId: currentUser.id,
        avatar: currentUser.avatarURL,
        location: createdPostData.locationMap || '',
        images: createdPostData.images || [],
        text: createdPostData.description || '',
        date: new Date().toISOString().split('T')[0],
        isFavorite: false,
        eventDate: createdPostData.dateEvent ? new Date(createdPostData.dateEvent).toISOString().split('T')[0] : undefined,
        eventTime: createdPostData.dateEvent ? 
          `${String(new Date(createdPostData.dateEvent).getHours()).padStart(2, '0')}:${String(new Date(createdPostData.dateEvent).getMinutes()).padStart(2, '0')}` : '',
        link: createdPostData.advertisingUrl,
        likes: 0,
        liked: false,
        expanded: false,
        showComments: false,
        commentsCount: 0,
        shareCount: 0
      };

      setPosts(prev => [
        createdPost,
        ...prev
      ]);
      setModals({ ...modals, create: false });
      setPreviewImages([]);
      setImageFiles([]);
      resetCurrentPost();
    } catch (error) {
      console.error('Ошибка создания поста:', error);
      alert(error instanceof Error ? error.message : 'Ошибка создания поста');
    }
  };

  const handleDeletePost = async () => {
    if (selectedPostId) {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) throw new Error('Токен отсутствует');
  
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/news/delete/${selectedPostId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
        });
    
        if (!response.ok) {
          throw new Error('Failed to save event');
        }

        setPosts(prev => prev.filter(post => post.id !== selectedPostId));
        setModals({ ...modals, delete: false });

      } catch (error) {
        console.error('Ошибка при удалении поста', error);
      }
    }
  };

  const toggleFavorite = async (postId: string, isFavorite: boolean) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        alert('Для добавления в избранное необходимо авторизоваться');
        navigate('/login');
        return;
      }
  
      // Оптимистичное обновление UI
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, isFavorite: !isFavorite } 
          : post
      ));
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/news/updateFavorite/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isFavorite: !isFavorite
        }),
      });
  
      if (!response.ok) {
        // Откатываем изменения, если запрос не удался
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, isFavorite } 
            : post
        ));
        throw new Error('Не удалось обновить избранное');
      }
  
    } catch (error) {
      console.error('Ошибка при обновлении избранного:', error);
    }
  };

  const handleEditPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) throw new Error('Токен отсутствует');

      const appendTextField = (fieldName: string, value: string | undefined) => {
        if (value && value.length > 100000) { // ~100KB limit
          throw new Error(`Поле ${fieldName} слишком большое`);
        }
        if (value) formData.append(fieldName, value);
      };

      const formData = new FormData();
      formData.append('title', currentPost.title || '');
      formData.append('typeNews', currentPost.type || 'news');
      formData.append('locationMap', currentPost.location || '');
      formData.append('dateEvent', new Date(`${currentPost.eventDate}T${currentPost.eventTime}:00`).toISOString());
      formData.append('advertisingUrl', currentPost.link || '');
      formData.append('description', currentPost.text || '');
  
      // Добавляем новые файлы
      imageFiles.forEach(file => {
        formData.append('newImages', file);
      });

      const remainingImages = previewImages
      .filter(img => typeof img === 'string' && !img.startsWith('data:'))
      .map(img => img as string);
      
      remainingImages.forEach(img => {
        formData.append('remainingImages', img);
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/news/update/${currentPost.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      const updatedPostData = await response.json();
      const updatedPost = {
        id: updatedPostData.primarykey,
        type: updatedPostData.typeNews,
        title: updatedPostData.title || '',
        author: updatedPostData.createdBy?.accountFIO || currentUser.accountFIO,
        authorId: updatedPostData.createdById || currentUser.id,
        avatar: updatedPostData.createdBy?.avatarUrl || currentUser.avatarURL,
        location: updatedPostData.locationMap || '',
        images: updatedPostData.images || [],
        text: updatedPostData.description || '',
        date: updatedPostData.createTime ? new Date(updatedPostData.createTime).toISOString().split('T')[0] : '',
        isFavorite: updatedPostData.isFavorite || false,
        eventDate: updatedPostData.dateEvent ? new Date(updatedPostData.dateEvent).toISOString().split('T')[0] : '',
        eventTime: updatedPostData.dateEvent ? 
          `${String(new Date(updatedPostData.dateEvent).getHours()).padStart(2, '0')}:${String(new Date(updatedPostData.dateEvent).getMinutes()).padStart(2, '0')}` : '',
        link: updatedPostData.advertisingUrl,
        likes: updatedPostData.likesCount || 0,
        liked: updatedPostData.liked || false,
        expanded: false,
        showComments: false,
        commentsCount: 0,
        shareCount: updatedPostData.shareCount || 0
      };
  
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === currentPost.id ? updatedPost : post
        )
      );
      
      setIsEditModalOpen(false);
      setPreviewImages([]);
      setImageFiles([]);
    } catch (error) {
      console.error("Ошибка при обновлении поста", error);
      alert(error instanceof Error ? error.message : "Ошибка обновления");
    }
  };

  const toggleTextExpansion = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? {...post, expanded: !post.expanded} : post
    ));
  };

  const toggleComments = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId 
          ? { ...post, showComments: !post.showComments } 
          : post
      )
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    if (files.length + previewImages.length > 10) {
      alert('Можно загрузить только 10 фотографий');
      return;
    }

    const newFiles = files.slice(0, 10 - previewImages.length);
    setImageFiles(prev => [...prev, ...files.slice(0, 10 - previewImages.length)]);
    
    // Используем Promise.all для параллельной обработки
    Promise.all(newFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    })).then(previews => {
      setPreviewImages(prev => [...prev, ...previews]);
      // console.log('Preview images size:', 
      //   previews.reduce((sum, img) => sum + img.length, 0) / 1024, 'KB');
    });
  };

  // Функция удаления изображения
  const removeImage = (index: number) => {
    // Если это существующее изображение (URL), добавляем его в список для удаления
    if (typeof previewImages[index] === 'string') {
      setImagesToDelete(prev => [...prev, previewImages[index] as string]);
    }
    
    // Удаляем из preview
    setPreviewImages(prev => prev.filter((_, i) => i !== index));

    // Удаление из imageFiles
    setImageFiles(prev => {
      const newFiles = [...prev];
      const fileIndex = index - (previewImages.length - prev.length);
      if (fileIndex >= 0 && fileIndex < prev.length) {
        newFiles.splice(fileIndex, 1);
      }
      return newFiles;
    });
    
    // Если это новый файл, удаляем его из imageFiles
    if (index >= previewImages.length - imageFiles.length) {
      const fileIndex = index - (previewImages.length - imageFiles.length);
      setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }
  };

  const openCalendarModal = (post: Post) => {
    setCalendarEvent({
      title: post.title,
      date: post.eventDate || '',
      time: post.eventTime || '',
      location: post.location,
      description: post.text,
      color: '#ff6b6b'
    });
    setModals({ ...modals, calendar: true });
  };

  const canEditPost = (post: Post) => {
    return currentUser.role === 'admin' || 
      (currentUser.role === 'super' && post.authorId === currentUser.id);
  };

  const canDeletePost = (post: Post) => canEditPost(post);

  const canCreatePostType = (type: PostType) => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'super' && type !== 'ad') return true;
    return false;
  };

  const handleLocationClick = (location: string, link?: string) => {
    if (link) {
      window.open(link, '_blank');
    } else {
      navigate(`/maps?location=${encodeURIComponent(location)}`);
    }
  };

  const renderTextContent = (text: string, expanded: boolean, post: Post) => {
    const maxChars = 200;
    if (!expanded && text.length > maxChars) {
      return (
        <>
          {text.slice(0, maxChars)}...
          <button 
            className="expand-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleTextExpansion(post.id);
            }}
          >
            Показать полностью
          </button>
        </>
      );
    }
    return text;
  };

  return (
    
    <div className="news-container">
      <div className="news-header">
        <h1>{showFavorites ? 'Избранное' : 'Новости'}</h1>
        
        <div className="header-controls">
          <button 
            className={`favorites-toggle ${showFavorites ? 'active' : ''}`}
            onClick={() => setShowFavorites(!showFavorites)}
          >
            <FiBookmark className="control-icon" />
          </button>

          {(currentUser.role === 'super' || currentUser.role === 'admin') && (
            <button 
              className="floating-add-btn"
              onClick={() => {
                  resetCurrentPost();
                  setModals({ ...modals, create: true });
                }}
              >
              <FiPlus size={24} />
            </button>
          )}
        </div>
      </div>

      {showFavorites && (
        <div className="filter-bar">
          <div className="search-input">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-btn" onClick={() => setSearchQuery('')}>
                <FiX />
              </button>
            )}
          </div>
          
          <div className="filter-dropdown">
            <button className="filter-toggle">
              <FiFilter />
            </button>
            <div className="filter-menu">
              <button 
                className={`filter-option ${sortMode === 'date-desc' ? 'active' : ''}`}
                onClick={() => setSortMode('date-desc')}
              >
                Новые сначала
              </button>
              <button 
                className={`filter-option ${sortMode === 'date-asc' ? 'active' : ''}`}
                onClick={() => setSortMode('date-asc')}
              >
                Старые сначала
              </button>
              <button 
                className={`filter-option ${sortMode === 'likes-desc' ? 'active' : ''}`}
                onClick={() => setSortMode('likes-desc')}
              >
                Популярные
              </button>
              <button 
                className={`filter-option ${sortMode === 'likes-asc' ? 'active' : ''}`}
                onClick={() => setSortMode('likes-asc')}
              >
                Менее популярные
              </button>
            </div>
          </div>
          
          <button
            className="view-toggle"
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          >
            {viewMode === 'list' ? <FiGrid /> : <FiList />}
          </button>
        </div>
      )}

      {!showFavorites && (
        <Stories currentUser={currentUser} isLoading={isLoading} />
      )}

      <div className={`posts-list ${viewMode}`}>
        {isLoading ? (
          [...Array(3)].map((_, idx) => (
            <div key={idx} className="post-skeleton">
              <div className="skeleton-header"></div>
              <div className="skeleton-image"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-footer"></div>
            </div>
          ))
        ) : (
          filteredPosts.map((post, index) => (
            <div 
              key={post.id} 
              className={`post post-${post.type}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onDoubleClick={() => handleLike(post.id, true)}
              onTouchStart={(e) => handleDoubleTap(post.id, e)}
            >
            <div className="post-header">
              <div className="author-info">
                <img src={post.avatar} alt="avatar" className="avatar" />
                <div>
                  <h3>{post.author}</h3>
                  <a 
                    onClick={() => handleLocationClick(post.location, post.locationLink)}
                    className="location-link"
                  >
                    <FiMapPin /> {post.location}
                  </a>
                </div>
              </div>

              <div className="post-actions-right">
                <button 
                  className={`favorite-button ${post.isFavorite ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(post.id, post.isFavorite);
                  }}
                >
                  <FiBookmark className="bookmark-icon" />
                </button>

              {(canEditPost(post) || canDeletePost(post)) && (
                <div className="post-actions">
                  <FiMoreVertical 
                    onClick={() => {
                      setSelectedPostId(post.id);
                      setModals({ ...modals, contextMenu: true });
                    }} 
                  />
                  
                  {modals.contextMenu && selectedPostId === post.id && (
                    <div className="context-menu">
                      {canEditPost(post) && (
                        <button onClick={() => {
                          setCurrentPost({
                            ...post,
                            images: post.images || [],
                            type: post.type as PostType
                          });
                          setPreviewImages([...post.images]); 
                          setIsEditModalOpen(true);
                          setModals(prev => ({
                            ...prev, 
                            contextMenu: false,
                            edit: true
                          }));
                        }}>
                          <FiEdit /> Редактировать
                        </button>
                      )}
                      
                      {canDeletePost(post) && (
                        <button 
                          onClick={() => {
                            setModals({ ...modals, delete: true, contextMenu: false });
                          }}
                        >
                          <FiTrash2 /> Удалить
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            </div>

            <h4 className="post-title">{post.title}</h4>

            {post.images?.length > 0 && (
              <div className="image-container">
                <ImageCarousel 
                  images={post.images}
                  postId={post.id}
                  initialIndex={post.carouselIndex || 0}
                />
                {likeAnimation.postId === post.id && likeAnimation.visible && (
                  <div className="double-tap-heart">
                    <FaHeart />
                  </div>
                )}
              </div>
            )}

              <div className="post-content">
                <div className={`post-text ${post.expanded ? 'expanded' : ''}`}>
                  {post.text?.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                {post.text?.length > 200 && (
                  <div className="expand-btn-container">
                    <button
                      className="expand-btn"
                      onClick={() => toggleTextExpansion(post.id)} 
                    >
                      {post.expanded ? 'Свернуть' : 'Показать полностью'}
                    </button>
                  </div>
                )}

              {post.type === 'event' && (
                <div className="event-details">
                  <div className="event-time">
                    <FiClock /> {post.eventDate} {post.eventTime}
                  </div>
                  <button
                    className="calendar-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openCalendarModal(post);
                    }}
                  >
                    <FiCalendar /> Добавить в календарь
                  </button>
                </div>
              )}
            </div>

            <div className="post-footer">
            <div className="interaction-buttons">
              <button 
                className={`like-btn ${post.liked ? 'liked' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(post.id);
                }}
                aria-label={post.liked ? 'Убрать лайк' : 'Поставить лайк'}
              >
                <FiHeart className="like-icon" />
                <span className="like-count">{post.likes}</span>
              </button>

              <button
                  className={`comment-toggle ${post.showComments ? 'active' : ''}`}
                  onClick={() => toggleComments(post.id)}
                >
                  <FiMessageCircle />
                  <span className="comment-count">{post.commentsCount}</span>
                </button>
                     {/* кнопка репоста */}
              <button
                  className='share-toggle'
                  onClick={(e) => handleShare(post.id, e.currentTarget)}
                >
                  <RiShareCircleFill    />
                  <span className="share-count">{post.shareCount}</span>
                </button>

              </div>

              <span className="post-date">
                {post.date}
              </span>
            </div>

            {sharePostId === post.id && shareAnchor && (
              <ShareButtons
                url={shareLink}
                anchor={shareAnchor}
                onShared={() => handleShared(post.id)}
              />
            )}

            {post.showComments && (
              <Comments
                postId={post.id}
                currentUser={currentUser}
                onCountChange={(count) => {
                  setPosts(prev => prev.map(p => p.id === post.id ? { ...p, commentsCount: count } : p));
                }}
              />
            )}
          </div>
          ))
        )}
      </div>
      
      {modals.create && (
        <CreatePostModal
          currentPost={currentPost}
          setCurrentPost={setCurrentPost}
          isOpen={modals.create}
          onClose={() => setModals({ ...modals, create: false })}
          onSubmit={handleCreatePost}
          onImageUpload={handleImageUpload}
          userRole={currentUser.role as UserRole}
          previewImages={previewImages}
          setPreviewImages={setPreviewImages}
          removeImage={removeImage}
          setImageFiles={setImageFiles}
        />
      )}

      {isEditModalOpen && (
        <EditPostModal
          currentPost={currentPost}
          setCurrentPost={setCurrentPost}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setPreviewImages([]);
            setImageFiles([]);
            setImagesToDelete([]);
          }}
          onSubmit={handleEditPost}
          onImageUpload={handleImageUpload}
          userRole={currentUser.role as UserRole}
          previewImages={previewImages}
          setPreviewImages={setPreviewImages}
          removeImage={removeImage}
          setImageFiles={setImageFiles}
        />
      )}

      {modals.calendar && (
        <CalendarEventModal 
          eventData={calendarEvent}
          onColorChange={(color) => setCalendarEvent(prev => ({...prev, color}))}
          onClose={() => setModals({ ...modals, calendar: false })}
          onSubmit={(e) => {
            e.preventDefault();
            // Здесь надо добавить логику сохранения в календарь
            setModals({ ...modals, calendar: false });
          }}
        />
      )}

      {modals.delete && (
        <DeletePostModal
          isOpen={modals.delete}
          onClose={() => setModals({ ...modals, delete: false })}
          onConfirm={handleDeletePost}
        />
      )}
    </div>
  );
}