import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthStyles.scss';

type ConfirmEmailProps = {
  registrationData: {
    email: string;
    login?: string;
  };
  onCancel: () => void;
  onConfirm: (code: string) => Promise<void>;
  isPasswordReset?: boolean;
};

export default function ConfirmEmail({ 
  registrationData, 
  onCancel, 
  onConfirm, 
  isPasswordReset = false 
}: ConfirmEmailProps) {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(60);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value.length === 1 && index < 5) {
      inputsRef.current[index + 1]?.focus();
    } else if (value.length === 0 && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newCode = pasteData.split('').concat(Array(6 - pasteData.length).fill(''));
      setCode(newCode.slice(0, 6));
      const firstEmptyIndex = newCode.findIndex(c => c === '');
      const focusIndex = firstEmptyIndex === -1 ? 5 : firstEmptyIndex - 1;
      inputsRef.current[focusIndex]?.focus();
    }
  };

  const handleSubmit = async () => {
    setError('');
    const fullCode = code.join('');

    if (fullCode.length !== 6) {
      setError('Введите полный код из 6 цифр');
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirm(fullCode);
      if (!isPasswordReset) {
        navigate('/login', { state: { login: registrationData.login } });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка подтверждения');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/auth/send-confirmation-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registrationData.email }),
      });
      setCanResend(false);
      setResendTimeout(60);
    } catch (err) {
      setError('Не удалось отправить код повторно');
    }
  };

  useEffect(() => {
    if (resendTimeout > 0) {
      const timer = setTimeout(() => setResendTimeout(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimeout]);

  useEffect(() => {
    if (inputsRef.current[0]) inputsRef.current[0].focus();
  }, []);

  return (
    <div className="auth-wrapper confirm-email-wrapper">
      <div className="auth-container">
        <h2>
          {isPasswordReset 
            ? 'Подтверждение сброса пароля' 
            : 'Подтверждение электронной почты'}
        </h2>
        {error && <div className="error-message">{error}</div>}
        <p style={{ textAlign: 'center', margin: '16px 0' }}>
          Код отправлен на {registrationData.email}
        </p>

        <div className="code-inputs" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputsRef.current[index] = el; }}
              type="number"
              inputMode="numeric"
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isSubmitting}
              autoComplete="one-time-code"
            />
          ))}
        </div>

        <div className="buttons-container">
          <button
            className="auth-button secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            type="button"
          >
            Отменить
          </button>
          <button
            className="auth-button primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            type="button"
          >
            {isSubmitting ? 'Проверка...' : 'Подтвердить'}
          </button>
        </div>

        <div className="auth-footer" style={{ marginTop: '24px' }}>
          {canResend ? (
            <button 
              type="button" 
              onClick={handleResendCode}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#db233d', 
                cursor: 'pointer' 
              }}
            >
              Отправить код повторно
            </button>
          ) : (
            <span style={{ color: '#86868b' }}>
              Повторная отправка через {resendTimeout} сек
            </span>
          )}
        </div>
      </div>
    </div>
  );
}