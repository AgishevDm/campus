export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) throw new Error('Токен отсутствует');

  const headers = { ...(options.headers || {}), Authorization: `Bearer ${token}` } as HeadersInit;
  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    throw new Error('Ошибка запроса');
  }

  return response;
};
