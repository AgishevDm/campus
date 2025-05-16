import { FiClock, FiMapPin, FiCalendar, FiUsers } from 'react-icons/fi';
import { Message } from './types';

type Props = {
  message: Message;
  onAddToCalendar: () => void;
  onViewDetails: () => void;
};

const EventMessage = ({ message, onAddToCalendar, onViewDetails }: Props) => {
  if (!message.event) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="event-message" onClick={onViewDetails}>
      <div className="event-header" style={{ borderColor: message.event.color }}>
        <h3>{message.event.title}</h3>
        <span className="event-color" style={{ backgroundColor: message.event.color }} />
      </div>

      <div className="event-details">
        <div className="detail-item">
          <FiClock />
          <span>{formatDate(message.event.start)}</span>
          {message.event.end && <span> - {formatDate(message.event.end)}</span>}
        </div>

        {message.event.location && (
          <div className="detail-item">
            <FiMapPin />
            <span>{message.event.location}</span>
          </div>
        )}

        {message.event.participants.length > 0 && (
          <div className="detail-item">
            <FiUsers />
            <span>{message.event.participants.length} участников</span>
          </div>
        )}
      </div>

      <button className="add-calendar-btn" onClick={(e) => {
        e.stopPropagation();
        onAddToCalendar();
      }}>
        <FiCalendar /> Добавить в календарь
      </button>
    </div>
  );
};

export default EventMessage;