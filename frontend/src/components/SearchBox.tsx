import React, { useState, useContext } from 'react';
import { Search, MapPin } from 'lucide-react';
import WeatherContext from '../context/WeatherContext';

const SearchBox: React.FC = () => {
  const [city, setCity] = useState('');
  const { getWeatherByCity, getWeatherByCoordinates, loading } = useContext(WeatherContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      getWeatherByCity(city);
      setCity('');
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location. Please allow location access or search by city name.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search for a city..."
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !city.trim()}
            className={`px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors ${
              loading || !city.trim() ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            onClick={handleLocationClick}
            disabled={loading}
            className={`px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            aria-label="Use my location"
            title="Use my location"
          >
            <MapPin className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBox;