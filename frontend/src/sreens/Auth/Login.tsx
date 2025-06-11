// src/sreens/Auth/Login.tsx

import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from "react-icons/fc";
import { ImAppleinc } from "react-icons/im";
import { FaVk } from 'react-icons/fa';
import './AuthStyles.scss';
import ParticlesBackground from '../../components/ParticlesBackground';

import { ThemeContext } from './../../ThemeContext'; // импортируем контекст темы

type LoginProps = {
  setIsAuthenticated: (value: boolean) => void;
};

export default function Login({ setIsAuthenticated }: LoginProps) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    loginOrEmail: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  // Получаем текущую тему и функцию переключения из контекста
  const { theme, toggleTheme, setTheme } = useContext(ThemeContext);

  // Обработчик социальных кнопок (оставляем без изменений)
  const handleSocialLogin = (provider: 'google' | 'apple' | 'vkontakte') => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/${provider}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Неверный логин/email или пароль');
      }

      const data = await response.json();

      if (rememberMe) {
        localStorage.setItem('token', data.token); // Для длительного хранения
      } else {
        sessionStorage.setItem('token', data.token); // Для текущей сессии
      }

      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      console.error('Ошибка при входе:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    }
  };

  return (
    <div className="auth-wrapper">
      {/* ----- Секция переключателя темы (справа сверху) ----- */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1,
        }}
      >
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
          style={{
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'var(--container-bg)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="light">Светлая</option>
          <option value="dark">Тёмная</option>
          <option value="system">Системная</option>
        </select>
      </div>
      {/* --------------------------------------------------- */}
      <ParticlesBackground />
      <div className="auth-container">

        <h2>Вход в систему</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-field">
            <input
              type="text"
              placeholder="Введите логин / email"
              value={credentials.loginOrEmail}
              onChange={(e) => setCredentials({ ...credentials, loginOrEmail: e.target.value })}
            />
            <label>Логин / email</label>
          </div>

          <div className="input-field password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Введите пароль"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
            <label>Пароль</label>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="custom-checkbox"></span>
              <span className="terms-text">Запомнить меня</span>
            </label>
          </div>

          <button type="submit" className="auth-button">
            Войти
          </button>
        </form>

        <div className="social-login-buttons">
          <button
            type="button"
            className="social-button google"
            onClick={() => handleSocialLogin('google')}
          >
            <FcGoogle className="social-icon" />
            <span className="button-text">Войти с Google</span>
          </button>

          <button
            type="button"
            className="social-button vk"
            onClick={() => handleSocialLogin('vkontakte')}
          >
            <FaVk className="social-icon" />
            <span className="button-text">Войти с ВК</span>
          </button>

          <button
            type="button"
            className="social-button apple"
            onClick={() => handleSocialLogin('apple')}
          >
            <ImAppleinc className="social-icon" />
            <span className="button-text">Войти с Apple</span>
          </button>
        </div>

        <div className="auth-footer">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
          <div style={{ marginTop: '12px' }}>
            <Link to="/forgot-password">Забыли пароль?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
