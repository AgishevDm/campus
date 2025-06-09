import React, { useState, useEffect } from 'react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow } from 'weather-icons-react';
import './Map.scss';

interface WeatherData {
  temp: number;
  condition: string;
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const API_KEY = '0dc3d27d5123b272fe05b548daf0ce10';
  const CITY_ID = '511196';

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?id=${CITY_ID}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();
        setWeather({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].main,
        });
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!weather) return null;

  const icons: Record<string, React.ComponentType<any>> = {
    Clear: WiDaySunny,
    Clouds: WiCloudy,
    Rain: WiRain,
    Snow: WiSnow,
  };

  const descriptions: Record<string, string> = {
    Clear: 'Ясно',
    Clouds: 'Облачно',
    Rain: 'Дождь',
    Snow: 'Снег',
  };

  const Icon = icons[weather.condition] || WiDaySunny;
  const description = descriptions[weather.condition] || weather.condition;

  return (
    <div
      className={`weather-widget ${expanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => !isMobile && setExpanded(true)}
      onMouseLeave={() => !isMobile && setExpanded(false)}
      onClick={() => isMobile && setExpanded(!expanded)}
    >
      <div className="temperature">{weather.temp}°C</div>
      {expanded && (
        <>
          <Icon className="weather-icon" />
          <div className="weather-description">{description}</div>
        </>
      )}
    </div>
  );
};

export default WeatherWidget;
