import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { WeatherService } from '../services/WeatherService';
import { supabaseAdmin } from '../config/supabase';

export class WeatherController {
  public static async getWeatherForecast(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      let location = req.query.location as string;

      // If location is not provided, fetch user's profile location
      if (!location) {
        const userId = req.user?.id;
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('state, district, taluka, village')
          .eq('user_id', userId)
          .single();

        if (profile) {
          location = `${profile.village}, ${profile.taluka}, ${profile.district}, ${profile.state}`;
        } else {
          location = '18.5204,73.8567'; // Default coordinates
        }
      }

      const weatherData = await WeatherService.getWeather(location);
      return res.status(200).json(weatherData);
    } catch (err) {
      next(err);
    }
  }
}
