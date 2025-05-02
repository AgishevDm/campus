import { FiX } from 'react-icons/fi';
import { ColorOption } from './types';

type Props = {
  eventData: {
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    color: ColorOption;
  };
  onColorChange: (color: ColorOption) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function CalendarEventModal({
  eventData,
  onColorChange,
  onClose,
  onSubmit
}: Props) {
  return (
    <div className="modal-overlay">
      <div className="calendar-modal">
        <div className="modal-header">
          <h2>Добавить в календарь</h2>
          <FiX onClick={onClose} />
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Название события</label>
            <input
              value={eventData.title}
              readOnly
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Дата</label>
              <input
                type="date"
                value={eventData.date}
                readOnly
                required
              />
            </div>
            <div className="form-group">
              <label>Время</label>
              <input
                type="time"
                value={eventData.time}
                readOnly
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Место</label>
            <input
              value={eventData.location}
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              value={eventData.description}
              readOnly
            />
          </div>

          <div className="color-picker">
            {['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#4577d1'].map(color => (
              <div
                key={color}
                className={`color-option ${eventData.color === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => onColorChange(color as ColorOption)}
              />
            ))}
          </div>

          <div className="modal-actions">
            <button 
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Отмена
            </button>
            <button type="submit" className="submit-btn">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}