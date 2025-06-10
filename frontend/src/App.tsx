// src/App.tsx

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Map from './sreens/Map/Map';
import News from './sreens/News/News';
import Messenger from './sreens/Messenger/Messenger';
import Calendar from './sreens/Calendar/Calendar';
import Profile from './sreens/Profile/Profile';
import PolicyPage from './sreens/Profile/Policy';
import Login from './sreens/Auth/Login';
import Register from './sreens/Auth/Register';
import ForgotPassword from './sreens/Auth/ForgotPassword';
import ResetPassword from './sreens/Auth/ResetPassword';
import FAQ from './sreens/FAQ/FAQ';
import PublicPost from './sreens/News/PublicPost';
import { jwtDecode } from 'jwt-decode';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token') || !!sessionStorage.getItem('token')
  );

  const [showSessionAlert, setShowSessionAlert] = useState(false);

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

  const checkAuth = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      return false;
    }

    if (isTokenExpired(token)) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setIsAuthenticated(false);
      return false;
    }

    try {
      const isValid = await verifyTokenOnServer(token);
      if (!isValid) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setIsAuthenticated(false);
      }
      return isValid;
    } catch (error) {
      console.error('Ошибка при проверке токена:', error);
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setIsAuthenticated(false);
      return false;
    }
  };

  useEffect(() => {
    if (showSessionAlert) {
      alert('Сессия истекла. Пожалуйста, войдите снова.');
      setShowSessionAlert(false);
    }
  }, [showSessionAlert]);

  useEffect(() => {
    checkAuth(); // Проверяем токен при монтировании компонента
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />
            }
          />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
          <Route
            path="/forgot-password"
            element={isAuthenticated ? <Navigate to="/" /> : <ForgotPassword />}
          />
          <Route
            path="/reset-password"
            element={isAuthenticated ? <Navigate to="/" /> : <ResetPassword />}
          />

          <Route path="/share/:id" element={<PublicPost />} />

          {/* Основные маршруты с навигацией */}
          <Route
            path="/*"
            element={
              isAuthenticated ? (
                <>
                  <main className="content">
                    <Routes>
                      <Route path="/" element={<Map />} />
                      <Route
                        path="/news"
                        element={
                          isAuthenticated ? (
                            <News
                              setIsAuthenticated={setIsAuthenticated}
                              setShowSessionAlert={setShowSessionAlert}
                            />
                          ) : (
                            <Navigate to="/login" />
                          )
                        }
                      />
                      <Route path="/messenger" element={<Messenger />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route
                        path="/profile"
                        element={
                          isAuthenticated ? (
                            <Profile
                              setIsAuthenticated={setIsAuthenticated}
                              setShowSessionAlert={setShowSessionAlert}
                            />
                          ) : (
                            <Navigate to="/login" />
                          )
                        }
                      />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </main>
                  <Navigation />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="/policy" element={<PolicyPage />} />

          <Route
            path="/faq"
            element={
              isAuthenticated ? (
                <main className="content">
                  <FAQ />
                </main>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
