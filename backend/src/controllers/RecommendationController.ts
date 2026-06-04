import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { RecommendationEngineService } from '../services/RecommendationEngineService';
import { supabaseAdmin } from '../config/supabase';

export class RecommendationController {
  public static async getRecommendations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { cropId } = req.params;
      const userId = req.user?.id;

      // 1. Verify owner of crop
      const { data: crop } = await supabaseAdmin
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
      const recommendations = await RecommendationEngineService.getRecommendations(cropId);
      return res.status(200).json(recommendations);
    } catch (err) {
      next(err);
    }
  }
}
