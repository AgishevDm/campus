import { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import './PersonalizationModal.scss';
import { ThemeContext } from '../../ThemeContext';

interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: {
    theme: string;
    primaryColor: string;
    notificationsEnabled: boolean;
  }) => void;
}

const PersonalizationModal = ({ isOpen, onClose, onSave }: PersonalizationModalProps) => {
  const { theme: currentTheme, setTheme } = useContext(ThemeContext);
  const [localTheme, setLocalTheme] = useState(currentTheme);
  const [initialTheme, setInitialTheme] = useState(currentTheme);
  const [primaryColor, setPrimaryColor] = useState('#db233d');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Сбрасываем локальное состояние при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      setLocalTheme(currentTheme);
      setInitialTheme(currentTheme);
    }
  }, [isOpen, currentTheme]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryColor(e.target.value);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as 'light' | 'dark' | 'system';
    setLocalTheme(newTheme);
    // Применяем тему временно, но не сохраняем
    setTheme(newTheme);
  };

  const handleSave = () => {
    // Сохраняем выбранную тему окончательно
    setTheme(localTheme);
    onSave({
      theme: localTheme,
      primaryColor,
      notificationsEnabled
    });
    onClose();
  };

  const handleCancel = () => {
    // Восстанавливаем исходную тему
    setTheme(initialTheme);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="personalization-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="personalization-modal-content"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="personalization-modal-header">
              <h2>Персонализация</h2>
              <button className="close-btn" onClick={handleCancel}>
                <FiX />
              </button>
            </div>

            <div className="settings-group">
              <label>
                Основной цвет
                <div className="color-picker" style={{ backgroundColor: primaryColor }}>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={handleColorChange}
                  />
                </div>
              </label>
            </div>

            <div className="settings-group">
              <label>
                Тема приложения
                <select
                  className="theme-select"
                  value={localTheme}
                  onChange={handleThemeChange}
                >
                  <option value="light">Светлая</option>
                  <option value="dark">Тёмная</option>
                  <option value="system">Системная</option>
                </select>
              </label>
            </div>

            <div className="modal-actions">
              <motion.button 
                className="cancel-btn" 
                onClick={handleCancel}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Отмена
              </motion.button>
              <motion.button 
                className="save-btn" 
                onClick={handleSave}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Сохранить
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PersonalizationModal;