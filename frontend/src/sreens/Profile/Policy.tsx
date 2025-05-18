import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiFileText } from 'react-icons/fi';
import './Policy.scss';

const PolicyPage = () => {
const navigate = useNavigate();

return (
<div className="policy-container">
<button className="back-button-pol" onClick={() => navigate(-1)}>
<FiArrowLeft />
</button>
  <h1 className="policy-title"><FiFileText /> Политика конфиденциальности</h1>

  <div className="policy-section">
    <h2>1. Сбор информации</h2>
    <p>Мы собираем только необходимую информацию для работы сервиса: имя, email и данные учебного процесса. 
    Все данные хранятся в зашифрованном виде.</p>
  </div>

  <div className="policy-section">
    <h2>2. Использование данных</h2>
    <p>Ваши данные используются исключительно для:
      <ul>
        <li>Идентификации в системе</li>
        <li>Организации учебного процесса</li>
        <li>Отправки уведомлений</li>
      </ul>
    </p>
  </div>

  <div className="policy-section">
    <h2>3. Защита информации</h2>
    <p>Мы используем современные методы шифрования (SSL/TLS) и регулярно обновляем системы безопасности. 
    Доступ к персональным данным имеют только уполномоченные сотрудники.</p>
  </div>

  <div className="policy-section">
    <h2>4. Cookies</h2>
    <p>Сайт использует cookies для:
      <ul>
        <li>Авторизации пользователей</li>
        <li>Сохранения настроек</li>
        <li>Аналитики посещений</li>
      </ul>
    </p>
  </div>

  <div className="policy-section">
    <h2>5. Права пользователей</h2>
    <p>Вы имеете право:
      <ul>
        <li>Запросить свои данные</li>
        <li>Внести изменения в профиль</li>
        <li>Удалить аккаунт</li>
      </ul>
    </p>
  </div>

  <div className="policy-footer">
    <p>Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}</p>
    <p>По вопросам: privacy@university.ru</p>
  </div>
</div>
);
};

export default PolicyPage;