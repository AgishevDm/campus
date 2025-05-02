import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Login.scss';

type LoginProps = {
  setIsAuthenticated: (value: boolean) => void;
};

export default function Login({ setIsAuthenticated }: LoginProps) {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuth, setIsAuth] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginOrEmail: login, password }),
      });

      if (!response.ok) {
        throw new Error('Неверный логин или пароль');
      }

      const data = await response.json();
      
      if (data.typeAccess === 'admin') {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        console.log('Пользователь аутентифицирован, перенаправление...');
        setIsAuth(true);
      } else {
        setError('У вас нет доступа к админке.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    }
  };

  useEffect(() => {
    if (isAuth) {
      navigate('/admin');
    }
  }, [isAuth, navigate]);

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Авторизация</h1>

        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="login">Логин</label>
          <input
            type="text"
            id="login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button">
          Войти
        </button>
      </form>
    </div>
  );
}