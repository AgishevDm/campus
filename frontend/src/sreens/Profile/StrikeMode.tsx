import { useState, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight, FiCheck, FiX } from 'react-icons/fi';
import { GiNightSleep } from 'react-icons/gi';
import './StrikeMode.scss';

interface AttendanceDay {
  date: Date;
  status: 'present' | 'absent' | 'weekend';
}

const generateAttendance = (days: number): AttendanceDay[] => {
  const today = new Date();
  const data: AttendanceDay[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const day = date.getDay();
    if (day === 0 || day === 6) {
      data.push({ date, status: 'weekend' });
    } else {
      // simple stub: random absence with 10% probability
      data.push({ date, status: Math.random() > 0.1 ? 'present' : 'absent' });
    }
  }
  return data;
};

const calcStreak = (attendance: AttendanceDay[]): number => {
  let streak = 0;
  for (let i = attendance.length - 1; i >= 0; i--) {
    const day = attendance[i];
    if (day.status === 'present') {
      streak++;
    } else if (day.status === 'weekend') {
      continue;
    } else {
      break;
    }
  }
  return streak;
};

export default function StrikeMode() {
  const [attendance] = useState<AttendanceDay[]>(() => generateAttendance(30));
  const [startIdx, setStartIdx] = useState(0);
  const visible = attendance.slice(startIdx, startIdx + 7);

  const streak = useMemo(() => calcStreak(attendance), [attendance]);

  const prevDisabled = startIdx === 0;
  const nextDisabled = startIdx + 7 >= attendance.length;

  const formatDate = (d: Date) =>
    d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  const formatWeekday = (d: Date) =>
    d.toLocaleDateString('ru-RU', { weekday: 'short' });

  return (
    <div className="strike-mode">
      <div className="streak-info">Ударный режим: {streak} дн. без прогулов</div>
      <div className="strike-controls">
        <button
          className="nav-btn"
          onClick={() => setStartIdx(Math.max(0, startIdx - 7))}
          disabled={prevDisabled}
        >
          <FiChevronLeft />
        </button>
        <div className="days">
          {visible.map((day, idx) => (
            <div key={idx} className="day">
              <span className="date">{formatDate(day.date)}</span>
              <span className="weekday">{formatWeekday(day.date)}</span>
              <span className={`status ${day.status}`}>
                {day.status === 'present' && <FiCheck />}
                {day.status === 'absent' && <FiX />}
                {day.status === 'weekend' && <GiNightSleep />}
              </span>
            </div>
          ))}
        </div>
        <button
          className="nav-btn"
          onClick={() => setStartIdx(Math.min(attendance.length - 7, startIdx + 7))}
          disabled={nextDisabled}
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}
