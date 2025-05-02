import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import TermsModal from './TermsModal';
import ConfirmEmail from './ConfirmEmail';
import { EMAIL_DOMAINS, DOMAIN_HINTS } from '../../enum/EmailDomains';
import './AuthStyles.scss';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountFIO: '',
    login: '',
    email: '',
    status: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [tempAgreeState, setTempAgreeState] = useState(false);
  const [domainSuggestions, setDomainSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [registrationPayload, setRegistrationPayload] = useState<null | any>(null);
  
  // Обработчик прямого клика по чекбоксу
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreeTerms(e.target.checked);
  };

  // Обработчик изменения email
  const handleEmailChange = (value: string) => {
    const [localPart, domainPart = ''] = value.split('@');
    
    // Обновляем подсказки
    if (value.includes('@')) {
      const inputDomain = domainPart.toLowerCase();
      const filtered = DOMAIN_HINTS.filter(d => d.startsWith(inputDomain));
      setDomainSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
    
    setFormData(prev => ({ ...prev, email: value }));
  };

  // Обработчик клика по подсказке
  const handleDomainClick = (domain: string) => {
    const base = formData.email.split('@')[0] || '';
    setFormData(prev => ({ 
      ...prev, 
      email: `${base}@${domain}` 
    }));
    setShowSuggestions(false);
  };

  // Открытие модалки с сохранением текущего состояния
  const openTermsModal = () => {
    setTempAgreeState(agreeTerms);
    setShowTermsModal(true);
  };

  // Подтверждение в модалке
  const handleTermsConfirm = () => {
    setAgreeTerms(true);
    setShowTermsModal(false);
  };

  // Закрытие модалки с восстановлением состояния
  const handleTermsClose = () => {
  setAgreeTerms(tempAgreeState);
  setShowTermsModal(false);
  };

  const handleInputChange = (field: keyof typeof formData) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!EMAIL_DOMAINS.some(d => formData.email.endsWith(`@${d}`))) {
      setError('Используйте почту с поддерживаемым доменом');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (!formData.status) {
      setError('Необходимо выбрать статус');
      return;
    }

    if (!agreeTerms) {
      setError('Необходимо согласиться с условиями');
      return;
    }

    try {
      // 1. Сначала отправляем код подтверждения
      await fetch(`${process.env.REACT_APP_API_URL}/api/auth/send-confirmation-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
  
      // 2. Сохраняем данные для регистрации и показываем форму подтверждения
      setRegistrationPayload({
        accountFIO: formData.accountFIO,
        email: formData.email,
        login: formData.login,
        status: formData.status,
        password: formData.password,
      });
      setShowEmailConfirmation(true);
      setError('');
    } catch (err) {
      setError('Ошибка при отправке кода подтверждения');
    }
  };
  
  const handleCodeConfirmation = async (code: string) => {
    try {
      const verifyResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/verify-confirmation-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registrationPayload.email,
          code,
        }),
      });
  
      if (!verifyResponse.ok) {
        throw new Error('Неверный код подтверждения');
      }

      const registerResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...registrationPayload,
          isEmailVerified: true,
        }),
      });
  
      if (!registerResponse.ok) {
        throw new Error('Ошибка при регистрации');
      }
  
      navigate('/login', { state: { login: registrationPayload.login } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка подтверждения');
      throw err;
    }
  };

  return (
    <div className="auth-wrapper">
       {showEmailConfirmation ? (
        <ConfirmEmail 
          registrationData={registrationPayload}
          onCancel={() => setShowEmailConfirmation(false)}
          onConfirm={handleCodeConfirmation}
        />
        ) : (
          <div className="auth-container">
          <h2>Создать аккаунт</h2>
          <form onSubmit={handleRegister}>
            {error && <div className="error-message">{error}</div>}

            <div className="input-field">
              <input
                type="text"
                placeholder="Введите ваше ФИО"
                value={formData.accountFIO}
                onChange={handleInputChange('accountFIO')}
              />
              <label>ФИО</label>
            </div>

            <div className="input-field">
              <div className="custom-select-wrapper">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="custom-select-stat"
                  required
                  defaultValue=""
                >
                  <option value="" disabled hidden className="placeholder-option">
                    Выберите статус
                  </option>
                  <option value="guest">Гость</option>
                  <option value="student">Студент</option>
                  <option value="teacher">Преподаватель</option>
                </select>
                <label>Статус</label>
              </div>
            </div>

            <div className="input-field">
              <input
                type="text"
                placeholder="Придумайте Логин"
                value={formData.login}
                onChange={handleInputChange('login')}
              />
              <label>Логин</label>
            </div>

            <div className="input-field email-field">
              <input
                type="email"
                placeholder="student@email.com"
                value={formData.email}
                onChange={(e) => handleEmailChange(e.target.value)}
              />
              <label>Электронная почта</label>
              
              {showSuggestions && (
                <div className="domain-suggestions">
                  {domainSuggestions.map(domain => (
                    <button
                      type="button"
                      className="domain-tag"
                      key={domain}
                      onClick={() => handleDomainClick(domain)}
                    >
                      @{domain}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="input-field password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Введите пароль"
                value={formData.password}
                onChange={handleInputChange('password')}
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

            <div className="input-field password-field">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Подтвердите пароль"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
              <label>Подтвердите пароль</label>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={handleCheckboxChange}
                />
                <span className="custom-checkbox"></span>
                <span className="terms-text">
                  Я даю согласие на{' '}
                  <span 
                    style={{ color: '#db233d', cursor: 'pointer' }}
                    onClick={() => setShowTermsModal(true)}
                  >
                    обработку персональных данных
                  </span>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className={`auth-button ${!agreeTerms ? 'disabled' : ''}`}
              disabled={!agreeTerms}
            >
              Зарегистрироваться
            </button>
          </form>

          {showTermsModal && (
            <TermsModal 
                onClose={handleTermsClose}
                onConfirm={handleTermsConfirm}
                initialChecked={tempAgreeState}
          />
          )}

          <div className="auth-footer">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </div>
        </div>
      )}
     </div>
   );
 }