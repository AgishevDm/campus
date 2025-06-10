import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSettings,
  FiEdit,
  FiMail,
  FiHelpCircle,
  FiLogOut,
  FiBook,
  FiCalendar,
  FiUser,
  FiX,
  FiPaperclip,
  FiSmile,
  FiEye,
  FiEyeOff,
  FiFileText,
  FiAward,
  FiMapPin,
  FiBookOpen,
  FiLayers,
  FiBriefcase
} from 'react-icons/fi';
import { FaBrush } from "react-icons/fa6";
import { animate, hover, AnimationPlaybackControls } from 'motion'; 
import { splitText } from 'motion-plus';
import { useMotionValue } from 'motion/react';
import './Profile.scss';
import PersonalizationModal from './PersonalizationModal';
import { jwtDecode } from 'jwt-decode';
import { Faculties } from '../../enum/keys/faculties';

type UserStatus = 'student' | 'teacher' | 'guest';

const degrees = ['Бакалавр', 'Магистр', 'Аспирант'];
const positions = ['Профессор', 'Доцент', 'Старший преподаватель', 'Ассистент'];
const courses = Array.from({length: 5}, (_, i) => `${i + 1}`);

type ProfileProps = {
  setIsAuthenticated: (value: boolean) => void;
  setShowSessionAlert?: (value: boolean) => void;
};

const AnimatedName = ({ name }: { name: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const velocityX = useMotionValue(0);
  const velocityY = useMotionValue(0);
  const prevEvent = useRef(0);
  const animationRefs = useRef<AnimationPlaybackControls[]>([]);

  useEffect(() => {
    if (!containerRef.current || !name) return;

    const { chars } = splitText(containerRef.current.querySelector("h1")!);

    const handlePointerMove = (event: PointerEvent) => {
      const now = performance.now();
      const timeSinceLastEvent = (now - prevEvent.current) / 1000;
      prevEvent.current = now;
      velocityX.set(event.movementX / timeSinceLastEvent);
      velocityY.set(event.movementY / timeSinceLastEvent);
    };

    document.addEventListener("pointermove", handlePointerMove);

    // Функция для анимации с правильным синтаксисом трансформации
    const animateTransform = (
      element: Element,
      x: number,
      y: number,
      options = {}
    ) => {
      return animate(
        element,
        { transform: `translate(${x}px, ${y}px)` },
        options
      );
    };

    const unsubscribe = hover(chars, (element) => {
      const speed = Math.sqrt(velocityX.get() ** 2 + velocityY.get() ** 2);
      const angle = Math.atan2(velocityY.get(), velocityX.get());
      const distance = Math.min(speed * 0.1, 100);

      const anim = animateTransform(
        element,
        Math.cos(angle) * distance,
        Math.sin(angle) * distance,
        { type: "spring", stiffness: 200, damping: 15 }
      );
      animationRefs.current.push(anim);
    });

    // Таймер для возврата букв
    const returnTimer = setInterval(() => {
      chars.forEach((char, index) => {
        setTimeout(() => {
          const anim = animateTransform(char, 0, 0, { 
            duration: 0.8, 
            easing: "ease-out" 
          });
          animationRefs.current.push(anim);
        }, index * 50);
      });
    }, 5000);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      unsubscribe();
      clearInterval(returnTimer);
      animationRefs.current.forEach(anim => anim.stop());
    };
  }, [name]);

  return (
    <div ref={containerRef} className="animated-name-container">
      <h1 className="full-name">{name}</h1>
    </div>
  );
};

const MenuItem = ({ 
  icon: Icon, 
  text, 
  onClick 
}: { 
  icon: React.ElementType,
  text: string,
  onClick: () => void
}) => (
  <button className="menu-item" onClick={onClick}>
    <Icon className="menu-icon" />
    <span>{text}</span>
  </button>
);

export default function ProfilePage({ setIsAuthenticated, setShowSessionAlert }: ProfileProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    status: '',
    accountFIO: '',
    faculty: '', 
    degree: '', 
    department: '',
    position: '', 
    course: '',    
    direction: '',
    about: '',
    login: '', 
    email: '',
    newPassword: '',
    confirmPassword: '',
    avatar: '',
    createTime: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [feedbackData, setFeedbackData] = useState({
    subject: '',
    message: '',
    attachment: null as File | null
  });
  const [originalData, setOriginalData] = useState(formData);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPersonalization, setShowPersonalization] = useState(false); // Add this line
  const [personalizationSettings, setPersonalizationSettings] = useState({ // Add this line
    theme: 'light',
    primaryColor: '#db233d',
    notificationsEnabled: true
  });

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Ошибка при проверке токена:', error);
      return true;
    }
  };

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
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setIsAuthenticated(false);
      if (setShowSessionAlert) {
        setShowSessionAlert(true);
      }
      throw new Error('Токен истек или недействителен');
    }
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Произошла ошибка');
    }
  
    return response;
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token || isTokenExpired(token)) {
        setIsAuthenticated(false);
        if (setShowSessionAlert) {
          setShowSessionAlert(true);
        }
        return;
      }
  
      try {
        const response = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/api/user/verify`);
        if (!response.ok) {
          throw new Error('Токен недействителен');
        }
  
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setIsAuthenticated(false);
        if (setShowSessionAlert) {
          setShowSessionAlert(true);
        }
      }
    };
  
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showMenu && !(e.target as Element).closest('.profile-menu, .settings-button')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/api/user/profile`);
        const userData = await response.json();
        setFormData({
          ...userData,
          faculty: userData.faculty || '',
          degree: userData.studentDegree || '',
          course: userData.course || '',
          position: userData.post || '',
          department: userData.department || '',
          direction: userData.direction || '',
          about: userData.about || '',
          createTime: userData.createTime ? 
            new Date(userData.createTime).toLocaleString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }) : ' ',
        });
        setAvatar(userData.avatarUrl);
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
        navigate('/login');
      }
    };
  
    fetchUserData();
  }, [navigate]);

  const logoutUser = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Logout failed');
      }

      return response.json();
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as UserStatus;
    setFormData(prev => ({
      ...prev,
      status: newStatus,
      faculty: '',
      degree: '',
      course: '',
      position: '',
      department: '',
      direction: '',
      about: ''
    }));
  };

  const handleLogout = async () => {
    try {
      await logoutUser();

      localStorage.removeItem('token');
      sessionStorage.removeItem('token');

      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      alert('Не удалось выйти из системы. Попробуйте снова.');
    }
  };

  const handleFAQClick = () => {
    navigate('/faq'); 
    setShowMenu(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', 'avatars')

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      if (!token) {
        alert('Вы не авторизованы. Пожалуйста, войдите в систему.');
        navigate('/login');
        return;
      }
  
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/s3/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('Ошибка при загрузке файла');
        }
  
        const data = await response.json();
        console.log('Файл успешно загружен:', data);
  
        setAvatar(data.fileUrl);
        setFormData((prev) => ({ ...prev, avatar: data.fileUrl }));
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
        alert('Не удалось загрузить аватарку. Попробуйте снова.');
      }
    }
  };

  const saveChanges = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      alert('Вы не авторизованы. Пожалуйста, войдите в систему.');
      navigate('/login');
      return;
    }

    try {
      console.log(token)

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accountFIO: formData.accountFIO,
          email: formData.email || null,
          login: formData.login,
          status: formData.status,
          faculty: formData.faculty,
          studentDegree: formData.degree,
          course: Number(formData.course),
          direction: formData.direction,
          post: formData.position,
          department: formData.department,
          about: formData.about,
          password: formData.confirmPassword,
        }),
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при сохранении пользователя');
      }

      console.log('Данные пользователя обновлены')

    } catch (error) {
      console.error('Ошибка при обновлении данных профиля:', error);
      alert('Не удалось обновить данные профиля. Попробуйте снова.' + error);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }
    setIsEditing(false);
    setPasswordError('');
  };

  const handleSavePersonalization = (settings: {
    theme: string;
    primaryColor: string;
    notificationsEnabled: boolean;
  }) => {
    // Тема уже применяется автоматически в модальном окне
    // Сохраняем настройки в localStorage
    localStorage.setItem('app-theme', settings.theme);
    setPersonalizationSettings(settings);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      alert('Вы не авторизованы. Пожалуйста, войдите в систему.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/feetback/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: formData.id,
          title: feedbackData.subject,
          email: formData.email,
          message: feedbackData.message,
        }),
      });
  
      if (response.ok) {
        setShowFeedback(false);
        alert("Обращение отправлено!");
      } else {
        const errorData = await response.json();
        alert(`Ошибка: ${errorData.message || "Произошла ошибка при отправке."}`);
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      alert("Произошла ошибка сети. Пожалуйста, попробуйте позже.");
    }
  };

  const getFacultyNameById = (facultyId: string): string => {
    const faculty = Object.values(Faculties).find(f => f.id === facultyId);
    return faculty ? faculty.name : '';
  };

  const renderInfoSection = () => {
    switch(formData.status) {
      case 'student':
        return (
          <div className="info-section">
            <h2>Учебные данные</h2>
            <div className="info-row">
              <span><FiBook />Факультет:</span>
              <span>{getFacultyNameById(formData.faculty)}</span>
            </div>
            <div className="info-row">
              <span><FiAward />Степень:</span>
              <span>{formData.degree}</span>
            </div>
            <div className="info-row">
              <span><FiMapPin />Направление:</span>
              <span>{formData.direction}</span>
            </div>
            <div className="info-row">
              <span><FiBookOpen />Курс:</span>
              <span>{formData.course}</span>
            </div>
          </div>
        );
      case 'teacher':
        return (
          <div className="info-section">
            <h2>Учебные данные</h2>
            <div className="info-row">
              <span><FiLayers />Кафедра:</span>
              <span>{formData.department}</span>
            </div>
            <div className="info-row">
              <span><FiBriefcase />Должность:</span>
              <span>{formData.position}</span>
            </div>
          </div>
        );
      case 'guest':
        return (
          <div className="info-section">
            <h2>Информация обо мне</h2>
            <div className="info-row">
              <span><FiSmile />Кто вы?</span>
              <span>{formData.about}</span>
            </div>
          </div>
        );
    }
  };

  const renderEditFields = () => {
    return (
      <>
        <div className="form-group">
          <label>Статус</label>
          <div className="select-wrapper">
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="custom-select"
            >
              {!formData.status && (
                <option value="" disabled hidden className="placeholder-option">
                  Выберите статус
                </option>
              )}
              <option value="guest">Гость</option>
              <option value="student">Студент</option>
              <option value="teacher">Преподаватель</option>
            </select>
          </div>
        </div>

        {formData.status === 'student' && (
          <>
            <div className="form-group">
              <label>Факультет</label>
              <div className="select-wrapper">
                <select
                  value={formData.faculty}
                  onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                  className={`custom-select ${formData.faculty ? 'has-value' : ''}`}
                >
                  {!formData.faculty && (
                    <option value="" disabled hidden className="placeholder-option">
                      Выберите факультет
                    </option>
                  )}
                  {Object.entries(Faculties).map(([key, faculty]) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Степень</label>
                <div className="select-wrapper">
                  <select
                    value={formData.degree}
                    onChange={(e) => setFormData({...formData, degree: e.target.value})}
                    className={`custom-select ${formData.degree ? 'has-value' : ''}`}
                  >
                    {!formData.degree && (
                      <option value="" disabled hidden className="placeholder-option">
                        Выберите степень
                      </option>
                    )}
                    {degrees.map(degree => (
                      <option key={degree} value={degree}>{degree}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Курс</label>
                <div className="select-wrapper">
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({...formData, course: e.target.value})}
                    className={`custom-select ${formData.course ? 'has-value' : ''}`}
                  >
                    {!formData.course && (
                      <option value="" disabled hidden className="placeholder-option">
                        Выберите курс
                      </option>
                    )}
                    {courses.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Направление</label>
              <input
                className="custom-input"
                value={formData.direction}
                onChange={(e) => setFormData({...formData, direction: e.target.value})}
                placeholder={!formData.direction ? "Введите название направления" : undefined}
              />
            </div>
          </>
        )}

        {formData.status === 'teacher' && (
          <>
           <div className="form-group">
              <label>Должность</label>
              <div className="select-wrapper">
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({
                    ...formData,
                    position: e.target.value === 'placeholder' ? '' : e.target.value
                  })}
                  className={`custom-select ${formData.position ? 'has-value' : ''}`}
                >
                  <option value="" disabled hidden className="placeholder-option">
                    Выберите должность
                  </option>
                  {positions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Кафедра</label>
              <input
                className="custom-input"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                placeholder="Введите название кафедры"
              />
            </div>
        </>
        )}

        {formData.status === 'guest' && (
          <div className="form-group">
            <label>Кто вы?</label>
            <input
              className="custom-input"
              value={formData.about}
              onChange={(e) => setFormData({...formData, about: e.target.value})}
              placeholder={!formData.about ? "Расскажите о себе" : undefined}
            />
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="custom-input"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder={!formData.email ? "Введите email" : undefined}
          />
        </div>

        <div className="form-group">
          <label>Логин</label>
          <input
            className="custom-input"
            value={formData.login}
            onChange={(e) => setFormData({...formData, login: e.target.value})}
            placeholder={!formData.login ? "Введите логин" : undefined}
            required
          />
        </div>

        <div className="form-group">
          <label>Новый пароль</label>
          <div className="password-input-wrapper">
            <input
              type={showNewPassword ? 'text' : 'password'}
              className="custom-input"
              value={formData.newPassword}
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              placeholder="Придумайте новый пароль"
              autoComplete="new-password"
              id="new-password-field" 
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Подтвердите пароль</label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="custom-input"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              placeholder="Подтвердите новый пароль"
              autoComplete="new-password"
              id="confirm-password-field"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button 
          className="settings-button"
          onClick={() => setShowMenu(!showMenu)}
        >
          <FiSettings />
        </button>

        {showMenu && (
          <div className="profile-menu">
            <MenuItem
              icon={FiEdit}
              text="Редактировать профиль"
              onClick={() => {
                setOriginalData(formData);
                setIsEditing(true);
                setShowMenu(false);
              }}
            />
            <MenuItem
              icon={FaBrush}
              text="Персонализация"
              onClick={() => {
                setShowPersonalization(true);
                setShowMenu(false);
              }}
            />
            <MenuItem
              icon={FiMail}
              text="Обратная связь"
              onClick={() => {
                setShowFeedback(true);
                setShowMenu(false);
              }}
            />
            <MenuItem
              icon={FiFileText}
              text="Политика"
              onClick={() => {
                navigate('/policy');
                setShowMenu(false);
              }}
            />
            <MenuItem
              icon={FiHelpCircle}
              text="FAQ"
              onClick={handleFAQClick} 
            />
            <MenuItem
              icon={FiLogOut}
              text="Выйти"
              onClick={handleLogout}
            />
          </div>
        )}
      </div>

      {showFeedback && (
        <div className="feedback-modal">
          <div className="feedback-content">
            <div className="feedback-header">
              <h2>Обратная связь</h2>
              <button className="close-btn" onClick={() => setShowFeedback(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleFeedbackSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Тема письма"
                  value={feedbackData.subject}
                  onChange={(e) => setFeedbackData({...feedbackData, subject: e.target.value})}
                  required
                />
              </div>
              
              <div className="input-group">
                <input
                  type="email"
                  placeholder="От кого"
                  value={formData.email}
                  readOnly
                  className="sender-input"
                />
              </div>

              <div className="input-group message-group">
                <textarea
                  placeholder="Ваше сообщение"
                  value={feedbackData.message}
                  onChange={(e) => setFeedbackData({...feedbackData, message: e.target.value})}
                  required
                />
              </div>

              <div className="file-upload-group">
                <label>
                  <FiPaperclip className="clip-icon" />
                  <span>Прикрепить файл</span>
                  <input
                    type="file"
                    onChange={(e) => setFeedbackData({...feedbackData, attachment: e.target.files?.[0] || null})}
                  />
                </label>
              </div>

              <button type="submit" className="submit-button">
                Отправить
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="profile-top">
        <div className="avatar-section">
          <label htmlFor='avatar-upload' className="avatar-label">
            {formData.avatar ? (
              <img src={formData.avatar} className="avatar" alt="Аватар" />
            ) : (
              <div className="avatar-placeholder">
                {isEditing && <span>+</span>}
              </div>
            )}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
                className="avatar-input"
              />
          </label>
        </div>
        {!isEditing && (
          <div className="main-info">
            <AnimatedName name={formData.accountFIO} />
            <p className="status">{formData.status === 'student' ? 'Студент' :
              formData.status === 'teacher' ? 'Преподаватель' : 'Гость'}</p>
          </div>
        )}
      </div>

      <div className="profile-content">
        {isEditing ? (
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>ФИО</label>
              <input
                className="custom-input"
                value={formData.accountFIO}
                onChange={(e) => setFormData({...formData, accountFIO: e.target.value})}
                placeholder={!formData.accountFIO ? "Введите ваше ФИО" : undefined}
                required
              />
            </div>

            {renderEditFields()}

            {passwordError && <div className="error-message">{passwordError}</div>}

            <div className="form-actions">
              <button type="submit" className="save-button" onClick={saveChanges}>
                Сохранить изменения
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setFormData(originalData);
                  setIsEditing(false);
                }}
              >
                Отмена
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            {renderInfoSection()}

            <div className="info-section">
              <h2>Контактная информация</h2>
              <div className="info-row">
                <span><FiUser />Логин:</span>
                <span>{formData.login}</span>
              </div>
              <div className="info-row">
                <span><FiMail />Email:</span>
                <span>{formData.email}</span>
              </div>
              <div className="info-row">
                <span><FiCalendar />Дата регистрации:</span>
                <span>{formData.createTime}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <PersonalizationModal
        isOpen={showPersonalization}
        onClose={() => setShowPersonalization(false)}
        onSave={handleSavePersonalization}
      />
    </div>
  );
}