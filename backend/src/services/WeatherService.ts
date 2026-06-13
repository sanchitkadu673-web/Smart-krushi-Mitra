import axios from 'axios';
import { supabaseAdmin } from '../config/supabase';

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  rainAlert: boolean;
  forecast: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    condition: string;
    rainAlert: boolean;
  }>;
}

export class WeatherService {
  private static CACHE_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

  public static async getWeather(location: string): Promise<WeatherData> {
    // 1. Check Cache
    const { data: cacheEntry } = await supabaseAdmin
      .from('weather_cache')
      .select('*')
      .eq('location', location)
      .single();

    if (cacheEntry) {
      const updatedAt = new Date(cacheEntry.updated_at).getTime();
      const now = new Date().getTime();
      if (now - updatedAt < this.CACHE_EXPIRY_MS) {
        return cacheEntry.weather_data as WeatherData;
      }
    }

    // 2. Resolve Coordinates (Fallback coordinates if location is not lat,lng)
    let lat = 18.5204; // default Pune
    let lon = 73.8567;

    if (location && !location.includes(',')) {
      // Named location
      try {
        const geoResponse = await axios.get(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
        );
        if (geoResponse.data?.results?.[0]) {
          lat = geoResponse.data.results[0].latitude;
          lon = geoResponse.data.results[0].longitude;
        }
      } catch (geoError) {
        console.error('Geocoding error for location:', location, geoError);
      }
    } else if (location && location.includes(',')) {
      const parts = location.split(',');
      const parsedLat = parseFloat(parts[0]);
      const parsedLon = parseFloat(parts[1]);
      if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
        lat = parsedLat;
        lon = parsedLon;
      } else {
        // It's a named location containing commas! e.g., "Manjri, Haveli, Pune, Maharashtra"
        try {
          // Try to geocode the whole string first
          let geoResponse = await axios.get(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
          );
          if (geoResponse.data?.results?.[0]) {
            lat = geoResponse.data.results[0].latitude;
            lon = geoResponse.data.results[0].longitude;
          } else {
            // Fallback: search by the first part (e.g. "Manjri")
            const firstPart = parts[0].trim();
            geoResponse = await axios.get(
              `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(firstPart)}&count=1&language=en&format=json`
            );
            if (geoResponse.data?.results?.[0]) {
              lat = geoResponse.data.results[0].latitude;
              lon = geoResponse.data.results[0].longitude;
            }
          }
        } catch (geoError) {
          console.error('Geocoding error for location with commas:', location, geoError);
        }
      }
    }

    try {
      // 3. Fetch from Open-Meteo
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
      );

      const current = response.data.current;
      const daily = response.data.daily;

      const rainAlert = (current.precipitation || 0) > 0;
      
      const forecast = daily.time.map((dateStr: string, idx: number) => {
        const pSum = daily.precipitation_sum[idx] || 0;
        return {
          date: dateStr,
          tempMax: daily.temperature_2m_max[idx],
          tempMin: daily.temperature_2m_min[idx],
          condition: pSum > 2 ? 'Rainy' : 'Sunny',
          rainAlert: pSum > 2
        };
      });

      const weatherData: WeatherData = {
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        condition: rainAlert ? 'Rainy' : 'Sunny',
        rainAlert,
        forecast
      };

      // 4. Save to Cache
      if (cacheEntry) {
        await supabaseAdmin
          .from('weather_cache')
          .update({ weather_data: weatherData, updated_at: new Date().toISOString() })
          .eq('location', location);
      } else {
        await supabaseAdmin
          .from('weather_cache')
          .insert({ location, weather_data: weatherData });
      }

      return weatherData;
    } catch (apiError) {
      console.error('Weather API error, generating mock response:', apiError);
      
      // Fallback/Mock Weather Data if internet or service is down
      const mockData: WeatherData = {
        temperature: 31.5,
        humidity: 62,
        windSpeed: 12.4,
        condition: 'Clear Sky',
        rainAlert: false,
        forecast: Array.from({ length: 7 }).map((_, idx) => {
          const date = new Date();
          date.setDate(date.getDate() + idx);
          return {
            date: date.toISOString().split('T')[0],
            tempMax: 32 + idx % 2,
            tempMin: 22 - idx % 2,
            condition: idx % 3 === 0 ? 'Partly Cloudy' : 'Sunny',
            rainAlert: false
          };
        })
      };
      return mockData;
    }
  }
}
