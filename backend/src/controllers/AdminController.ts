import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { supabaseAdmin } from '../config/supabase';

export class AdminController {
  public static async getStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { count: totalFarmers } = await supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'farmer');

      const { count: totalCrops } = await supabaseAdmin
        .from('crops')
        .select('*', { count: 'exact', head: true });

      const { count: activeCrops } = await supabaseAdmin
        .from('crops')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { count: notificationsSent } = await supabaseAdmin
        .from('notifications')
        .select('*', { count: 'exact', head: true });

      return res.status(200).json({
        totalFarmers: totalFarmers || 0,
        totalCrops: totalCrops || 0,
        activeCrops: activeCrops || 0,
        notificationsSent: notificationsSent || 0
      });
    } catch (err) {
      next(err);
    }
  }

  // 1. Crop Master CRUD
  public static async listCropMasters(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabaseAdmin.from('crop_master').select('*');
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) { next(err); }
  }

  public static async createCropMaster(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabaseAdmin.from('crop_master').insert(req.body).select().single();
      if (error) return res.status(400).json({ error: error.message });
      return res.status(201).json(data);
    } catch (err) { next(err); }
  }

  public static async updateCropMaster(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { data, error } = await supabaseAdmin.from('crop_master').update(req.body).eq('id', id).select().single();
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) { next(err); }
  }

  public static async deleteCropMaster(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { error } = await supabaseAdmin.from('crop_master').delete().eq('id', id);
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ message: 'Crop master deleted successfully' });
    } catch (err) { next(err); }
  }

  // 2. Crop Stages CRUD
  public static async listStages(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabaseAdmin.from('crop_stages').select('*');
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) { next(err); }
  }

  public static async createStage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabaseAdmin.from('crop_stages').insert(req.body).select().single();
      if (error) return res.status(400).json({ error: error.message });
      return res.status(201).json(data);
    } catch (err) { next(err); }
  }

  public static async updateStage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { data, error } = await supabaseAdmin.from('crop_stages').update(req.body).eq('id', id).select().single();
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) { next(err); }
  }

  public static async deleteStage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { error } = await supabaseAdmin.from('crop_stages').delete().eq('id', id);
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ message: 'Crop stage deleted' });
    } catch (err) { next(err); }
  }
}
