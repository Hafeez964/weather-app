import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://weather-app-backend-vercel.vercel.app/api'
  : 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance; 