import { useState, useEffect } from 'react';
import { FiX, FiClock, FiMapPin, FiCalendar } from 'react-icons/fi';
import { User, CalendarEvent } from './types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: CalendarEvent) => void;
  currentUser: User;
};

const EventModal = ({ isOpen, onClose, onSubmit, currentUser }: Props) => {
  const [eventData, setEventData] = useState<CalendarEvent>({
    id: '',
    title: '',
    start: '',
    description: '',
    location: '',
    color: '#ff6b6b',
    participants: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventData.title || !eventData.start) {
      alert('Заполните обязательные поля');
      return;
    }
    onSubmit({
      ...eventData,
      id: Date.now().toString(),
      participants: [currentUser]
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="event-modal">
        <div className="modal-header">
          <h2>Создать событие</h2>
          <FiX onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название события</label>
            <input
              value={eventData.title}
              onChange={(e) => setEventData({...eventData, title: e.target.value})}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><FiClock /> Начало</label>
              <input
                type="datetime-local"
                value={eventData.start}
                onChange={(e) => setEventData({...eventData, start: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label><FiClock /> Конец (необязательно)</label>
              <input
                type="datetime-local"
                value={eventData.end || ''}
                onChange={(e) => setEventData({...eventData, end: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label><FiMapPin /> Местоположение</label>
            <input
              value={eventData.location}
              onChange={(e) => setEventData({...eventData, location: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label><FiCalendar /> Описание</label>
            <textarea
              value={eventData.description}
              onChange={(e) => setEventData({...eventData, description: e.target.value})}
            />
          </div>

          <div className="color-picker">
            {[ '#FF3B30',    
                '#FFD700',    // желтый
                '#34C759',    // зелёный
                '#00CED1',    // голубой
                '#007AFF',    // синий
                '#9B59B6',    // фиолетовый
                '#FF94C2',    // розовый
                '#808000',    // оливковый
                '#808080',    // серый
                '#030303'     // чёрный
            ].map(color => (
              <div
                key={color}
                className={`color-option ${eventData.color === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setEventData({...eventData, color})}
              />
            ))}
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="submit-btn">
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;