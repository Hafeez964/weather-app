import axios from 'axios';

const baseURL = import.meta.env.PROD
  ? 'https://weather-app-rjv6.vercel.app/api'  // Production backend URL
  : 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance; 