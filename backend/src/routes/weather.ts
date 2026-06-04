import { Router } from 'express';
import { WeatherController } from '../controllers/WeatherController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get('/forecast', requireAuth, WeatherController.getWeatherForecast);

export default router;
