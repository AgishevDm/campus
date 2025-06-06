import { NavLink } from 'react-router-dom';
import { 
  FiMap,
  FiFileText,
  FiMessageSquare,
  FiCalendar,
  FiUser
} from 'react-icons/fi';
import './Navigation.scss';

export default function Navigation() {
  return (
    <nav className="navigation">
      <NavLink to="/" className={({ isActive }) => 
        `nav-item ${isActive ? 'active' : ''}`
      }>
        <FiMap className="nav-icon" />
        <span className="nav-label">Карты</span>
      </NavLink>

      <NavLink to="/news" className={({ isActive }) => 
        `nav-item ${isActive ? 'active' : ''}`
      }>
        <FiFileText className="nav-icon" />
        <span className="nav-label">Новости</span>
      </NavLink>

      <NavLink to="/messenger" className={({ isActive }) => 
        `nav-item ${isActive ? 'active' : ''}`
      }>
        <FiMessageSquare className="nav-icon" />
        <span className="nav-label">Мессенджер</span>
      </NavLink>

      <NavLink to="/calendar" className={({ isActive }) => 
        `nav-item ${isActive ? 'active' : ''}`
      }>
        <FiCalendar className="nav-icon" />
        <span className="nav-label">Календарь</span>
      </NavLink>

      <NavLink to="/profile" className={({ isActive }) => 
        `nav-item ${isActive ? 'active' : ''}`
      }>
        <FiUser className="nav-icon" />
        <span className="nav-label">Профиль</span>
      </NavLink>
    </nav>
  );
}