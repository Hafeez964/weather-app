import React from 'react';
import { Clock, Droplets, Wind, Thermometer } from 'lucide-react';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  dt: number;
}

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getBackgroundClass = () => {
    const weatherId = weather.weather[0].id;
    const isDay = 
      new Date().getTime() / 1000 > weather.sys.sunrise && 
      new Date().getTime() / 1000 < weather.sys.sunset;

    // Thunderstorm
    if (weatherId >= 200 && weatherId < 300) {
      return 'from-gray-700 to-gray-900';
    }
    // Drizzle or Rain
    else if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
      return isDay ? 'from-blue-300 to-gray-500' : 'from-blue-900 to-gray-800';
    }
    // Snow
    else if (weatherId >= 600 && weatherId < 700) {
      return isDay ? 'from-blue-100 to-gray-200' : 'from-blue-800 to-gray-900';
    }
    // Atmosphere (fog, mist, etc)
    else if (weatherId >= 700 && weatherId < 800) {
      return isDay ? 'from-gray-300 to-gray-400' : 'from-gray-700 to-gray-800';
    }
    // Clear
    else if (weatherId === 800) {
      return isDay ? 'from-blue-400 to-sky-300' : 'from-blue-900 to-indigo-800';
    }
    // Clouds
    else {
      return isDay ? 'from-blue-300 to-gray-300' : 'from-blue-800 to-gray-700';
    }
  };

  const getWeatherIcon = () => {
    return `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`;
  };

  return (
    <div className={`bg-gradient-to-br ${getBackgroundClass()} rounded-xl shadow-lg overflow-hidden transition-all duration-500 text-white`}>
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-3xl font-bold">{weather.name}, {weather.sys.country}</h2>
            <p className="text-lg opacity-90">{formatDate(weather.dt)}</p>
            <p className="text-xl mt-1 capitalize">{weather.weather[0].description}</p>
          </div>
          <div className="flex flex-col items-center">
            <img 
              src={getWeatherIcon()} 
              alt={weather.weather[0].description} 
              className="w-32 h-32"
            />
            <div className="text-center">
              <div className="text-5xl font-bold">{Math.round(weather.main.temp)}°C</div>
              <p className="text-lg">Feels like: {Math.round(weather.main.feels_like)}°C</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center">
            <Thermometer className="h-6 w-6 mb-2" />
            <p className="text-sm opacity-80">Min / Max</p>
            <p className="font-medium">{Math.round(weather.main.temp_min)}° / {Math.round(weather.main.temp_max)}°</p>
          </div>
          
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center">
            <Wind className="h-6 w-6 mb-2" />
            <p className="text-sm opacity-80">Wind</p>
            <p className="font-medium">{Math.round(weather.wind.speed * 3.6)} km/h</p>
          </div>
          
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center">
            <Droplets className="h-6 w-6 mb-2" />
            <p className="text-sm opacity-80">Humidity</p>
            <p className="font-medium">{weather.main.humidity}%</p>
          </div>
          
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center">
            <Clock className="h-6 w-6 mb-2" />
            <p className="text-sm opacity-80">Sunrise / Sunset</p>
            <p className="font-medium">{formatTime(weather.sys.sunrise)} / {formatTime(weather.sys.sunset)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;