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

      if (profile.role === 'shop_owner') {
        const { data: shop } = await supabaseAdmin
          .from('shops')
          .select('*')
          .eq('owner_id', userId)
          .single();
        if (shop) {
          profile.shop_name = shop.shop_name;
          profile.license_number = shop.license_number;
          profile.shop_address = shop.address;
        }
      }

      return res.status(200).json(profile);
    } catch (err) {
      next(err);
    }
  }

  public static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { full_name, state, district, taluka, village, shop_name, license_number } = req.body;

      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .update({
          full_name,
          state,
          district,
          taluka,
          village
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      if (profile.role === 'shop_owner') {
        const address = `${village}, ${taluka}, ${district}, ${state}`;
        const { error: shopError } = await supabaseAdmin
          .from('shops')
          .update({
            shop_name: shop_name || '',
            license_number: license_number || '',
            address: address
          })
          .eq('owner_id', userId);

        if (shopError) {
          return res.status(400).json({ error: shopError.message });
        }

        profile.shop_name = shop_name;
        profile.license_number = license_number;
        profile.shop_address = address;
      }

      return res.status(200).json(profile);
    } catch (err) {
      next(err);
    }
  }
}
