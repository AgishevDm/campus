import { useState, useEffect } from 'react';
import { FiChevronUp, FiChevronDown, FiSearch, FiFilter, FiUsers } from 'react-icons/fi';
import './Analytics.scss';
import Chart from 'react-apexcharts';

type User = {
  id: string;
  avatar: string;
  accountFIO: string;
  email: string;
  login: string;
  status: 'online' | 'offline';
  role: string;
};

type AnalyticsData = {
  totalUsers: number;
  usersByType: Array<{ status: string; count: number }>; // Теперь это массив
};


export default function Analytics() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  // Mock data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Загружаем аналитику
        const analyticsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/analytics/getUsersInfo`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!analyticsResponse.ok) {
          throw new Error('Ошибка при загрузке аналитики');
        }

        const analytics = await analyticsResponse.json();
        setAnalyticsData(analytics);

        // Загружаем пользователей
        const usersResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/user/getUsers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!usersResponse.ok) {
          throw new Error('Ошибка при загрузке пользователей');
        }

        const usersData = await usersResponse.json();
        setUsers(usersData);

      } catch (err) {
        console.error('Ошибка:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chart configuration
  const chartOptions = {
    chart: { type: 'area' },
    xaxis: {
      categories: timeRange === 'day' ? ['00:00', '06:00', '12:00', '18:00', '24:00'] :
        timeRange === 'week' ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] :
        timeRange === 'month' ? Array.from({length: 30}, (_, i) => (i + 1).toString()) :
        ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
    },
    colors: ['#3498db'],
  };

  const chartSeries = [{
    accountFIO: 'Пользователи',
    data: timeRange === 'day' ? [30, 40, 35, 50, 49] :
      timeRange === 'week' ? [100, 120, 90, 140, 150, 160, 170] :
      timeRange === 'month' ? Array.from({length: 30}, () => Math.floor(Math.random() * 200)) :
      Array.from({length: 12}, () => Math.floor(Math.random() * 1000))
  }];

  if (loading) return <div className="admin-page">Загрузка...</div>;
  if (error) return <div className="admin-page">Ошибка: {error}</div>;

  return (
    <div className="admin-page">
      <h1 className="page-header">Аналитика</h1>
      
      <div className="content-box analytics-container">
        {/* Основные показатели */}
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Всего пользователей</h3>
            <div className="metric-value">{analyticsData?.totalUsers?.toLocaleString() || '0'}</div>
            <div className="metric-trend">+15% за месяц</div>
          </div>

          <div className="metric-card">
            <h3>Сейчас онлайн</h3>
            {/* <div className="metric-value">256</div>
            <div className="metric-trend">↗ 24 активных</div> */}
          </div>

          <div className="metric-card chart-card">
            <div className="chart-header">
              <h3>Прирост пользователей</h3>
              <select value={timeRange} onChange={(e) => setTimeRange(e.target.value as any)}>
                <option value="day">За день</option>
                <option value="week">За неделю</option>
                <option value="month">За месяц</option>
                <option value="year">За год</option>
              </select>
            </div>
            
          </div>
        </div>

        {/* Дополнительные показатели */}
        <div className="secondary-metrics">
          <div className="metric-group">
            <h4>По типам пользователей</h4>
            <div className="role-metrics">
              <div className="role-metric">
                <span>Гости</span>
                <div className="value">
                  {analyticsData?.usersByType?.find(item => item.status === 'guest')?.count || '0'}
                </div>
              </div>
              <div className="role-metric">
                <span>Студенты</span>
                <div className="value">
                  {analyticsData?.usersByType?.find(item => item.status === 'student')?.count || '0'}
                </div>
              </div>
              <div className="role-metric">
                <span>Преподаватели</span>
                <div className="value">
                  {analyticsData?.usersByType?.find(item => item.status === 'teacher')?.count || '0'}
                </div>
              </div>
            </div>
            </div>

          <div className="metric-group">
            <h4>Распределение по факультетам</h4>
            <div className="chart-container">
              <Chart 
                options={{ labels: ['ФМИ', 'СиАЛ', 'ЭФ', 'ФФ'] }}
                series={[30, 25, 20, 25]}
                type="donut"
                width="380"
              />
            </div>
          </div>
        </div>

        {/* Таблица пользователей */}
        <div className={`users-table-container ${isTableCollapsed ? 'collapsed' : ''}`}>
          <div className="table-header" onClick={() => setIsTableCollapsed(!isTableCollapsed)}>
            <FiUsers />
            <span>Пользователи</span>
            {isTableCollapsed ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          
          {!isTableCollapsed && (
            <div className="table-content">
              <div className="table-controls">
                <div className="search-box">
                  <FiSearch />
                  <input 
                    type="text" 
                    placeholder="Поиск пользователей..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="filter-btn">
                  <FiFilter /> Фильтры
                </button>
              </div>

              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Фото</th>
                      <th>ФИО</th>
                      <th>Почта</th>
                      <th>Логин</th>
                      <th>Статус</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>
                          {user.avatar ? 
                            <div className="avatar-cell">
                              <img src={user.avatar} alt="Аватар" />
                            </div> : 
                            <div className="avatar-placeholder" />
                          }
                        </td>
                        <td>{user.accountFIO}</td>
                        <td>{user.email}</td>
                        <td>{user.login}</td>
                        <td>
                          <span className={`status-badge ${user.status}`}>
                            {user.status === 'online' ? 'Онлайн' : 'Офлайн'}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn">
                            <FiChevronDown />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}