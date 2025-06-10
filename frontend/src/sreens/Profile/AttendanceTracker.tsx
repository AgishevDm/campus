import { useEffect, useState, useRef, useCallback } from 'react';
import { FiCheck, FiX, FiZap, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './AttendanceTracker.scss';

const UNIVERSITY_COORDS = {
  lat: 58.008316,
  lng: 56.189524
};
const RADIUS_METERS = 500;
const MAX_MISSED_DAYS = 2;

const checkLocationInRadius = (lat: number, lng: number) => {
  const R = 6371000;
  const φ1 = UNIVERSITY_COORDS.lat * Math.PI/180;
  const φ2 = lat * Math.PI/180;
  const Δφ = (lat - UNIVERSITY_COORDS.lat) * Math.PI/180;
  const Δλ = (lng - UNIVERSITY_COORDS.lng) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c <= RADIUS_METERS;
};

const getWeekDates = (startDate: Date) => {
  const monday = new Date(startDate);
  monday.setDate(startDate.getDate() - (startDate.getDay() === 0 ? 6 : startDate.getDay() - 1));
  
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push(date);
  }
  
  return weekDates;
};

const formatDate = (date: Date) => {
  return date.getDate() + '.' + (date.getMonth() + 1);
};

const isSameDay = (date1: Date, date2: Date) => {
  return date1.getDate() === date2.getDate() && 
         date1.getMonth() === date2.getMonth() && 
         date1.getFullYear() === date2.getFullYear();
};

const AttendanceTracker = () => {
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [streak, setStreak] = useState(0);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  const weekDates = getWeekDates(currentWeekStart);

  const loadAttendanceData = useCallback(() => {
    const savedAttendance = localStorage.getItem('attendance');
    const savedStreak = localStorage.getItem('attendanceStreak');
    
    if (savedAttendance) {
      setAttendance(JSON.parse(savedAttendance));
    }
    
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }
  }, []);

  const saveAttendanceData = useCallback((date: Date, isPresent: boolean) => {
    const dateKey = date.toDateString();
    const newAttendance = { ...attendance, [dateKey]: isPresent };
    setAttendance(newAttendance);
    localStorage.setItem('attendance', JSON.stringify(newAttendance));

    // Update streak
    if (isPresent) {
      const yesterday = new Date(date);
      yesterday.setDate(date.getDate() - 1);
      const yesterdayKey = yesterday.toDateString();
      
      const newStreak = attendance[yesterdayKey] ? streak + 1 : 1;
      setStreak(newStreak);
      localStorage.setItem('attendanceStreak', newStreak.toString());
    } else {
      // Check if missed more than allowed
      const currentWeekKeys = weekDates.map(d => d.toDateString());
      const missedDays = currentWeekKeys.filter(key => 
        !attendance[key] && !isSameDay(new Date(key), today)
      ).length;
      
      if (missedDays > MAX_MISSED_DAYS) {
        setStreak(0);
        localStorage.setItem('attendanceStreak', '0');
      }
    }
  }, [attendance, streak, weekDates, today]);

  useEffect(() => {
    loadAttendanceData();

    const checkAttendance = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const isInUniversity = checkLocationInRadius(
              position.coords.latitude,
              position.coords.longitude
            );
            
            if (isInUniversity) {
              const todayKey = today.toDateString();
              if (!attendance[todayKey]) {
                saveAttendanceData(today, true);
                localStorage.setItem('lastAttendanceDate', todayKey);
              }
            }
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      }
    };

    checkAttendance();
    const interval = setInterval(checkAttendance, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadAttendanceData, saveAttendanceData, attendance, today]);

  const handlePrevWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      handleNextWeek();
    } else if (touchEndX - touchStartX > 50) {
      handlePrevWeek();
    }
  };

  const isCurrentWeek = weekDates.some(date => isSameDay(date, today));

  return (
    <div className="attendance-tracker">
      <div className="attendance-header">
        <h3><FiZap /> Ударный режим: {streak} дней</h3>
        <div className="attendance-subtitle">
          {streak > 0 ? 'Так держать!' : 'Начните посещать университет, чтобы запустить ударный режим'}
        </div>
      </div>
      
      <div 
        className="attendance-days-container"
        onMouseEnter={() => {
          setShowLeftArrow(true);
          setShowRightArrow(true);
        }}
        onMouseLeave={() => {
          setShowLeftArrow(false);
          setShowRightArrow(false);
        }}
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {showLeftArrow && (
          <button 
            className="nav-arrow left-arrow"
            onClick={handlePrevWeek}
          >
            <FiChevronLeft />
          </button>
        )}

        <div className="attendance-days">
          {weekDates.map((date, index) => {
            const isWeekend = index >= 5;
            const isToday = isSameDay(date, today);
            const isPresent = attendance[date.toDateString()] || false;
            
            return (
              <div 
                key={date.toString()} 
                className={`attendance-day ${isWeekend ? 'weekend' : ''} ${isToday ? 'today' : ''}`}
              >
                <div className="day-date">{formatDate(date)}</div>
                <div className="day-label">
                  {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][index]}
                </div>
                <div className={`day-status ${isPresent ? 'present' : 'absent'}`}>
                  {isPresent ? <FiCheck /> : <FiX />}
                </div>
                {isToday && <div className="today-marker">Сегодня</div>}
              </div>
            );
          })}
        </div>

        {showRightArrow && (
          <button 
            className="nav-arrow right-arrow"
            onClick={handleNextWeek}
          >
            <FiChevronRight />
          </button>
        )}
      </div>
      
      <div className="attendance-info">
        {!isCurrentWeek && (
          <button 
            className="back-to-current"
            onClick={() => setCurrentWeekStart(new Date())}
          >
            Вернуться к текущей неделе
          </button>
        )}
        {Object.keys(attendance).filter(key => !attendance[key]).length > MAX_MISSED_DAYS && (
          <div className="warning">Вы пропустили более {MAX_MISSED_DAYS} дней на этой неделе!</div>
        )}
        <div className="hint">Суббота и воскресенье - дни отдыха</div>
      </div>
    </div>
  );
};

export default AttendanceTracker;