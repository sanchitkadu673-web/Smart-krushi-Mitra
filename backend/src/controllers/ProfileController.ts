import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { supabaseAdmin } from '../config/supabase';

export class ProfileController {
  public static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      return res.status(200).json(profile);
    } catch (err) {
      next(err);
    }
  }

  public static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const updates = req.body;

      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json(profile);
    } catch (err) {
      next(err);
    }
  }
}
