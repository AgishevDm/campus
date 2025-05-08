// UserInfoPanel.tsx
import { useState, useRef, useEffect } from 'react';
import { 
  FiUser, FiMail, FiCopy, FiMessageSquare, 
  FiAward, FiHome, FiBriefcase, FiCalendar,
  FiBook, FiInfo
} from 'react-icons/fi';
import { FaRegUser, FaUserGraduate, FaUserTie, FaUniversity } from 'react-icons/fa';
import './UserInfoPanel.scss';
import { User } from './types';

type UserInfoPanelProps = {
    user: User;
    onClose: () => void;
    isMobile: boolean;
    onStartChat: (user: User) => void;
    fromChat?: boolean;
    hasExistingChat?: boolean;
};

const UserInfoPanel = ({ user, onClose, isMobile, onStartChat, fromChat = false, hasExistingChat = false }: UserInfoPanelProps) => {
    const [copiedEmail, setCopiedEmail] = useState(false);
    const [copiedLogin, setCopiedLogin] = useState(false);
    const [showChatBtn, setShowChatBtn] = useState(false);
    const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const nameRef = useRef<HTMLHeadingElement>(null);
    const chatBtnRef = useRef<HTMLButtonElement>(null);

    const handleCopy = (text: string, type: 'email' | 'login') => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        if (type === 'email') {
            setCopiedEmail(true);
        } else {
            setCopiedLogin(true);
        }
        
        if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = setTimeout(() => {
            setCopiedEmail(false);
            setCopiedLogin(false);
        }, 2000);
    };

    const getStatusIcon = () => {
        switch(user.status) {
            case 'student': return <FaUserGraduate />;
            case 'teacher': return <FaUserTie />;
            default: return <FiUser />;
        }
    };

    const getStatusText = () => {
        switch(user.status) {
            case 'student': return 'Студент';
            case 'teacher': return 'Преподаватель';
            default: return 'Гость';
        }
    };

    const handleNameClick = (e: React.MouseEvent) => {
        // Проверяем, был ли клик по кнопке чата
        if (chatBtnRef.current && chatBtnRef.current.contains(e.target as Node)) {
            return;
        }
        onStartChat(user);
    };

    useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        };
    }, []);

    return (
        <div className={`user-info-panel ${isMobile ? 'mobile-active' : ''}`}>
            <div className="panel-header">
                <h3>Информация о пользователе</h3>
                <button className="close-btn" onClick={onClose}>
                    <span className="close-icon"></span>
                </button>
            </div>
            
            <div className="panel-content">
                <div className="user-header">
                    <div className="avatar-container" onClick={() => onStartChat(user)}>
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="user-avatar" />
                        ) : (
                            <div className="default-avatar">
                                <FaRegUser />
                            </div>
                        )}
                    </div>
                    
                    <div className="name-container">
                        <h2 
                            ref={nameRef}
                            onMouseEnter={() => setShowChatBtn(true)}
                            onMouseLeave={() => setShowChatBtn(false)}
                            onClick={handleNameClick}
                        >
                            {user.name}
                            <span className={`status-dot ${user.online ? 'online' : 'offline'}`}></span>
                            
                            {showChatBtn && (
                                <button 
                                    ref={chatBtnRef}
                                    className="floating-chat-btn"
                                    onClick={() => onStartChat(user)}
                                >
                                    <FiMessageSquare /> {hasExistingChat ? 'Перейти к чату' : 'Написать'}
                                </button>
                            )}
                        </h2>
                        <p className="user-status">{getStatusText()}</p>
                    </div>
                </div>

                <div className="info-sections">
                    <div className="info-section">
                        <h4 className="section-title">
                            <FiInfo className="title-icon" />
                            Основная информация
                        </h4>
                        <div className="info-item">
                            <div className="info-icon">
                                <FiUser />
                            </div>
                            <div className="info-content">
                                <span className="info-label">Логин</span>
                                <span 
                                    className="info-value copyable"
                                    onClick={() => handleCopy(user.login, 'login')}
                                >
                                    @{user.login}
                                    {copiedLogin && <span className="copy-tooltip">Скопировано!</span>}
                                </span>
                            </div>
                        </div>

                        {user.email && (
                            <div className="info-item">
                                <div className="info-icon">
                                    <FiMail />
                                </div>
                                <div className="info-content">
                                    <span className="info-label">Email</span>
                                    <span 
                                        className="info-value copyable"
                                        onClick={() => handleCopy(user.email || '', 'email')}
                                    >
                                        {user.email}
                                        {copiedEmail && <span className="copy-tooltip">Скопировано!</span>}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="info-item">
                            <div className="info-icon">
                                {getStatusIcon()}
                            </div>
                            <div className="info-content">
                                <span className="info-label">Статус</span>
                                <span className="info-value">{getStatusText()}</span>
                            </div>
                        </div>
                    </div>

                    {(user.status === 'student' && (user.faculty || user.degree || user.course)) && (
                        <div className="info-section">
                            <h4 className="section-title">
                                <FiBook className="title-icon" />
                                Учебная информация
                            </h4>
                            
                            {user.faculty && (
                                <div className="info-item">
                                    <div className="info-icon">
                                        <FaUniversity />
                                    </div>
                                    <div className="info-content">
                                        <span className="info-label">Факультет</span>
                                        <span className="info-value">{user.faculty}</span>
                                    </div>
                                </div>
                            )}
                            
                            {user.degree && (
                                <div className="info-item">
                                    <div className="info-icon">
                                        <FiAward />
                                    </div>
                                    <div className="info-content">
                                        <span className="info-label">Степень</span>
                                        <span className="info-value">{user.degree}</span>
                                    </div>
                                </div>
                            )}
                            
                            {user.course && (
                                <div className="info-item">
                                    <div className="info-icon">
                                        <FiCalendar />
                                    </div>
                                    <div className="info-content">
                                        <span className="info-label">Курс</span>
                                        <span className="info-value">{user.course}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {(user.status === 'teacher' && (user.position || user.department)) && (
                        <div className="info-section">
                            <h4 className="section-title">
                                <FiBriefcase className="title-icon" />
                                Профессиональная информация
                            </h4>
                            
                            {user.position && (
                                <div className="info-item">
                                    <div className="info-icon">
                                        <FiUser />
                                    </div>
                                    <div className="info-content">
                                        <span className="info-label">Должность</span>
                                        <span className="info-value">{user.position}</span>
                                    </div>
                                </div>
                            )}
                            
                            {user.department && (
                                <div className="info-item">
                                    <div className="info-icon">
                                        <FiHome />
                                    </div>
                                    <div className="info-content">
                                        <span className="info-label">Кафедра</span>
                                        <span className="info-value">{user.department}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {!fromChat && (
                    <button 
                        className="start-chat-btn"
                        onClick={() => onStartChat(user)}
                    >
                        <FiMessageSquare /> {hasExistingChat ? 'Перейти к чату' : 'Начать чат'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserInfoPanel;