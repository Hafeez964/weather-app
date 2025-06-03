import asyncHandler from 'express-async-handler';
import axios from 'axios';

// @desc    Get weather by coordinates
// @route   GET /api/weather/coordinates
// @access  Public
const getWeatherByCoordinates = asyncHandler(async (req, res) => {
  const { lat, lon } = req.query;
  
  if (!lat || !lon) {
    res.status(400);
    throw new Error('Latitude and longitude are required');
  }
  
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500);
    throw new Error(error.response?.data?.message || 'Error fetching weather data');
  }
});

// @desc    Get weather by city name
// @route   GET /api/weather/city
// @access  Public
const getWeatherByCity = asyncHandler(async (req, res) => {
  const { city } = req.query;
  
  if (!city) {
    res.status(400);
    throw new Error('City name is required');
  }
  
  try {
    // First get coordinates from city name
    const geoResponse = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    
    if (!geoResponse.data || geoResponse.data.length === 0) {
      res.status(404);
      throw new Error('City not found');
    }
    
    const { lat, lon } = geoResponse.data[0];
    
    // Then get weather using coordinates
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    
    res.json(weatherResponse.data);
  } catch (error) {
    res.status(error.response?.status || 500);
    throw new Error(error.response?.data?.message || 'Error fetching weather data');
  }
});

// @desc    Get 5-day forecast
// @route   GET /api/weather/forecast
// @access  Public
const getWeatherForecast = asyncHandler(async (req, res) => {
  const { lat, lon } = req.query;
  
  if (!lat || !lon) {
    res.status(400);
    throw new Error('Latitude and longitude are required');
  }
  
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500);
    throw new Error(error.response?.data?.message || 'Error fetching forecast data');
  }
});

export { getWeatherByCoordinates, getWeatherByCity, getWeatherForecast };