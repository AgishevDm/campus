import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './AuthStyles.scss';
import ParticlesBackground from '../../components/ParticlesBackground';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const email = location.state?.email || '';

  const validateForm = () => {
    if (!password.trim() || !confirmPassword.trim()) {
      setError('Все поля обязательны для заполнения');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при сбросе пароля');
      }

      setSuccessMessage('Пароль успешно изменен!');
      setTimeout(() => {
        navigate('/login', { state: { resetSuccess: true } });
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при сохранении пароля');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <ParticlesBackground />
      <div className="auth-container">
        <h2>Восстановление пароля</h2>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <p style={{ textAlign: 'center', margin: '16px 0' }}>
          Введите новый пароль для {email}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Скрытое поле для обхода автозаполнения */}
          <input 
            type="text" 
            name="prevent_autofill" 
            style={{ display: 'none' }} 
            autoComplete="off"
          />

          <div className="input-field password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Новый пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              name="newPassword"
              id="newPassword"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
            <label htmlFor="newPassword">Новый пароль</label>
          </div>

          <div className="input-field password-field">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Подтвердите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              name="confirmNewPassword"
              id="confirmNewPassword"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
            <label htmlFor="confirmNewPassword">Подтвердите пароль</label>
          </div>

          <div className="buttons-container">
            <button
              className="auth-button secondary"
              onClick={() => navigate('/login')}
              disabled={isSubmitting}
              type="button"
            >
              Отменить
            </button>
            <button
              className="auth-button primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}