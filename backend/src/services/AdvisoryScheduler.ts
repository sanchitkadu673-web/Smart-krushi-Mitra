import { supabaseAdmin } from '../config/supabase';
import { WeatherService } from './WeatherService';
import { AiService } from './AiService';

export class AdvisoryScheduler {
  private static isRunning = false;

  /**
   * Start the scheduler. It calculates the time until the next 7:00 AM,
   * runs the advisory check once, and then schedules it to run every 24 hours.
   */
  public static start() {
    const now = new Date();
    const nextRun = new Date();
    nextRun.setHours(7, 0, 0, 0);

    if (now > nextRun) {
      // If it is already past 7:00 AM, schedule for tomorrow
      nextRun.setDate(nextRun.getDate() + 1);
    }

    const delayMs = nextRun.getTime() - now.getTime();
    console.log(`[AdvisoryScheduler] Scheduler initialized. Next run scheduled at: ${nextRun.toLocaleString()} (in ${(delayMs / 1000 / 60).toFixed(1)} minutes)`);

    setTimeout(() => {
      this.checkAndSendAdvisories().catch(err => {
        console.error('[AdvisoryScheduler] Error during automatic run:', err);
      });

      // Repeat every 24 hours
      setInterval(() => {
        this.checkAndSendAdvisories().catch(err => {
          console.error('[AdvisoryScheduler] Error during scheduled run:', err);
        });
      }, 24 * 60 * 60 * 1000);
    }, delayMs);
  }

  /**
   * Queries profiles for unique farmer districts, fetches weather forecasts,
   * checks for weather warnings (rain) in the next 3 days, generates AI recommendations,
   * and dispatches notifications.
   * Can be called by the scheduler or triggered manually by admins.
   */
  public static async checkAndSendAdvisories(): Promise<{ checked: string[]; sent: number }> {
    if (this.isRunning) {
      console.warn('[AdvisoryScheduler] Scan is already running. Skipping.');
      return { checked: [], sent: 0 };
    }

    this.isRunning = true;
    console.log('[AdvisoryScheduler] Starting weather advisory scan...');
    const checkedDistricts: string[] = [];
    let notificationsSent = 0;

    try {
      // 1. Get all unique districts of registered farmers
      const { data: profiles, error: profileErr } = await supabaseAdmin
        .from('profiles')
        .select('district')
        .eq('role', 'farmer');

      if (profileErr) {
        throw new Error(`Failed to fetch profiles: ${profileErr.message}`);
      }

      if (!profiles || profiles.length === 0) {
        console.log('[AdvisoryScheduler] No farmers registered. Aborting weather advisory scan.');
        return { checked: [], sent: 0 };
      }

      const districts: string[] = Array.from(new Set(profiles.map((p: any) => (p.district || '').trim()).filter(Boolean)));
      console.log(`[AdvisoryScheduler] Found ${districts.length} unique districts:`, districts);

      for (const district of districts) {
        try {
          console.log(`[AdvisoryScheduler] Checking weather for district: ${district}`);
          const weather = await WeatherService.getWeather(district);

          // Check the first 3 days of the forecast for a rainAlert
          const upcomingRainDays = weather.forecast.slice(0, 3).filter((day: any) => day.rainAlert);
          checkedDistricts.push(district);

          if (upcomingRainDays.length > 0) {
            console.log(`[AdvisoryScheduler] Rain alert detected in ${district} for ${upcomingRainDays.length} of the next 3 days.`);
            
            // Format a simple summary of the weather
            const rainSummary = `पुढील ३ दिवसात काही दिवस पाऊस पडण्याची शक्यता आहे (उदा. ${upcomingRainDays.map((d: any) => d.date).join(', ')}).`;

            // 2. Generate custom advice via Gemini AI
            console.log(`[AdvisoryScheduler] Generating AI advice for ${district}...`);
            const advisory = await AiService.generateWeatherAdvisory(district, rainSummary);
            console.log(`[AdvisoryScheduler] AI Advice: "${advisory}"`);

            // 3. Find all farmers registered in this district
            const { data: farmers, error: farmerErr } = await supabaseAdmin
              .from('profiles')
              .select('user_id')
              .eq('district', district)
              .eq('role', 'farmer');

            if (farmerErr) {
              console.error(`[AdvisoryScheduler] Failed to fetch farmers for ${district}:`, farmerErr);
              continue;
            }

            if (!farmers || farmers.length === 0) {
              console.log(`[AdvisoryScheduler] No farmers found in ${district}.`);
              continue;
            }

            // 4. Dispatch notifications to all farmers in this district
            const notificationsToInsert = farmers.map((f: any) => ({
              user_id: f.user_id,
              title: `🌧️ हवामान इशारा: ${district}`,
              message: advisory,
              type: 'weather',
              is_read: false
            }));

            const { error: insertErr } = await supabaseAdmin
              .from('notifications')
              .insert(notificationsToInsert);

            if (insertErr) {
              console.error(`[AdvisoryScheduler] Failed to dispatch notifications for ${district}:`, insertErr);
            } else {
              console.log(`[AdvisoryScheduler] Successfully sent advisory to ${farmers.length} farmers in ${district}.`);
              notificationsSent += farmers.length;
            }
          } else {
            console.log(`[AdvisoryScheduler] No rain alerts for ${district} in the next 3 days. Skipping.`);
          }
        } catch (districtErr) {
          console.error(`[AdvisoryScheduler] Error processing district "${district}":`, districtErr);
        }
      }
    } finally {
      this.isRunning = false;
      console.log(`[AdvisoryScheduler] Weather advisory scan completed. Checked: ${checkedDistricts.length} districts. Sent: ${notificationsSent} notifications.`);
    }

    return { checked: checkedDistricts, sent: notificationsSent };
  }
}
