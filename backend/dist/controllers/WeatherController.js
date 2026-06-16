"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherController = void 0;
const WeatherService_1 = require("../services/WeatherService");
const supabase_1 = require("../config/supabase");
class WeatherController {
    static async getWeatherForecast(req, res, next) {
        try {
            let location = req.query.location;
            // If location is not provided, fetch user's profile location
            if (!location) {
                const userId = req.user?.id;
                const { data: profile } = await supabase_1.supabaseAdmin
                    .from('profiles')
                    .select('state, district, taluka, village')
                    .eq('user_id', userId)
                    .single();
                if (profile) {
                    location = `${profile.village}, ${profile.taluka}, ${profile.district}, ${profile.state}`;
                }
                else {
                    location = '18.5204,73.8567'; // Default coordinates
                }
            }
            const weatherData = await WeatherService_1.WeatherService.getWeather(location);
            return res.status(200).json(weatherData);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.WeatherController = WeatherController;
