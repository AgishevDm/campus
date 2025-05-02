import { useState, useEffect } from 'react';
import { 
  format, 
  getDay,
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay,
  parseISO,
  eachDayOfInterval,
  addDays,
  addMonths,
  addYears,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  getYear,
  startOfDay,
  startOfToday,
  Locale,
  getWeek,
  getMonth
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { useSwipeable } from 'react-swipeable';
import { FiPlus, FiAlertCircle, FiCheck, FiTrash2, FiEdit, FiLink, FiX, FiChevronLeft, FiChevronRight, FiList  } from 'react-icons/fi';
import './Calendar.scss';
import { NotesModal } from './NotesModal';
import { url } from 'inspector';

type Note = {
  id: string;
  title: string;
  content: NoteItem[];
  createdAt: string;
};

type NoteItem = {
  id: string;
  text: string;
  checked: boolean;
};

type Event = {
  id: string;
  eventName: string;
  description: string;
  location: string;
  startEvent: string;
  endEvent?: string;
  color: string;
  isRecurring: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly';
  recurrenceEndDate?: string;
  reminders?: string[];
};

type ViewMode = 'day' | 'week' | 'month' | 'year';

const colors = [
  '#FF3B30',    // красный 
  '#FFD700',    // желтый
  '#34C759',    // зелёный
  '#00CED1',    // голубой
  '#007AFF',    // синий
  '#9B59B6',    // фиолетовый
  '#FF94C2',    // розовый
  '#808000',    // оливковый
  '#808080',    // серый
  '#030303'     // чёрный
];

const generateRecurringEvents = (baseEvent: Event): Event[] => {
  const events: Event[] = [];
  const startDate = new Date(baseEvent.startEvent);
  const endDate = new Date(baseEvent.recurrenceEndDate || baseEvent.startEvent);
  let currentDate = new Date(startDate);

  switch (baseEvent.recurrencePattern) {
    case 'daily':
      currentDate.setDate(currentDate.getDate() + 1);
      break;
    case 'weekly':
      currentDate.setDate(currentDate.getDate() + 7);
      break;
    case 'monthly':
      currentDate.setMonth(currentDate.getMonth() + 1);
      break;
    default:
      return [];
  }

  while (currentDate <= endDate) {
    const newEvent: Event = {
      ...baseEvent,
      id: Math.random().toString(36).substr(2, 9),
      startEvent: currentDate.toISOString(),
    };

    if (baseEvent.endEvent) {
      const duration = new Date(baseEvent.endEvent).getTime() - startDate.getTime();
      newEvent.endEvent = new Date(currentDate.getTime() + duration).toISOString();
    }

    events.push(newEvent);

    switch (baseEvent.recurrencePattern) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
    }
  }
  return events;
};

export default function Calendar() {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(startOfToday());
  const [events, setEvents] = useState<Event[]>([
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncLink, setSyncLink] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notification, setNotification] = useState({
    message: '',
    isError: false
  });
  const [inputError, setInputError] = useState('');
  const [isCalendarAdded, setIsCalendarAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isClosing, setIsClosing] = useState(false);

  // Сохраняем ссылку при закрытии модалки
  useEffect(() => {
    if (!isSyncModalOpen) return;
    setInputError('');
  }, [isSyncModalOpen]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNavigation(1),
    onSwipedRight: () => handleNavigation(-1),
    trackMouse: true
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
      if (!token) {
        throw new Error('Токен отсутствует');
      }
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/events/getAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Ошибка при загрузке ивентов');
        }

        const { formattedEvents, etisUrl } = await response.json();
        setEvents(formattedEvents);
        setSyncLink(etisUrl);
      } catch (error) {
        console.error('Ошибка:', error);
      }
    };

    fetchUsers();
  }, []);

  const validateUrl = (url: string) => {
    const pattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/;
    return pattern.test(url);
  };

  const handleAddLink = async () => {
    const trimmedUrl = syncLink.trim();

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      throw new Error('Токен отсутствует');
    }
  
    if (!validateUrl(trimmedUrl)) {
      setInputError('Введите корректный URL (пример: https://ical.psu.ru/calendars');
      return;
    }

    setIsLoading(true)
    setIsClosing(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/etis/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sheduleEtis: trimmedUrl }),
      });
  
      if (!response.ok) {
        throw new Error('Ошибка синхронизации');
      }

      const eventsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/etis/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const etisEvents = await eventsResponse.json();
      setEvents([...events, ...etisEvents]);
      
      setNotification({
        message: 'Расписание успешно подключено!',
        isError: false
      });
      
      setIsCalendarAdded(true);
      setIsSyncModalOpen(false);

    } catch (error) {
      setNotification({
        message: 'Ошибка подключения расписания',
        isError: true
      });
    } finally {
      setTimeout(() => {
        setIsSyncModalOpen(false);
        setIsClosing(false);
        setIsLoading(false);
      }, 300);
    }

    setIsNotificationOpen(true);
    setTimeout(() => setIsNotificationOpen(false), 3000);
  };


  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    setCurrentDate(startOfToday());
  };

  const handleNavigation = (direction: number) => {
    switch(viewMode) {
      case 'day': 
        setCurrentDate(addDays(currentDate, direction));
        break;
      case 'week':
        setCurrentDate(addDays(currentDate, direction * 7));
        break;
      case 'month':
        setCurrentDate(addMonths(currentDate, direction));
        break;
      case 'year':
        setCurrentDate(addYears(currentDate, direction));
        break;
    }
  };

  const handleEventOpen = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    setIsEditing(false);
  };


  const handleClearEtisLink = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
    if (!token) {
      throw new Error('Токен отсутствует');
    }

    if (!window.confirm('Вы уверены, что хотите удалить календарь ETIS? Все связанные события будут удалены.')) {
      return;
    }

    try {
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/etis/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при удалении');
      }

      const allEventsresponse = await fetch(`${process.env.REACT_APP_API_URL}/api/events/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке ивентов');
      }

      const { formattedEvents } = await allEventsresponse.json();
      setEvents(formattedEvents);
      setSyncLink('');
      setIsCalendarAdded(false);
      setInputError('');
    } catch (err) {
      console.error('Delete ETIS error:', err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
    if (!token) {
      throw new Error('Токен отсутствует');
    }

    const isConfirmed = window.confirm('Вы уверены, что хотите удалить событие?');
    if (!isConfirmed) return;
  
    try {
      await deleteEventOnBackend(id, token);
  
      setEvents(events.filter(event => event.id !== id));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleSaveEvent = async (updatedEvent: Event) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) throw new Error('Токен отсутствует');
  
      let savedEvent: Event;
      let eventsToUpdate: Event[] = [];
  
      if (updatedEvent.id) {
        // Обновление существующего события
        savedEvent = await updateEventOnBackend(updatedEvent, token);
        setEvents(prev => prev.map(e => e.id === savedEvent.id ? savedEvent : e));
        setSelectedEvent(savedEvent); 
      } else {
        // Создание нового события
        savedEvent = await saveEventToBackend(updatedEvent, token);
        setEvents(prev => [...prev, savedEvent]);
        
        // Генерация повторяющихся событий для нового события
        if (updatedEvent.isRecurring && updatedEvent.recurrencePattern && updatedEvent.recurrenceEndDate) {
          const recurringEvents = generateRecurringEvents(updatedEvent);
          const savedRecurring = await Promise.all(
            recurringEvents.map(event => saveEventToBackend(event, token))
          );
          eventsToUpdate = [...eventsToUpdate, ...savedRecurring];
        }
      }
  
      const updatedEvents = await fetchUpdatedEvents(token);
      setEvents(updatedEvents);
  
      setIsModalOpen(false);
      setIsEditing(false);
      setSelectedEvent(null);

      setNotification({
        message: updatedEvent.id 
          ? 'Событие успешно обновлено!' 
          : 'Событие успешно создано!',
        isError: false
      });
      setIsNotificationOpen(true);
  
    } catch (error) {
      console.error('Ошибка сохранения события:', error);
      setNotification({
        message: updatedEvent.id 
          ? 'Ошибка обновления события' 
          : 'Ошибка создания события',
        isError: true
      });
      setIsNotificationOpen(true);
    } finally {
      setTimeout(() => setIsNotificationOpen(false), 3000);
    }
  };
  
  // Вспомогательная функция для получения актуальных событий
  const fetchUpdatedEvents = async (token: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/events/getAll`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Ошибка обновления данных');
      
      const { formattedEvents } = await response.json();
      return formattedEvents.map((event: Event) => ({
        ...event,
        startEvent: new Date(event.startEvent).toISOString(),
        endEvent: event.endEvent ? new Date(event.endEvent).toISOString() : undefined
      }));
      
    } catch (error) {
      console.error('Ошибка получения событий:', error);
      return events;
    }
  };

  const saveEventToBackend = async (event: Event, token: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/events/createEvent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          eventName: event.eventName,
          startEvent: event.startEvent,
          location: event.location,
          remindTime: null,
          isRecurring: false,
          patternRecurring: null,
          description: event.description,
          eventType: 'custom',
          color: event.color
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save event');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error saving event:', error);
      throw error;
    }
  };

  const updateEventOnBackend = async (event: Event, token: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/events/updateEvent/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventName: event.eventName,
          startEvent: event.startEvent,
          location: event.location,
          description: event.description,
          color: event.color,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update event');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const deleteEventOnBackend = async (id: string, token: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/events/deleteEvent/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  const CurrentTimeMarker = ({ currentDate }: { currentDate: Date }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 60000);
      return () => clearInterval(timer);
    }, []);
  
    if (!isSameDay(currentDate, currentTime)) return null;
  
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const topPosition = ((hours + minutes / 70) * 60); 
  
    return (
      <div 
        className="current-time-marker" 
        style={{ top: `${topPosition}px` }}
      >
        <div className="marker-line" />
        <div className="time-label">
          {format(currentTime, 'HH:mm')}
        </div>
      </div>
    );
  };

  const renderHeader = () => {
    switch(viewMode) {
      case 'day': return format(currentDate, 'd MMMM yyyy', { locale: ru });
      case 'week': return `${format(currentDate, 'LLLL yyyy', { locale: ru })}`;
      case 'month': return format(currentDate, 'LLLL yyyy', { locale: ru }); 
      case 'year': return format(currentDate, 'yyyy', { locale: ru });
    }
  };

  const renderDayView = () => {
    const dayEvents = events.filter(e => isSameDay(parseISO(e.startEvent), currentDate));
    
    return (
      <div className="day-view">
         {/* Десктопная версия */}
        <div className="desktop-day">
        <CurrentTimeMarker currentDate={currentDate} />
          <div className="timeline">
            {Array.from({ length: 24 }).map((_, hour) => (
              <div key={hour} className="hour-block">
                <div className="time-marker">{`${hour}:00`}</div>
                <div className="events-column">
                  {dayEvents
                    .filter(e => parseISO(e.startEvent).getHours() === hour)
                    .map(event => (
                      <MobileEventCard 
                        key={event.id} 
                        event={event}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventOpen(event);
                        }}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
         {/* Мобильная версия */}
        <div className="mobile-day">
          {dayEvents.map(event => (
            <MobileEventCard 
              key={event.id} 
              event={event}
              onClick={(e) => {
                e.stopPropagation();
                handleEventOpen(event);
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = eachDayOfInterval({
      start: startOfWeek(currentDate, { weekStartsOn: 1 }),
      end: endOfWeek(currentDate, { weekStartsOn: 1 })
    });
    

    return (
      <div className="week-view">
         {/* Десктопная версия */}
        <div className="desktop-week">
          <div className="week-header">
          {weekDays.map(day => {
            const isToday = isSameDay(day, new Date());
            return (
              <div 
                key={day.toString()} 
                className={`day-header ${isToday ? 'today' : ''}`}
                onClick={() => {
                  setCurrentDate(day);
                  setViewMode('day');
                }}
              >
                <div>{format(day, 'EEEEEE', { locale: ru })}</div>
                <div className="day-number">{format(day, 'd', { locale: ru })}</div>
               </div>
              );
            })}
          </div>
          <div className="week-grid">
            {weekDays.map(day => {
              const isToday = isSameDay(day, new Date());
              return (
                <div 
                  key={day.toString()}
                  className={`day-column ${isToday ? 'today' : ''}`}
                  onClick={() => {
                    setCurrentDate(day);
                    setViewMode('day');
                  }}
                >
                  {events
                    .filter(e => isSameDay(parseISO(e.startEvent), day))
                    .map(event => (
                      <EventCard 
                        key={event.id} 
                        event={event}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventOpen(event);
                        }}
                      />
                    ))}
                </div>
              );
            })}
          </div>
        </div>

         {/* Мобильная версия */}
        <div className="mobile-week">
          {weekDays.map(day => (
            <div 
              key={day.toString()} 
              className="mobile-day-card"
              onClick={() => {
                setCurrentDate(day);
                setViewMode('day');
              }}
            >
              <div className="day-header">
                {format(day, 'EEEE, d MMMM', { locale: ru })}
              </div>
              <div className="events-list">
                {events
                  .filter(e => isSameDay(parseISO(e.startEvent), day))
                  .map(event => (
                    <MobileEventCard 
                      key={event.id} 
                      event={event}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventOpen(event);
                      }}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
  
    const startDate = startOfWeek(monthStart, { 
      weekStartsOn: 1,
      locale: ru 
    });
  
    const endDate = endOfWeek(monthEnd, { 
      weekStartsOn: 1,
      locale: ru 
    });
  
    const days = eachDayOfInterval({ start: startDate, end: endDate });
  
    return (
      <div className="month-view">
        {/* Десктопная версия */}
        <div className="desktop-month">
          <div className="week-days-header">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
              <div key={day} className="week-day">{day}</div>
            ))}
          </div>
          
          <div className="days-grid">
            {days.map(day => {
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isToday = isSameDay(day, new Date());
              const dayEvents = events.filter(e => isSameDay(parseISO(e.startEvent), day));
  
              return (
                <div 
                  key={day.toString()}
                  className={`day-cell 
                    ${!isCurrentMonth ? 'other-month' : ''} 
                    ${isToday ? 'today' : ''}`}
                  onClick={() => {
                    setCurrentDate(day);
                    setViewMode('week');
                  }}
                >
                  <div className="day-number">
                    {format(day, 'd', { locale: ru })}
                    {isToday && <span className="today-marker"></span>}
                  </div>
                  
                  <div className="events-container">
                    {dayEvents.map(event => (
                      <MiniEventCard 
                        key={event.id} 
                        event={event}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventOpen(event);
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
  
        {/* Мобильная версия */}
        <div className="mobile-month">
          <div className="week-days-header">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
              <div key={day} className="week-day">{day}</div>
            ))}
          </div>
          
          <div className="days-grid">
            {days.map(day => {
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isToday = isSameDay(day, new Date());
              return (
                <div 
                  key={day.toString()}
                  className={`day-cell 
                    ${!isCurrentMonth ? 'other-month' : ''} 
                    ${isToday ? 'today' : ''}`}
                  onClick={() => {
                    setCurrentDate(day);
                    setViewMode('week');
                  }}
                >
                  <div className="day-number">
                    {format(day, 'd', { locale: ru })}
                    {isToday && <span className="today-marker"></span>}
                  </div>
                  
                  <div className="mobile-events-container">
                    {events
                      .filter(e => isSameDay(parseISO(e.startEvent), day))
                      .map(event => (
                        <MobileMiniEvent
                          key={event.id}
                          event={event}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventOpen(event);
                          }}
                        />
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const months = eachMonthOfInterval({
      start: new Date(getYear(currentDate), 0, 1),
      end: new Date(getYear(currentDate), 11, 31)
    });
  
    return (
      <div className="year-view">
        <div className="grid">
          {months.map(month => {
            const monthStart = startOfMonth(month);
            const monthEnd = endOfMonth(month);
            const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
            
            const startWeekday = getDay(monthStart) === 0 ? 6 : getDay(monthStart) - 1;
            const totalCells = Math.ceil((days.length + startWeekday) / 7) * 7;
  
            return (
              <div 
                key={month.toString()}
                className="month-cell"
                onClick={() => {
                  setCurrentDate(month);
                  setViewMode('month');
                }}
              >
                <div className="month-name">{format(month, 'LLLL', { locale: ru })}</div>
                <div className="mini-calendar">
                  {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                    <div key={day} className="mini-week-day">{day}</div>
                  ))}
                  
                  {Array.from({ length: startWeekday }).map((_, i) => (
                    <div key={`empty-before-${i}`} className="mini-day empty-cell" />
                  ))}
                  
                  {days.map(day => {
                    const hasEvents = events.some(e => isSameDay(parseISO(e.startEvent), day));
                    
                    return (
                      <div
                        key={day.toString()}
                        className={`mini-day ${isSameDay(day, new Date()) ? 'today' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentDate(day);
                          setViewMode('week');
                        }}
                      >
                      
                       <div className="day-content">
                       <span>{format(day, 'd')}</span>
                       {hasEvents && <div 
                            className="mini-event-marker"
                            style={{ backgroundColor: events.find(e => isSameDay(parseISO(e.startEvent), day))?.color }}
                          />}
                     </div>
                   </div>
                    );
                  })}
  
                  {Array.from({ length: totalCells - days.length - startWeekday }).map((_, i) => (
                    <div key={`empty-after-${i}`} className="mini-day empty-cell" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-container" {...swipeHandlers}>
        <div className="calendar-header-wrapper">
        <h1>Календарь</h1>
        
        <div className="header-buttons">
          <button 
            className="notes-button"
            onClick={() => setIsNotesOpen(true)}
          >
            <FiList />
          </button>
          
          <button 
            className="sync-button add-event-button"
            onClick={() => {
              setIsModalOpen(true);
              setSelectedEvent({
                id: '',
                eventName: '',
                description: '',
                location: '',
                startEvent: currentDate.toISOString(),
                color: colors[0],
                isRecurring: false,
                reminders: []
              });
              setIsEditing(true);
            }}
          >
            <FiPlus />
          </button>

          {isLoading ? (
            <div className="loader" />
          ) : (
            <button 
              className={`sync-button ${isCalendarAdded ? 'synced' : ''}`}
              onClick={() => setIsSyncModalOpen(true)}
            >
              <FiLink />
            </button>
          )}
        </div>
      </div>

      {isNotesOpen && (
        <NotesModal 
          isOpen={isNotesOpen}
          onClose={() => setIsNotesOpen(false)}
          onSave={setNotes}
        />
      )}

      {/* Модальное окно синхронизации */}
      {isSyncModalOpen && (
        <div className={`modal-overlay_calendar ${isClosing ? 'closing' : ''}`}>
          <div className="sync-modal">
            <div className="modal-header_sync">
              <h3>Синхронизировать расписание</h3>
              <button className="close-btn" onClick={() => setIsSyncModalOpen(false)}>
                <FiX />
              </button>
            </div>
            <text>(Синхронизация может занять некоторое время из-за особенностей ЕТИСа, если 
              в течении минуты синхронизация не прошла, попробуйте подождать около 10 минут)</text>
            <div className="sync-form">
              <div className="input-group">
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={syncLink}
                    onChange={(e) => {
                      setSyncLink(e.target.value);
                      setInputError('');
                    }}
                    className={`sync-input ${inputError ? 'error' : ''}`}
                  />
                  {syncLink && (
                    <button className="delete-icon" onClick={handleClearEtisLink}>
                      <FiTrash2 />
                    </button>
                  )}
                </div>
                <button
                  className="sync-add-btn"
                  onClick={handleAddLink}
                  disabled={!syncLink || isCalendarAdded}
                >
                  {isCalendarAdded ? 'Добавлено' : 'Добавить'}
                </button>
              </div>
              {inputError && <div className="input-error">{inputError}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Уведомление */}
      {isNotificationOpen && (
        <div className="notification-modal">
          <div className={`notification-content ${notification.isError ? 'error' : 'success'}`}>
            <div className="icon-wrapper">
              {notification.isError ? (
                <FiAlertCircle className="notification-icon" />
              ) : (
                <div className="success-icon">
                  <FiCheck />
                </div>
              )}
            </div>
            {notification.message}
          </div>
        </div>
      )}

      <div className="controls">
        <div className="view-switcher">
          {(['day', 'week', 'month', 'year'] as const).map(mode => (
            <button
              key={mode}
              className={viewMode === mode ? 'active' : ''}
              onClick={() => handleViewChange(mode)}
            >
              {{ day: 'День', week: 'Неделя', month: 'Месяц', year: 'Год' }[mode]}
            </button>
          ))}
        </div>
        
        <div className="navigation-container">
          <div className="navigation_1">
            <button onClick={() => handleNavigation(-1)}>
              <FiChevronLeft />
            </button>
            <div className="current-period">{renderHeader()}</div>
            <button onClick={() => handleNavigation(1)}>
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'day' && renderDayView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'year' && renderYearView()}

      {isModalOpen && (
  <>
    {/* Desktop версия */}
    <div className="desktop-modal-overlay" onClick={() => setIsModalOpen(false)}>
      <div className="desktop-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setIsModalOpen(false)}>
          <FiX />
        </button>
        {isEditing ? (
          <EditEventForm 
            event={selectedEvent || {
              id: '',
              eventName: '',
              description: '',
              location: '',
              startEvent: new Date().toISOString(),
              color: colors[0],
              isRecurring: false,
              reminders: []
            }}
            colors={colors}
            onSave={handleSaveEvent}
            onCancel={() => setIsModalOpen(false)}
          />
        ) : (
          <EventDetails 
            event={selectedEvent!}
            onEdit={() => setIsEditing(true)}
            onDelete={handleDeleteEvent}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>

    {/* Mobile версия */}
    <div className="mobile-modal-overlay" onClick={() => setIsModalOpen(false)}>
      <div 
        className={`mobile-modal ${isModalOpen ? 'open' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="handle-bar" />
        {isEditing ? (
          <EditEventForm 
            event={selectedEvent || {
              id: '',
              eventName: '',
              description: '',
              location: '',
              startEvent: new Date().toISOString(),
              color: colors[0],
              isRecurring: false,
              reminders: []
            }}
            colors={colors}
            onSave={handleSaveEvent}
            onCancel={() => setIsModalOpen(false)}
          />
        ) : (
          <EventDetails 
            event={selectedEvent!}
            onEdit={() => setIsEditing(true)}
            onDelete={handleDeleteEvent}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  </>
)}
    </div>
  );
}

// Вспомогательные компоненты
const EventCard = ({ 
  event, 
  onClick 
}: { 
  event: Event; 
  onClick: (e: React.MouseEvent) => void 
}) => (
  <div 
    className="event-card" 
    onClick={onClick}
    style={{ borderLeft: `4px solid ${event.color}` }}
  >
    <div className="event-time">{format(parseISO(event.startEvent), 'HH:mm')}</div>
    <h4 className="event-title">{event.eventName}</h4>
    <div className="event-location">{event.location}</div>
  </div>
);

const MobileEventCard = ({ 
  event, 
  onClick 
}: { 
  event: Event; 
  onClick: (e: React.MouseEvent) => void 
}) => (
  <div 
    className="mobile-event-card"
    onClick={onClick}
    style={{ borderLeft: `4px solid ${event.color}` }}
  >
    <div className="event-header">
      <div className="event-time">{format(parseISO(event.startEvent), 'HH:mm')}</div>
    </div>
    
    <div className="event-body">
      <h4 className="event-title">{event.eventName}</h4>
      {event.description && (
        <p className="event-description">{event.description}</p>
      )}
       <div className="event-location">{event.location}</div>
    </div>
  </div>
);

const MiniEventCard = ({ 
  event, 
  onClick 
}: { 
  event: Event; 
  onClick: (e: React.MouseEvent) => void 
}) => (
  <div 
    className="mini-event"
    onClick={onClick}
    style={{ borderLeft: `4px solid ${event.color}` }}
  >
    <span className="event-time">{format(parseISO(event.startEvent), 'HH:mm')}</span>
    <div className="event-title">{event.eventName.slice(0, 15)}{event.eventName.length > 15 && '...'}</div>
  </div>
);

const MobileMiniEvent = ({ 
  event, 
  onClick 
}: { 
  event: Event; 
  onClick: (e: React.MouseEvent) => void 
}) => (
  <div 
    className="mobile-mini-event"
    onClick={onClick}
    style={{ borderLeft: `3px solid ${event.color}` }}
  >
    <div className="event-time">{format(parseISO(event.startEvent), 'HH:mm')}</div>
    <div className="event-title">{event.eventName}</div>
  </div>
);

const EventDetails = ({ 
  event,
  onEdit,
  onDelete,
  onClose 
}: {
  event: Event;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) => {
  const [timeStatus, setTimeStatus] = useState<{
    text: string;
    type: 'future' | 'current' | 'past';
  }>({ text: '', type: 'future' });

  const calculateTimeStatus = (): { text: string; type: 'future' | 'current' | 'past' } => {
    const now = new Date();
    const start = new Date(event.startEvent);
    
    let end = event.endEvent ? new Date(event.endEvent) : null;
    
    if (!end) {
      end = new Date(start);
      end.setHours(23, 59, 59, 999);
    }

    if (now > end) {
      return { text: 'Завершено', type: 'past' };
    }
    
    if (now >= start && now <= end) {
      return { text: 'Началось', type: 'current' };
    }

    const difference = start.getTime() - now.getTime();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    return {
      text: days > 0 
        ? `${days}д ${hours}ч ${minutes}м` 
        : `${hours}ч ${minutes}м`,
      type: 'future'
    };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStatus(calculateTimeStatus());
    }, 60000);

    setTimeStatus(calculateTimeStatus());
    
    return () => clearInterval(timer);
  }, [event.startEvent, event.endEvent]);

  return (
    <div className="modal-content">
      <button className="close-btn" onClick={onClose}>
        <FiX />
      </button>
      
      <h2 className="modal-title">{event.eventName}</h2>
      
      <div className="event-details">
        <div className="detail-item status-item">
          <label>
            {timeStatus.type === 'future' 
              ? "До события осталось:" 
              : "Статус события:"}
          </label>
          <span className={`status-text ${timeStatus.type}`}>
            {timeStatus.text}
          </span>
        </div>

        <div className="detail-item">
          <label>Дата и время начала:</label>
          <span>
            {format(parseISO(event.startEvent), 'd MMMM yyyy, HH:mm', { locale: ru })}
          </span>
        </div>

        {event.endEvent && (
          <div className="detail-item">
            <label>Дата и время окончания:</label>
            <span>
              {format(parseISO(event.endEvent), 'd MMMM yyyy, HH:mm', { locale: ru })}
            </span>
          </div>
        )}

        {event.location && (
          <div className="detail-item">
            <label>Место проведения:</label>
            <span>{event.location}</span>
          </div>
        )}

        {event.description && (
          <div className="detail-item">
            <label>Описание события:</label>
            <p className="description-text">{event.description}</p>
          </div>
        )}
      </div>

      <div className="actions">
        <button className="edit-btn" onClick={onEdit}>
          <FiEdit /> Редактировать
        </button>
        <button className="delete-btn" onClick={() => onDelete(event.id)}>
          <FiTrash2 /> Удалить
        </button>
      </div>
    </div>
  );
};

const EditEventForm = ({
  event,
  colors,
  onSave,
  onCancel
}: {
  event: Event;
  colors: string[];
  onSave: (updatedEvent: Event) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<Event>(() => {
    const safeParseDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
      } catch {
        return new Date().toISOString();
      }
    };

    return {
      ...event,
      startEvent: event.startEvent ? safeParseDate(event.startEvent) : new Date().toISOString(),
      endEvent: event.endEvent ? safeParseDate(event.endEvent) : '',
      reminders: event.reminders?.length ? event.reminders : [],
      recurrenceEndDate: event.recurrenceEndDate || '',
      recurrencePattern: event.recurrencePattern || 'daily',
      isRecurring: event.isRecurring || false,
      color: event.color || colors[0]
    };
  });

  const [reminderTime, setReminderTime] = useState('00:00');
  const [dateError, setDateError] = useState('');

  const toLocalISOString = (date: Date) => {
    if (isNaN(date.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const handleDateChange = (type: 'start' | 'end' | 'recurrence', value: string) => {
    try {
      let newDate: Date;
      
      if (!value) {
        newDate = new Date();
      } else {
        newDate = new Date(value);
        if (isNaN(newDate.getTime())) throw new Error('Invalid date');
      }

      const isoString = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}T${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}`;
  
      setFormData(prev => ({
        ...prev,
        ...(type === 'start' && { 
          startEvent: isoString,
          endEvent: prev.endEvent && new Date(prev.endEvent) < newDate ? '' : prev.endEvent 
        }),
        ...(type === 'end' && { 
          endEvent: isoString,
          ...(new Date(isoString) < new Date(prev.startEvent) ? { endEvent: '' } : {} 
      )}),
        ...(type === 'recurrence' && { recurrenceEndDate: isoString })
      }));
      
      setDateError('');
    }  catch (error) {
      setDateError('Некорректный формат даты');

      const now = new Date().toISOString();
      setFormData(prev => ({
        ...prev,
        startEvent: type === 'start' ? now : prev.startEvent,
        endEvent: type === 'end' ? '' : prev.endEvent
      }));
    }
  };

  const handleAddReminder = () => {
    if (reminderTime && (formData.reminders?.length || 0) < 3) {
      const [hours, minutes] = reminderTime.split(':');
      const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      
      if (!formData.reminders?.includes(formattedTime)) {
        setFormData(prev => ({
          ...prev,
          reminders: [...(prev.reminders || []), formattedTime]
        }));
        setReminderTime('');
      }
    }
  };

  const handleRemoveReminder = (index: number) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const startDate = new Date(formData.startEvent);
      const endDate = formData.endEvent ? new Date(formData.endEvent) : null;

      if (endDate && endDate <= startDate) {
        setDateError('Время окончания не может быть раньше начала');
        return;
      }

      const processedEvent: Event = {
        ...formData,
        startEvent: startDate.toISOString(),
        endEvent: endDate ? endDate.toISOString() : undefined,
        recurrenceEndDate: formData.isRecurring && formData.recurrenceEndDate 
          ? new Date(formData.recurrenceEndDate).toISOString()
          : undefined,
        reminders: Array.from(new Set(formData.reminders))
          .map(t => {
            const [hours, minutes] = t.split(':');
            return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
          })
          .sort((a, b) => {
            const [ha, ma] = a.split(':').map(Number);
            const [hb, mb] = b.split(':').map(Number);
            return (ha * 60 + ma) - (hb * 60 + mb);
          })
      };

      onSave(processedEvent);
    } catch (error) {
      console.error('Form validation error:', error);
      setDateError('Проверьте корректность введенных данных');
    }
  };

  const showPicker = (id: string) => {
    const element = document.getElementById(id) as HTMLInputElement | null;
    if (element && 'showPicker' in element) {
      element.showPicker();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-content">
      <button className="close-btn" onClick={onCancel}>
        <FiX />
      </button>
      
      <h2 className="modal-title">
        {event.id ? 'Редактировать событие' : 'Новое событие'}
      </h2>

      <div className="form-content">
        <div className="form-group">
          <label>Название события *</label>
          <input
            value={formData.eventName}
            onChange={e => setFormData(prev => ({...prev, eventName: e.target.value}))}
            required
            placeholder="Введите название"
          />
        </div>

        <div 
          className="form-group clickable-field"
          onClick={() => showPicker('startDate')}
        >
          <label>Дата и время начала *</label>
          <input
            id="startDate"
            type="datetime-local"
            value={formData.startEvent ? toLocalISOString(new Date(formData.startEvent)) : ''}
            onChange={e => handleDateChange('start', e.target.value)}
            required
          />
        </div>

        <div 
          className="form-group clickable-field"
          onClick={() => showPicker('endDate')}
        >
          <label>Дата и время окончания</label>
          <input
            id="endDate"
            type="datetime-local"
            value={formData.endEvent ? toLocalISOString(new Date(formData.endEvent)) : ''}
            onChange={e => handleDateChange('end', e.target.value)}
            min={toLocalISOString(new Date(formData.startEvent))}
            disabled={!formData.startEvent}
          />
        </div>

        <div className="form-group">
          <label>Место проведения</label>
          <input
            value={formData.location}
            onChange={e => setFormData(prev => ({...prev, location: e.target.value}))}
            placeholder="Укажите место"
          />
        </div>

        <div className="form-group">
          <label>Описание</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData(prev => ({...prev, description: e.target.value}))}
            rows={3}
            placeholder="Добавьте описание"
          />
        </div>

        <div className="form-group">
        <label>Напоминания (макс. 3)</label>
        <div className="reminders-container">
          <div className="input-row">
            <input
              id="reminderTime"
              type="time"
              value={reminderTime}
              onChange={e => setReminderTime(e.target.value || '00:00')}
              onClick={() => showPicker('reminderTime')}
              step="300"
            />
            <button
              type="button"
              className="add-reminder-btn"
              onClick={handleAddReminder}
              disabled={!reminderTime || (formData.reminders?.length ?? 0) >= 3}
            >
               <FiPlus size={20} />
               </button>
            </div>
            <div className="reminders-list">
              {formData.reminders?.map((time, index) => {
                const [hours, minutes] = time.split(':').map(Number);
                const totalMinutes = hours * 60 + minutes;
                return (
                  <div key={index} className="reminder-item">
                    <span>Уведомить за {totalMinutes} мин. до начала</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveReminder(index)}
                    >
                      <FiX />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="switch-label">
            <span>Повторяющееся событие</span>
            <input
              type="checkbox"
              checked={formData.isRecurring}
              onChange={e => setFormData(prev => ({
                ...prev,
                isRecurring: e.target.checked,
                recurrencePattern: e.target.checked ? 'daily' : undefined,
                recurrenceEndDate: e.target.checked 
                  ? new Date(formData.startEvent).toISOString()
                  : undefined
              }))}
            />
          </label>

          {formData.isRecurring && (
            <div className="recurrence-options">
              <div className="form-group">
                <label>Период повторения</label>
                <select
                  value={formData.recurrencePattern}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    recurrencePattern: e.target.value as any
                  }))}
                >
                  <option value="daily">Каждый день</option>
                  <option value="weekly">Каждую неделю</option>
                  <option value="monthly">Каждый месяц</option>
                </select>
              </div>

              <div 
                className="form-group clickable-field"
                onClick={() => showPicker('recurrenceEnd')}
              >
                <label>Дата окончания повтора</label>
                <input
                  id="recurrenceEnd"
                  type="date"
                  value={formData.recurrenceEndDate?.slice(0, 10) || ''}
                  onChange={e => handleDateChange('recurrence', e.target.value)}
                  min={formData.startEvent.slice(0, 10)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Цвет маркера</label>
          <div className="color-picker">
            {colors.map(color => (
              <button
                key={color}
                type="button"
                className={`color-option ${formData.color === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setFormData(prev => ({ ...prev, color }))}
              />
            ))}
          </div>
        </div>

        {dateError && <div className="input-error">{dateError}</div>}

        <div className="form-actions">
          <button 
            type="button"
            className="cancel-btn"
            onClick={onCancel}
          >
            Отмена
          </button>
          <button 
            type="submit" 
            className="save-btn"
            disabled={!formData.eventName || !formData.startEvent}
          >
            {event.id ? 'Сохранить изменения' : 'Создать событие'}
          </button>
        </div>
      </div>
    </form>
  );
};