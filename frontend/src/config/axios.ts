import axios from 'axios';

const baseURL = import.meta.env.PROD
  ? 'https://your-backend-name.vercel.app/api'  // Replace this with your actual backend URL after deployment
  : 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance; 