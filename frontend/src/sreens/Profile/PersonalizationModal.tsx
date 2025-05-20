import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import './PersonalizationModal.scss';

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
  const [theme, setTheme] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('#db233d');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryColor(e.target.value);
  };

  const handleSave = () => {
    onSave({
      theme,
      primaryColor,
      notificationsEnabled
    });
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
              <button className="close-btn" onClick={onClose}>
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
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="light">Светлая</option>
                  <option value="dark">Тёмная</option>
                  <option value="system">Системная</option>
                </select>
              </label>
            </div>

            <div className="settings-group">
              <label>
                Уведомления
                <div className="ios-toggle">
                  <input
                    type="checkbox"
                    id="notifications-toggle"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    hidden
                  />
                  <label htmlFor="notifications-toggle" className="ios-toggle-switch" />
                </div>
              </label>
            </div>

            <div className="modal-actions">
              <motion.button 
                className="cancel-btn" 
                onClick={onClose}
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