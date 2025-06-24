import { useState } from 'react';
import { FiX, FiUserPlus, FiTrash2 } from 'react-icons/fi';
import { IoImageOutline } from 'react-icons/io5';
import { User, Chat } from './types';
import './Messenger.scss';

type GroupCreationModalProps = {
  show: boolean;
  onClose: () => void;
  onCreate: (newChat: Chat) => void;
  currentUser: User; 
};

const GroupCreationModal = ({  show, onClose, onCreate, currentUser }: GroupCreationModalProps) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupData, setGroupData] = useState<{name: string; avatar: string}>({name: '', avatar: ''});
  const [searchQuery, setSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState<User[]>([]);
  
// cоздание группового чата через API
  const handleCreate = async () => {
    if (!groupData.name) return;

    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/chats/group`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: groupData.name,
            participants: selectedUsers.map((u) => u.id),
          }),
        },
      );

      if (!response.ok) throw new Error('Failed to create group');
      const chat = await response.json();
      onCreate(chat);
      onClose();
      setSelectedUsers([]);
      setGroupData({ name: '', avatar: '' });
      setSearchQuery('');
      setUserSearchResults([]);
    } catch (err) {
      console.error('create group error', err);
    }
  };

 // поиск пользователей по login и email
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setUserSearchResults([]);
      return;
    }

    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/search?q=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!response.ok) throw new Error('search error');
      const data = await response.json();
      setUserSearchResults(data);
    } catch (err) {
      console.error('user search error', err);
      setUserSearchResults([]);
    }
  };

  // Удаление аватара группы
  const removeGroupAvatar = () => {
    setGroupData(prev => ({...prev, avatar: ''}));
  };

  if (!show) return null;

  return (
    <div className="modal-overlay-msgr">
      <div className="modal-content-msgr group-creation-modal-msgr" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-msgr">
          <h3>Создать группу</h3>
          <button onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <div className="group-creation-form-msgr">
          <div className="avatar-upload-msgr" onClick={() => 
            document.getElementById('group-avatar-input')?.click()
          }>
            {groupData.avatar ? (
              <>
                <img src={groupData.avatar} alt="Group avatar" />
                <button
                  className="remove-avatar-btn-msgr"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeGroupAvatar();
                  }}
                >
                  <FiTrash2 />
                </button>
              </>
            ) : (
              <div className="avatar-placeholder-msgr">
                <IoImageOutline size={24} />
                <label htmlFor="group-avatar-input" className="upload-btn-msgr">
                  <IoImageOutline className="upload-icon-msgr" />
                </label>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              id="group-avatar-input"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setGroupData(prev => ({
                      ...prev,
                      avatar: event.target?.result as string
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
          
          <input
            type="text"
            placeholder="Название группы"
            value={groupData.name}
            onChange={(e) => setGroupData(prev => ({...prev, name: e.target.value}))}
            maxLength={50}
          />
          
          <div className="selected-users-list-msgr">
            {selectedUsers.map(user => (
              <div key={user.id} className="selected-user-msgr">
                <img src={user.avatar || '/default-avatar.png'} alt={user.name} />
                <span>{user.name}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
                  }}
                >
                  <FiX size={14} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="user-search-container-msgr">
            <input
              type="text"
              placeholder="Добавить участников..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchQuery && (
              <div className="search-results-dropdown-msgr">
                {userSearchResults
                  .filter(user => !selectedUsers.some(u => u.id === user.id))
                  .map(user => (
                    <div
                      key={user.id}
                      className="user-result-msgr"
                      onClick={() => {
                        setSelectedUsers(prev => [...prev, user]);
                        setSearchQuery('');
                      }}
                    >
                      <img src={user.avatar || '/default-avatar.png'} alt={user.name} />
                      <div>
                        <h4>{user.name}</h4>
                        <p>@{user.login} • {user.email}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
          <button 
           onClick={handleCreate}
            className="create-btn-msgr">
            Создать
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupCreationModal;