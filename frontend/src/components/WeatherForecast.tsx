import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  dt_txt: string;
}

interface WeatherForecastProps {
  forecastData: {
    list: ForecastItem[];
    city: {
      name: string;
      country: string;
    };
  };
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecastData }) => {
  // Group forecast by day and get daily average
  const dailyData = forecastData.list.reduce((acc: { [key: string]: any }, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    
    if (!acc[date]) {
      acc[date] = {
        temps: [item.main.temp],
        humidity: [item.main.humidity],
        windSpeed: [item.wind.speed],
        icons: [item.weather[0].icon],
        descriptions: [item.weather[0].description],
      };
    } else {
      acc[date].temps.push(item.main.temp);
      acc[date].humidity.push(item.main.humidity);
      acc[date].windSpeed.push(item.wind.speed);
      acc[date].icons.push(item.weather[0].icon);
      acc[date].descriptions.push(item.weather[0].description);
    }
    
    return acc;
  }, {});

  // Calculate daily averages
  const days = Object.keys(dailyData);
  const averageTemps = days.map(day => {
    const sum = dailyData[day].temps.reduce((a: number, b: number) => a + b, 0);
    return +(sum / dailyData[day].temps.length).toFixed(1);
  });
  
  const averageHumidity = days.map(day => {
    const sum = dailyData[day].humidity.reduce((a: number, b: number) => a + b, 0);
    return Math.round(sum / dailyData[day].humidity.length);
  });
  
  const averageWindSpeed = days.map(day => {
    const sum = dailyData[day].windSpeed.reduce((a: number, b: number) => a + b, 0);
    return +(sum / dailyData[day].windSpeed.length).toFixed(1);
  });

  // Get most common weather icon for each day
  const mostCommonIcons = days.map(day => {
    const iconCounts = dailyData[day].icons.reduce((acc: { [key: string]: number }, icon: string) => {
      acc[icon] = (acc[icon] || 0) + 1;
      return acc;
    }, {});
    
    return Object.keys(iconCounts).reduce((a, b) => 
      iconCounts[a] > iconCounts[b] ? a : b
    );
  });

  // Format days for display
  const formattedDays = days.map(day => {
    const date = new Date(day);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  });

  // Chart data
  const chartData = {
    labels: formattedDays,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: averageTemps,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Humidity (%)',
        data: averageHumidity,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Wind Speed (m/s)',
        data: averageWindSpeed,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '5-Day Weather Forecast',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">5-Day Forecast</h2>
      
      <div className="mb-8">
        <Line data={chartData} options={chartOptions} />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {days.map((day, index) => (
          <div key={day} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center transition-transform hover:scale-105">
            <p className="font-medium text-gray-700 dark:text-gray-200">{formattedDays[index]}</p>
            <img 
              src={`https://openweathermap.org/img/wn/${mostCommonIcons[index]}@2x.png`}
              alt="Weather icon" 
              className="w-16 h-16 mx-auto"
            />
            <p className="text-lg font-bold text-gray-800 dark:text-white">{averageTemps[index]}°C</p>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
              <p>Humidity: {averageHumidity[index]}%</p>
              <p>Wind: {averageWindSpeed[index]} m/s</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;