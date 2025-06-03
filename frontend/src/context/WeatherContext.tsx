import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

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
  coord: {
    lat: number;
    lon: number;
  };
  dt: number;
}

interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
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
    dt_txt: string;
  }[];
  city: {
    name: string;
    country: string;
  };
}

interface WeatherContextType {
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  loading: boolean;
  error: string | null;
  getWeatherByCoordinates: (lat: number, lon: number) => Promise<void>;
  getWeatherByCity: (city: string) => Promise<void>;
  getForecast: (lat: number, lon: number) => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType>({} as WeatherContextType);

export const WeatherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, addToSearchHistory } = useContext(AuthContext);

  const getWeatherByCoordinates = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.get(`/api/weather/coordinates?lat=${lat}&lon=${lon}`);
      setCurrentWeather(data);
      
      // Get forecast data as well
      await getForecast(lat, lon);
      
      // Add to search history if user is logged in
      if (user && data.name && data.sys.country) {
        addToSearchHistory(data.name, data.sys.country);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching weather data');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherByCity = async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.get(`/api/weather/city?city=${city}`);
      setCurrentWeather(data);
      
      // Get forecast data as well
      if (data.coord) {
        await getForecast(data.coord.lat, data.coord.lon);
      }
      
      // Add to search history if user is logged in
      if (user && data.name && data.sys.country) {
        addToSearchHistory(data.name, data.sys.country);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching weather data');
    } finally {
      setLoading(false);
    }
  };

  const getForecast = async (lat: number, lon: number) => {
    try {
      const { data } = await axios.get(`/api/weather/forecast?lat=${lat}&lon=${lon}`);
      setForecast(data);
    } catch (err: any) {
      console.error('Error fetching forecast:', err);
      // Don't set error state for forecast to avoid interrupting the main weather flow
    }
  };

  const value = {
    currentWeather,
    forecast,
    loading,
    error,
    getWeatherByCoordinates,
    getWeatherByCity,
    getForecast,
  };

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
};

export default WeatherContext;