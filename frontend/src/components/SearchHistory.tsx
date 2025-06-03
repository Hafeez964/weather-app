import React, { useContext } from 'react';
import { Clock, Search } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import WeatherContext from '../context/WeatherContext';

interface SearchHistoryItem {
  city: string;
  country: string;
  timestamp: string;
}

const SearchHistory: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { getWeatherByCity } = useContext(WeatherContext);

  if (!user || user.searchHistory.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCityClick = (city: string) => {
    getWeatherByCity(city);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center mb-4">
        <Clock className="h-5 w-5 mr-2 text-blue-500" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Searches</h2>
      </div>
      
      <div className="space-y-2">
        {user.searchHistory.map((item: SearchHistoryItem, index: number) => (
          <button
            key={index}
            onClick={() => handleCityClick(item.city)}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-left"
          >
            <div className="flex items-center">
              <Search className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-800 dark:text-white font-medium">
                {item.city}, {item.country}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(item.timestamp)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;