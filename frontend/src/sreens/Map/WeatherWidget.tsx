import React, { useState, useEffect } from 'react';
import { FiSunrise, FiSunset, FiSun, FiMoon } from 'react-icons/fi';
import './Map.scss';

interface WeatherData {
  temp: number;
  condition: string;
  description: string;
  sunrise: number;
  sunset: number;
}

const getMoonPhase = (): string => {
  const now = new Date();
  const moonPhases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
  const cycleLength = 29.53;
  const phase = ((now.getTime() / 86400000 - 3.372) % cycleLength) / cycleLength;
  return moonPhases[Math.floor(phase * 8)];
};

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [timeOfDay, setTimeOfDay] = useState('day');
  
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
          description: data.weather[0].description,
          sunrise: data.sys.sunrise,
          sunset: data.sys.sunset
        });
        
        const now = Date.now() / 1000;
        if (now < data.sys.sunrise) setTimeOfDay('night');
        else if (now < data.sys.sunrise + 3600) setTimeOfDay('sunrise');
        else if (now < data.sys.sunset - 3600) setTimeOfDay('day');
        else if (now < data.sys.sunset) setTimeOfDay('sunset');
        else setTimeOfDay('night');
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = () => {
    if (!weather) return <FiSun className="weather-icon"/>;
    
    return {
      Clear: <FiSun className="weather-icon sun"/>,
      Clouds: <FiSun className="weather-icon cloud"/>,
      Rain: <div className="weather-icon rain"/>,
      Snow: <div className="weather-icon snow"/>
    }[weather.condition] || <FiSun className="weather-icon"/>;
  };

  if (!weather) return null;

  return (
    <div className="weather-widget">
      <div className="weather-icon-container">
        {timeOfDay === 'night' ? (
          <span className="moon-phase">{getMoonPhase()}</span>
        ) : (
          <>
            {timeOfDay === 'sunrise' && <FiSunrise className="time-icon"/>}
            {timeOfDay === 'sunset' && <FiSunset className="time-icon"/>}
            {getWeatherIcon()}
          </>
        )}
      </div>
      <div className="weather-data">
        <div className="temperature">{weather.temp}°C</div>
        <div className="weather-description">{weather.description}</div>
      </div>
    </div>
  );
};

export default WeatherWidget;