import express from 'express';
import {
  getWeatherByCoordinates,
  getWeatherByCity,
  getWeatherForecast
} from '../controllers/weatherController.js';

const router = express.Router();

router.get('/coordinates', getWeatherByCoordinates);
router.get('/city', getWeatherByCity);
router.get('/forecast', getWeatherForecast);

export default router;