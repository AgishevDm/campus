import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Layout from './Layout/Layout';
import Login from './screens/Login/Login';
import Analytics from './screens/Analytics/Analytics';
import Maps from './screens/Maps/Maps';
import News from './screens/News/News';
import Feedback from './screens/Feedback/Feedback';
import Profile from './screens/Profile/Profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token') || !!sessionStorage.getItem('token')
  );

  // Проверка истечения срока действия токена
  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Текущее время в секундах
      return decoded.exp < currentTime; // Сравниваем время истечения с текущим
    } catch (error) {
      console.error('Ошибка при проверке токена:', error);
      return true; // В случае ошибки считаем токен истекшим
    }
  };

  // Проверка токена на сервере
  const verifyTokenOnServer = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/verify`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Токен недействителен');
      }

      const data = await response.json();
      return data.valid;
    } catch (error) {
      console.error('Ошибка при проверке токена:', error);
      return false;
    }
  };

  // Проверка аутентификации
  const checkAuth = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      console.log('Токен отсутствует');
      setIsAuthenticated(false);
      return;
    }

    if (isTokenExpired(token)) {
      console.log('Токен истёк');
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setIsAuthenticated(false);
      return;
    }

    const isValid = await verifyTokenOnServer(token);
    if (!isValid) {
      console.log('Токен недействителен');
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setIsAuthenticated(false);
    } else {
      console.log('Токен действителен');
      setIsAuthenticated(true);
    }
  };

  // Проверка токена при монтировании компонента
  useEffect(() => {
    checkAuth();
  }, []);

  // Создание маршрутов
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Navigate to="/login" replace />,
    },
    {
      path: '/login',
      element: <Login setIsAuthenticated={setIsAuthenticated} />,
    },
    {
      path: '/admin',
      element: isAuthenticated ? <Layout /> : <Navigate to="/login" replace />,
      children: [
        { index: true, element: <Navigate to="analytics" replace /> },
        { path: 'analytics', element: <Analytics /> },
        { path: 'maps', element: <Maps /> },
        { path: 'news', element: <News /> },
        { path: 'feedback', element: <Feedback /> },
        { path: 'profile', element: <Profile /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;