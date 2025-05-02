import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { FiX, FiEdit, FiTrash2, FiUserPlus, FiEye, FiEyeOff, FiMoreVertical, FiPlus, FiSearch } from 'react-icons/fi';
import './Profile.scss';
import { typeAccessList } from '../../store/typeAccess';
import { useNavigate } from 'react-router-dom';

type User = {
  id: string;
  avatar: string;
  accountFIO: string;
  login: string;
  email: string;
  password: string;
  role: string;
};

type FormData = Omit<User, 'id'> & {
  id?: string; 
};

export default function Profile() {
  const navigate = useNavigate();
  // Состояние текущего пользователя
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'current',
    accountFIO: '',
    login: '',
    email: '',
    password: '',
    role: '',
    avatar: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    accountFIO: '',
    login: '',
    email: '',
    password: '',
    role: '',
    avatar: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const formFileInputRef = useRef<HTMLInputElement>(null);
  const [showContextMenuId, setShowContextMenuId] = useState<string | null>(null); // Уникальный ID для меню
  const contextMenuRef = useRef<HTMLDivElement>(null);

   // Фильтрация данных
   const filteredUsers = useMemo(() => 
    users.filter(user =>
      user.login.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  [users, searchQuery]);

   // Обработчик поиска
   const handleSearch = useCallback(() => {
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Ошибка при загрузке данных пользователя');
        }
  
        const userData = await response.json();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Ошибка:', error);
      }
    };
  
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/getUsers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          // body: JSON.stringify({
          //   typeUser: "notUser"
          // }),
        });

        if (!response.ok) {
          throw new Error('Ошибка при загрузке пользователей');
        }

        const data = await response.json();
        console.log('kdfsmsfdkmsdfsdf - ', data)
        setUsers(data);
      } catch (error) {
        console.error('Ошибка:', error);
      }
    };

    fetchUsers();
  }, []);

  // Закрытие контекстного меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalType(null);
    setSelectedUser(null);
    resetForm();
  }, []);

  // Обработчик аватарки текущего пользователя
  const handleMainAvatar = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCurrentUser(prev => ({ ...prev, avatar: event.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }, []);

  // Обработчик аватарки в форме
  // const handleFormAvatar = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files?.[0]) {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       setFormData(prev => ({ ...prev, avatar: event.target?.result as string }));
  //     };
  //     reader.readAsDataURL(e.target.files[0]);
  //   }
  // }, []);

  const handleFormAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
  
      const formDataSend = new FormData();
      formDataSend.append('file', file);
      formDataSend.append('id', formData.id || '');
      formDataSend.append('status', 'forUserAdmin');
      formDataSend.append('path', 'avatars');

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
          body: formDataSend,
        });
  
        if (!response.ok) {
          throw new Error('Ошибка при загрузке файла');
        }
  
        const data = await response.json();
        console.log('Файл успешно загружен:', data);
  
        setFormData((prev) => ({ ...prev, avatar: data.fileUrl }));
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
        alert('Не удалось загрузить аватарку. Попробуйте снова.');
      }
    }
  };

  const deleteUserById = async (userId: string) => {
    const confirmDelete = window.confirm("Вы уверены, что хотите удалить этого пользователя?");
    
    if (confirmDelete) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/delete/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        setUsers(users => users.filter(u => u.id !== userId));
        setShowContextMenuId(null);
        
        alert("Пользователь успешно удалён");
      } catch (err) {
        console.error(err);
        alert('Не удалось удалить пользователя');
      }
    }
  };

  // Валидация формы
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!formData.accountFIO.trim()) newErrors.accountFIO = 'Обязательное поле';
    if (!formData.login.trim()) newErrors.login = 'Обязательное поле';
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = 'Некорректный email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({
      accountFIO: '',
      login: '',
      email: '',
      password: '',
      role: 'admin',
      avatar: ''
    });
    setErrors({});
  }, []);

  // Сохранение пользователя
  const handleSaveUser = useCallback(async () => {
    if (!validateForm()) return;

    try {
      let response;
      if (modalType === 'edit' && formData.id) {
        const role = typeAccessList.find((access) => access.type === formData.role);
        const roleId = role ? role.id : null;
        response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            accountFIO: formData.accountFIO,
            email: formData.email,
            login: formData.login,
            password: formData.password,
            role: roleId,
          }),
        });
        
      } else {
        // Создание нового пользователя
        response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/newUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            accountFIO: formData.accountFIO,
            email: formData.email,
            login: formData.login,
            password: formData.password,
            role: formData.role,
            avatar: formData.avatar
          }),
        });
        console.log('rwrerwewre')
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при сохранении пользователя');
      }

      const savedUser = await response.json();

      if (modalType === 'add') {
        setUsers(prev => [savedUser, ...prev]);
      } else {
        setUsers(prev => prev.map(user => user.id === savedUser.id ? savedUser : user));
      }

      handleCloseModal();
    } catch(error) {
      setError(error instanceof Error ? error.message : 'Произошла ошибка');
    }
  }, [formData, modalType]);

  return (
    <div className="admin-page">
      <h1 className="page-header">Профиль администратора</h1>
      <div className="content-box">
        {/* Текущий профиль */}
        <div className="current-profile">
          <div className="avatar-section">
            <div className="avatar-wrapper" onClick={() => mainFileInputRef.current?.click()}>
              <input
                type="file"
                ref={mainFileInputRef}
                accept="image/*"
                onChange={handleMainAvatar}
                style={{ display: 'none' }}
              />
              {currentUser.avatar ? (
                <>
                  <img src={currentUser.avatar} alt="Аватар" />
                  <button
                    className="remove-avatar"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentUser(prev => ({ ...prev, avatar: '' }));
                    }}
                  >
                    <FiX />
                  </button>
                </>
              ) : (
                <div className="avatar-placeholder">
                  <FiPlus />
                </div>
              )}
            </div>
          </div>

          <div className="profile-info">
            <div className="profile-header">
              <div className="name-role">
                <h2>{currentUser.accountFIO}</h2>
                <span className="role-badge">{currentUser.role}</span>
              </div>
              <button
                className="edit-profile-btn"
                onClick={() => {
                  setFormData({
                    ...currentUser
                  });
                  setModalType('edit');
                }}
              >
                <FiEdit /> Редактировать профиль
              </button>
            </div>

            <div className="info-grid">
              <div className="info-row">
                <span>Логин:</span>
                <p>{currentUser.login}</p>
              </div>
              <div className="info-row">
                <span>Email:</span>
                <p>{currentUser.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Управление пользователями */}
        <div className="users-management">
        <div className="header">
          <h3>Управление администарторами и супер-пользователями</h3>
          <div className="controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Поиск по логину..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <FiSearch className="search-icon" onClick={handleSearch} />
            </div>
              <button
                className="add-user-btn"
                onClick={() => {
                  resetForm();
                  setModalType('add');
                }}
              >
                <FiUserPlus /> Добавить
              </button>
            </div>
          </div>

          <div className="users-table">
            <div className="table-header">
              <div>Аватар</div>
              <div>ФИО</div>
              <div>Логин</div>
              <div>Email</div>
              <div>Пароль</div>
              <div>Роль</div>
              <div>Действия</div>
            </div>

            {filteredUsers.map(user => (
              <div key={user.id} className="table-row">
                <div className="avatar-cell">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Аватар" />
                  ) : (
                    <div className="avatar-placeholder">
                      <FiPlus />
                    </div>
                  )}
                </div>
                <div>{user.accountFIO}</div>
                <div>{user.login}</div>
                <div>{user.email}</div>
                <div className="password-cell">
                  <div className="password-field">
                    <span>{'•'.repeat(8)}</span>
                    <div className="password-hover">{user.password}</div>
                  </div>
                </div>
                <div className="role-badge">{user.role}</div>
                <div className="actions">
                  <FiMoreVertical
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowContextMenuId(user.id); 
                    }}
                  />
                  {showContextMenuId === user.id && (
                    <div className="context-menu" ref={contextMenuRef}>
                      <button onClick={() => {
                        setFormData({
                          ...user
                        });
                        setModalType('edit');
                        setShowContextMenuId(null);
                      }}>
                        <FiEdit /> Редактировать
                      </button>
                      <button onClick={() => (deleteUserById(user.id))}>
                        <FiTrash2 /> Удалить
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Модальное окно */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={handleCloseModal}>
              <FiX />
            </button>
            <h3>{modalType === 'add' ? 'Новый пользователь' : 'Редактирование'}</h3>

            <div className="avatar-upload">
              <div className="avatar-preview" onClick={() => formFileInputRef.current?.click()}>
                <input
                  type="file"
                  ref={formFileInputRef}
                  accept="image/*"
                  onChange={handleFormAvatar}
                  style={{ display: 'none' }}
                />
                {formData.avatar ? (
                  <>
                    <img src={formData.avatar} alt="Аватар" />
                    <button
                      className="remove-avatar"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({ ...prev, avatar: '' }));
                      }}
                    >
                      <FiX />
                    </button>
                  </>
                ) : (
                  <div className="avatar-placeholder">
                    <FiPlus />
                  </div>
                )}
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>ФИО *</label>
                <input
                  value={formData.accountFIO}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountFIO: e.target.value }))}
                />
                {errors.accountFIO && <span className="error">{errors.accountFIO}</span>}
              </div>

              <div className="form-group">
                <label>Логин *</label>
                <input
                  value={formData.login}
                  onChange={(e) => setFormData(prev => ({ ...prev, login: e.target.value }))}
                />
                {errors.login && <span className="error">{errors.login}</span>}
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Пароль</label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  />
                  <button
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Роль *</label>
                {/* <select value={formData.role} onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}>
                  <option value="">Выберите тип доступа</option>
                  {typeAccessList.map((access) => (
                    <option key={access.id} value={access.id}>
                      {access.type}
                    </option>
                  ))}
                </select> */}
                  {modalType === 'add' ? (
                    // Если это добавление нового пользователя, показываем выпадающий список
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    >
                      <option value="">Выберите тип доступа</option>
                      {typeAccessList.map((access) => (
                        <option key={access.id} value={access.id}>
                          {access.type}
                        </option>
                      ))}
                    </select>
                  ) : (
                    // Если это редактирование, показываем текущую роль без возможности изменения
                    <select
                      value={formData.role}
                      onChange={(e) => {
                        const selectedRole = typeAccessList.find((access) => access.id === e.target.value);
                        if (selectedRole) {
                          setFormData(prev => ({ ...prev, role: selectedRole.type }));
                        }
                      }}
                    >
                      <option value="">Текущая роль - {formData.role}</option>
                      {typeAccessList.map((access) => (
                        <option key={access.id} value={access.id}>
                          {access.type}
                        </option>
                      ))}
                    </select>
                  )}
              </div>
            </div>

            <button className="submit-btn" onClick={handleSaveUser}>
              {modalType === 'add' ? 'Создать' : 'Сохранить'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}