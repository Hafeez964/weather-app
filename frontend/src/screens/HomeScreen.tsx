import React, { useContext, useEffect, useState } from 'react';
import SearchBox from '../components/SearchBox';
import WeatherCard from '../components/WeatherCard';
import WeatherForecast from '../components/WeatherForecast';
import Loader from '../components/Loader';
import Message from '../components/Message';
import SearchHistory from '../components/SearchHistory';
import WeatherContext from '../context/WeatherContext';
import AuthContext from '../context/AuthContext';

const HomeScreen: React.FC = () => {
  const { currentWeather, forecast, loading, error, getWeatherByCoordinates } = useContext(WeatherContext);
  const { user } = useContext(AuthContext);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);

  useEffect(() => {
    // Try to load default location from user preferences
    if (user?.preferences?.defaultLocation?.city) {
      // Use user's preferred location
    } else {
      // Otherwise try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setGeolocationError(null);
            getWeatherByCoordinates(latitude, longitude);
          },
          (error) => {
            let errorMessage = "Unable to get your location. Please search for a city manually.";
            if (error.code === error.PERMISSION_DENIED) {
              errorMessage = "Location access denied. Please enable location services or search for a city manually.";
            }
            setGeolocationError(errorMessage);
          }
        );
      }
    }
  }, [user, getWeatherByCoordinates]);

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          Weather Forecast
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Get real-time weather updates and forecasts for any location
        </p>
      </div>

      <SearchBox />

      {user && <SearchHistory />}

      {loading && <Loader />}

      {geolocationError && <Message variant="warning">{geolocationError}</Message>}

      {error && <Message variant="error">{error}</Message>}

      {!loading && !error && currentWeather && (
        <div className="animate-fadeIn">
          <WeatherCard weather={currentWeather} />
          
          {forecast && <WeatherForecast forecastData={forecast} />}
        </div>
      )}

      {!loading && !error && !currentWeather && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🌤️</div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome to Weather App
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Search for a city or use your current location to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;