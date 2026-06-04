import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { supabaseAdmin } from '../config/supabase';

export class NotificationController {
  public static async listNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { data: notifications, error } = await supabaseAdmin
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json(notifications);
    } catch (err) {
      next(err);
    }
  }

  public static async markAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { ids } = req.body; // optional list of IDs, if not provided marks all as read

      let query = supabaseAdmin
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId);

      if (ids && Array.isArray(ids)) {
        query = query.in('id', ids);
      }

      const { data, error } = await query.select();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({ message: 'Notifications marked as read', data });
    } catch (err) {
      next(err);
    }
  }
}
