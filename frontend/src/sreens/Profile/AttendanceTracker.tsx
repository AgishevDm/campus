import { useEffect, useState, useCallback } from 'react';
import { FiCheck, FiX, FiZap, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { BiSleepy } from 'react-icons/bi';
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

const getDaysRange = (startDate: Date, count: number) => {
  const days = [] as Date[];
  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push(date);
  }
  return days;
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
  const [days, setDays] = useState<Date[]>([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const today = new Date();
  const [periodStart, setPeriodStart] = useState(() => {
    const start = new Date();
    start.setDate(today.getDate() - 12);
    return start;
  });

  useEffect(() => {
    setDays(getDaysRange(periodStart, 24));
  }, [periodStart]);

  const loadAttendanceData = useCallback(() => {
    const savedAttendance = localStorage.getItem('attendance');
    const savedStreak = localStorage.getItem('attendanceStreak');

    if (savedAttendance) {
      setAttendance(JSON.parse(savedAttendance));
    }

    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    } else {
      localStorage.setItem('attendanceStreak', '40');
      setStreak(40);
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
      const currentWeekKeys = days.map(d => d.toDateString());
      const missedDays = currentWeekKeys.filter(key => 
        !attendance[key] && !isSameDay(new Date(key), today)
      ).length;
      
      if (missedDays > MAX_MISSED_DAYS) {
        setStreak(0);
        localStorage.setItem('attendanceStreak', '0');
      }
    }
  }, [attendance, streak, days, today]);

  useEffect(() => {
    const start = new Date();
    start.setDate(today.getDate() - 12);
    setPeriodStart(start);
    if (!localStorage.getItem('attendance')) {
      const mock: Record<string, boolean> = {};
      getDaysRange(start, 24).forEach((d) => {
        if (d <= today && d.getDay() !== 6 && d.getDay() !== 0) {
          mock[d.toDateString()] = Math.random() < 0.8;
        }
      });
      setAttendance(mock);
    }
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
    return () => {
      clearInterval(interval);
    };
  }, [loadAttendanceData, saveAttendanceData, attendance, today]);



  const handlePrevWeek = () => {
    setPeriodStart((prev) => {
      const d = new Date(prev);
      d.setDate(prev.getDate() - 24);
      return d;
    });
  };

  const handleNextWeek = () => {
    setPeriodStart((prev) => {
      const d = new Date(prev);
      d.setDate(prev.getDate() + 24);
      return d;
    });
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
          {days.map((date) => {
            const isWeekend = date.getDay() === 6 || date.getDay() === 0;
            const isToday = isSameDay(date, today);
            const isPresent = attendance[date.toDateString()] || false;
            const isFuture = date > today;
            
            return (
              <div 
                key={date.toString()} 
                className={`attendance-day ${isWeekend ? 'weekend' : ''} ${isToday ? 'today' : ''} ${isFuture ? 'future' : ''}`}
              >
                <div className="day-date">{formatDate(date)}</div>
                <div className="day-label">
                  {['Вс','Пн','Вт','Ср','Чт','Пт','Сб'][date.getDay()]}
                </div>
                {isWeekend ? (
                  <div className="day-status weekend-status">
                    <BiSleepy />
                    <div className="weekend-tooltip">Суббота и воскресенье - дни отдыха</div>
                  </div>
                ) : (
                  <div className={`day-status ${isPresent ? 'present' : 'absent'}`}> 
                    {isPresent ? <FiCheck /> : <FiX />}
                  </div>
                )}
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
        {Object.keys(attendance).filter(key => !attendance[key]).length > MAX_MISSED_DAYS && (
          <div className="warning">Вы пропустили более {MAX_MISSED_DAYS} дней на этой неделе!</div>
        )}
      </div>
    </div>
  );
};

export default AttendanceTracker
