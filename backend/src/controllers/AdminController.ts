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

      const { count: totalShopOwners } = await supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'shop_owner');

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
        totalShopOwners: totalShopOwners || 0,
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

  // Listing farmers for admin
  public static async listFarmers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('role', 'farmer');
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) { next(err); }
  }

  // Listing shops for admin
  public static async listShops(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { data: shops, error: shopsError } = await supabaseAdmin.from('shops').select('*');
      if (shopsError) return res.status(400).json({ error: shopsError.message });

      const { data: profiles, error: profilesError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('role', 'shop_owner');
      if (profilesError) return res.status(400).json({ error: profilesError.message });

      const joined = shops.map((shop: any) => {
        const owner = profiles.find((p: any) => p.user_id === shop.owner_id);
        return {
          ...shop,
          owner: owner || null
        };
      });

      return res.status(200).json(joined);
    } catch (err) { next(err); }
  }

  // Broadcast notification to all users
  public static async broadcastNotification(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { title, message, type } = req.body;
      if (!title || !message || !type) {
        return res.status(400).json({ error: 'Title, message and type are required' });
      }

      const { data: profiles, error: fetchErr } = await supabaseAdmin.from('profiles').select('user_id');
      if (fetchErr) return res.status(400).json({ error: fetchErr.message });

      if (!profiles || profiles.length === 0) {
        return res.status(200).json({ message: 'No users registered to receive alerts' });
      }

      const notificationsToInsert = profiles.map((p: any) => ({
        user_id: p.user_id,
        title,
        message,
        type,
        is_read: false
      }));

      const { error: insertErr } = await supabaseAdmin.from('notifications').insert(notificationsToInsert);
      if (insertErr) return res.status(400).json({ error: insertErr.message });

      return res.status(200).json({ message: 'Alert broadcasted successfully to all users!' });
    } catch (err) { next(err); }
  }
}
