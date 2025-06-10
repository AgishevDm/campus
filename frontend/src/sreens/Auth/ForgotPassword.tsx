import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmEmail from './ConfirmEmail';
import { EMAIL_DOMAINS } from '../../enum/EmailDomains';
import './AuthStyles.scss';
import ParticlesBackground from '../../components/ParticlesBackground';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [emailForReset, setEmailForReset] = useState('');

  const validateEmailDomain = (email: string) => {
    const domain = email.split('@')[1]?.toLowerCase();
    return domain && EMAIL_DOMAINS.includes(domain as typeof EMAIL_DOMAINS[number]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Пожалуйста, введите email');
      return;
    }

    if (!validateEmailDomain(email)) {
      setError('Используйте почту с поддерживаемым доменом');
      return;
    }

    try {
      const sendCode = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/send-confirmation-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, type: 'reset' }),
      });

      if (!sendCode.ok) {
        throw new Error('Email не найден');
      }

      setEmailForReset(email);
      setShowConfirmation(true);
      setSuccess('Код подтверждения отправлен на ваш email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    }
  };

  const handleCodeConfirm = async (code: string) => {
    try {
      const verifyResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/verify-confirmation-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          code,
          type: 'reset',
        }),
      });
  
      if (!verifyResponse.ok) {
        throw new Error('Неверный код подтверждения');
      }
  
      navigate('/reset-password', { state: { email: emailForReset } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка подтверждения');
      throw err;
    }
  };

  return showConfirmation ? (
    <ConfirmEmail
      registrationData={{ email: emailForReset }}
      onCancel={() => setShowConfirmation(false)}
      onConfirm={handleCodeConfirm}
      isPasswordReset={true}
    />
  ) : (
    <div className="auth-wrapper">
      <ParticlesBackground />
      <div className="auth-container">
        <h2>Восстановление пароля</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              type="email"
              placeholder="Введите ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>

          <button type="submit" className="auth-button">
            Отправить код подтверждения
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login">Вернуться к входу</Link>
        </div>
      </div>
    </div>
  );
}