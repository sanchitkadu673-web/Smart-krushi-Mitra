import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { supabaseAdmin } from '../config/supabase';
import { AdvisoryScheduler } from '../services/AdvisoryScheduler';

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
        .select('*');
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

  // Delete a farmer profile and auth account
  public static async deleteFarmer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('user_id')
        .eq('id', id)
        .single();
        
      if (profileError || !profile) {
        return res.status(404).json({ error: 'Farmer profile not found' });
      }
      
      const userId = profile.user_id;
      
      // Delete the profile (cascading tables will clean up local data)
      const { error: deleteProfileError } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', id);
        
      if (deleteProfileError) {
        return res.status(400).json({ error: deleteProfileError.message });
      }
      
      // Delete user from Supabase Auth
      const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (deleteAuthError) {
        console.warn('Could not delete user from auth (likely mock user):', deleteAuthError.message);
      }
      
      return res.status(200).json({ message: 'Farmer deleted successfully' });
    } catch (err) { next(err); }
  }

  // Delete a shop, its owner's profile, and auth account
  public static async deleteShop(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { data: shop, error: shopError } = await supabaseAdmin
        .from('shops')
        .select('owner_id')
        .eq('id', id)
        .single();
        
      if (shopError || !shop) {
        return res.status(404).json({ error: 'Shop not found' });
      }
      
      const ownerId = shop.owner_id;
      
      // Delete the shop
      const { error: deleteShopError } = await supabaseAdmin
        .from('shops')
        .delete()
        .eq('id', id);
        
      if (deleteShopError) {
        return res.status(400).json({ error: deleteShopError.message });
      }
      
      // Delete owner profile
      await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('user_id', ownerId);
        
      // Delete owner from Auth
      const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(ownerId);
      if (deleteAuthError) {
        console.warn('Could not delete owner from auth:', deleteAuthError.message);
      }
      
      return res.status(200).json({ message: 'Shop and owner deleted successfully' });
    } catch (err) { next(err); }
  }

  // Toggle approval status for a shop
  public static async toggleShopApproval(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { is_approved } = req.body;
      
      const { data, error } = await supabaseAdmin
        .from('shops')
        .update({ is_approved })
        .eq('id', id)
        .select()
        .single();
        
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) { next(err); }
  }

  // Diseases CRUD
  public static async listDiseases(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabaseAdmin.from('diseases').select('*');
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) { next(err); }
  }

  public static async createDisease(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabaseAdmin.from('diseases').insert(req.body).select().single();
      if (error) return res.status(400).json({ error: error.message });
      return res.status(201).json(data);
    } catch (err) { next(err); }
  }

  public static async updateDisease(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { data, error } = await supabaseAdmin.from('diseases').update(req.body).eq('id', id).select().single();
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) { next(err); }
  }

  public static async deleteDisease(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { error } = await supabaseAdmin.from('diseases').delete().eq('id', id);
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ message: 'Disease deleted successfully' });
    } catch (err) { next(err); }
  }

  // Pests CRUD
  public static async listPests(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabaseAdmin.from('pests').select('*');
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) { next(err); }
  }

  public static async createPest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabaseAdmin.from('pests').insert(req.body).select().single();
      if (error) return res.status(400).json({ error: error.message });
      return res.status(201).json(data);
    } catch (err) { next(err); }
  }

  public static async updatePest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { data, error } = await supabaseAdmin.from('pests').update(req.body).eq('id', id).select().single();
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) { next(err); }
  }

  public static async deletePest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { error } = await supabaseAdmin.from('pests').delete().eq('id', id);
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ message: 'Pest deleted successfully' });
    } catch (err) { next(err); }
  }

  // Trigger weather advisory scan manually
  public static async triggerWeatherAdvisories(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await AdvisoryScheduler.checkAndSendAdvisories();
      return res.status(200).json({
        message: 'Weather advisories scan triggered successfully',
        checkedDistricts: result.checked,
        notificationsSent: result.sent
      });
    } catch (err) {
      next(err);
    }
  }

  // Update landing page settings
  public static async updateLandingPage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabaseAdmin
        .from('landing_page_settings')
        .update(req.body)
        .eq('id', 'landing_page_default')
        .select()
        .single();
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}
