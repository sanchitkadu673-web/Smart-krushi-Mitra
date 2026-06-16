"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const supabase_1 = require("../config/supabase");
const RecommendationEngineService_1 = require("./RecommendationEngineService");
class NotificationService {
    static async generateCropNotifications(cropId) {
        try {
            const recommendations = await RecommendationEngineService_1.RecommendationEngineService.getRecommendations(cropId);
            const { data: crop } = await supabase_1.supabaseAdmin
                .from('crops')
                .select('user_id')
                .eq('id', cropId)
                .single();
            if (!crop)
                return;
            const userId = crop.user_id;
            // 1. Fertilizer alerts
            for (const fert of recommendations.fertilizers) {
                const title = `Fertilizer Alert: ${fert.fertilizer_name}`;
                const message = `Apply ${fert.fertilizer_name} (${fert.quantity}) for your ${recommendations.cropName} crop.`;
                await this.createNotification(userId, title, message, 'fertilizer');
            }
            // 2. Spray alerts
            for (const spray of recommendations.sprays) {
                const title = `Spray Alert: ${spray.spray_name}`;
                const message = `Time to apply ${spray.spray_name} spray to protect your ${recommendations.cropName}.`;
                await this.createNotification(userId, title, message, 'spray');
            }
            // 3. Irrigation alerts
            for (const irr of recommendations.irrigation) {
                const title = `Irrigation Alert: ${recommendations.cropName}`;
                const message = `Water requirement at this stage: ${irr.water_requirement}.`;
                await this.createNotification(userId, title, message, 'irrigation');
            }
            // 4. Harvest alerts
            if (recommendations.daysSinceSowing >= 120) {
                const title = `Harvest Alert: ${recommendations.cropName}`;
                const message = `Your crop is reaching maturity. Plan harvest soon. Expected yield: ${recommendations.harvestDate}.`;
                await this.createNotification(userId, title, message, 'harvest');
            }
        }
        catch (error) {
            console.error('Error generating crop notifications:', error);
        }
    }
    static async createNotification(userId, title, message, type) {
        // Avoid creating duplicate notifications of same title/type in the last 24h
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data: existing } = await supabase_1.supabaseAdmin
            .from('notifications')
            .select('id')
            .eq('user_id', userId)
            .eq('title', title)
            .eq('type', type)
            .gt('created_at', twentyFourHoursAgo);
        if (existing && existing.length > 0) {
            return; // Skip duplicate notification
        }
        await supabase_1.supabaseAdmin.from('notifications').insert({
            user_id: userId,
            title,
            message,
            type,
            is_read: false
        });
    }
    // Cron-like function to update notifications for all active crops
    static async processAllActiveCrops() {
        const { data: activeCrops } = await supabase_1.supabaseAdmin
            .from('crops')
            .select('id')
            .eq('status', 'active');
        if (!activeCrops)
            return;
        for (const crop of activeCrops) {
            await this.generateCropNotifications(crop.id);
        }
    }
}
exports.NotificationService = NotificationService;
