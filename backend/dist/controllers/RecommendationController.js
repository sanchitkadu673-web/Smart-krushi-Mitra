"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationController = void 0;
const RecommendationEngineService_1 = require("../services/RecommendationEngineService");
const supabase_1 = require("../config/supabase");
class RecommendationController {
    static async getRecommendations(req, res, next) {
        try {
            const { cropId } = req.params;
            const userId = req.user?.id;
            // 1. Verify owner of crop
            const { data: crop } = await supabase_1.supabaseAdmin
                .from('crops')
                .select('user_id')
                .eq('id', cropId)
                .single();
            if (!crop) {
                return res.status(404).json({ error: 'Crop not found' });
            }
            if (crop.user_id !== userId && req.user?.role !== 'admin') {
                return res.status(403).json({ error: 'Forbidden: Access denied' });
            }
            // 2. Fetch recommendations
            const recommendations = await RecommendationEngineService_1.RecommendationEngineService.getRecommendations(cropId);
            return res.status(200).json(recommendations);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.RecommendationController = RecommendationController;
