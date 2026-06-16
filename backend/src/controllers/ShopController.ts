import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { supabaseAdmin } from '../config/supabase';

export class ShopController {
  public static async registerShop(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { shopName, licenseNumber, gpsLat, gpsLng, address } = req.body;

      const { data, error } = await supabaseAdmin
        .from('shops')
        .insert({
          owner_id: userId,
          shop_name: shopName,
          license_number: licenseNumber,
          gps_lat: gpsLat,
          gps_lng: gpsLng,
          address: address,
          is_approved: false
        })
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(201).json({ message: 'Shop registered and pending approval', shop: data });
    } catch (err) {
      next(err);
    }
  }

  public static async getShopDetails(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
      const { data, error } = await supabaseAdmin
        .from('shops')
        .select('*')
        .eq('owner_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json(data || null);
    } catch (err) {
      next(err);
    }
  }

  // More methods for products and requests will be added here
  public static async getProducts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
      // Get shop id for this owner
      const { data: shop } = await supabaseAdmin.from('shops').select('id').eq('owner_id', userId).single();
      if (!shop) return res.status(200).json([]); // No shop registered yet

      const { data, error } = await supabaseAdmin.from('products').select('*').eq('shop_id', shop.id).order('created_at', { ascending: false });
      if (error) return res.status(400).json({ error: error.message });
      
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  public static async addProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { name, company, category, price, stock_quantity } = req.body;

      // Get shop id
      const { data: shop } = await supabaseAdmin.from('shops').select('id').eq('owner_id', userId).single();
      if (!shop) return res.status(400).json({ error: 'Shop not found. Please register shop first.' });

      const { data, error } = await supabaseAdmin.from('products').insert({
        shop_id: shop.id,
        name,
        company,
        category,
        price,
        stock_quantity
      }).select().single();

      if (error) return res.status(400).json({ error: error.message });
      return res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  }

  public static async deleteProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ message: 'Deleted' });
    } catch (err) {
      next(err);
    }
  }

  public static async updateProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, company, category, price, stock_quantity } = req.body;

      const { data, error } = await supabaseAdmin
        .from('products')
        .update({
          name,
          company,
          category,
          price,
          stock_quantity
        })
        .eq('id', id)
        .select()
        .single();

      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  public static async registerFarmer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { fullName, mobile, state, district, taluka, village } = req.body;

      if (!fullName || !mobile || !state || !district || !taluka || !village) {
        return res.status(400).json({ error: 'All farmer registration fields are required' });
      }

      // Get shop id for this owner
      const { data: shop } = await supabaseAdmin.from('shops').select('id').eq('owner_id', userId).single();
      if (!shop) {
        return res.status(400).json({ error: 'Shop not found. Please register shop first.' });
      }

      // Create auth user
      const userAuthParams = {
        phone: `+91${mobile}`,
        phone_confirm: true,
        user_metadata: {
          full_name: fullName
        }
      };

      const { data: userAuth, error: authError } = await supabaseAdmin.auth.admin.createUser(userAuthParams);
      
      let farmerUserId: string;
      if (authError) {
        // If user already exists, it is status 422
        const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
        const found = existingUser.users.find((u: any) => u.phone === `+91${mobile}` || u.phone === `91${mobile}`);
        if (!found) {
          return res.status(400).json({ error: authError.message || 'Failed to create farmer account' });
        }
        farmerUserId = found.id;
      } else {
        farmerUserId = userAuth.user.id;
      }

      // Insert or update profiles
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: farmerUserId,
          full_name: fullName,
          mobile: mobile,
          state: state,
          district: district,
          taluka: taluka,
          village: village,
          role: 'farmer',
          shop_id: shop.id
        })
        .select()
        .single();

      if (profileError) {
        // If profile exists (unique constraint on mobile), update the shop_id to link them
        if (profileError.message.includes('unique') || profileError.message.includes('already exists') || profileError.code === '23505') {
          const { data: updatedProfile, error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({ shop_id: shop.id })
            .eq('mobile', mobile)
            .select()
            .single();

          if (updateError) {
            return res.status(400).json({ error: updateError.message });
          }
          return res.status(200).json({
            message: 'Farmer linked to your shop successfully',
            profile: updatedProfile
          });
        }
        return res.status(400).json({ error: profileError.message });
      }

      return res.status(201).json({
        message: 'Farmer registered and linked to your shop successfully',
        profile
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getFarmers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { data: shop } = await supabaseAdmin.from('shops').select('id').eq('owner_id', userId).single();
      if (!shop) return res.status(200).json([]);

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('shop_id', shop.id)
        .eq('role', 'farmer');

      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  public static async getLinkedShopForFarmer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
      // Get farmer's profile to retrieve shop_id
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('shop_id')
        .eq('user_id', userId)
        .single();
        
      if (profileError || !profile || !profile.shop_id) {
        return res.status(200).json({ shop: null, products: [] });
      }

      // Fetch shop details
      const { data: shop, error: shopError } = await supabaseAdmin
        .from('shops')
        .select('*')
        .eq('id', profile.shop_id)
        .single();

      if (shopError) {
        return res.status(400).json({ error: shopError.message });
      }

      // Fetch products in that shop
      const { data: products, error: productsError } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('shop_id', profile.shop_id)
        .order('created_at', { ascending: false });

      if (productsError) {
        return res.status(400).json({ error: productsError.message });
      }

      return res.status(200).json({
        shop,
        products
      });
    } catch (err) {
      next(err);
    }
  }

  public static async scanBillAndAddToStock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { billImage, mimeType } = req.body;

      if (!billImage) {
        return res.status(400).json({ error: 'Bill image payload is required' });
      }

      // Get shop id
      const { data: shop } = await supabaseAdmin.from('shops').select('id').eq('owner_id', userId).single();
      if (!shop) {
        return res.status(400).json({ error: 'Shop not found. Please register shop first.' });
      }

      // Call AiService to parse the bill
      const { AiService } = require('../services/AiService');
      const parsedProducts = await AiService.scanBill(billImage, mimeType);

      if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
        return res.status(400).json({ error: 'Failed to extract any products from the bill.' });
      }

      const results = [];

      for (const p of parsedProducts) {
        // Find existing product with same name (case-insensitive)
        const { data: existingList } = await supabaseAdmin
          .from('products')
          .select('*')
          .eq('shop_id', shop.id)
          .ilike('name', p.name);

        // Find match with same company
        const existingProduct = existingList?.find(
          (item: any) => (item.company || '').toLowerCase() === (p.company || '').toLowerCase()
        );

        if (existingProduct) {
          const newQty = (existingProduct.stock_quantity || 0) + (p.quantity || 0);
          const { data: updated } = await supabaseAdmin
            .from('products')
            .update({ stock_quantity: newQty })
            .eq('id', existingProduct.id)
            .select()
            .single();
          results.push({ ...p, status: 'updated', id: existingProduct.id, newQty });
        } else {
          const { data: inserted } = await supabaseAdmin
            .from('products')
            .insert({
              shop_id: shop.id,
              name: p.name,
              company: p.company || 'Unknown',
              category: p.category || 'Other',
              price: p.price || 0,
              stock_quantity: p.quantity || 0
            })
            .select()
            .single();
          results.push({ ...p, status: 'created', id: inserted?.id });
        }
      }

      return res.status(200).json({
        message: 'Bill scanned and stock processed successfully!',
        products: results
      });
    } catch (err) {
      next(err);
    }
  }

  public static async broadcastToFarmers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { title, message, type } = req.body;

      if (!title || !message || !type) {
        return res.status(400).json({ error: 'Title, message, and type are required' });
      }

      // 1. Get shop details for the owner
      const { data: shop, error: shopErr } = await supabaseAdmin
        .from('shops')
        .select('id, shop_name')
        .eq('owner_id', userId)
        .single();

      if (shopErr || !shop) {
        return res.status(400).json({ error: 'Shop not found. Please register your shop first.' });
      }

      // 2. Fetch linked farmers
      const { data: farmers, error: fetchErr } = await supabaseAdmin
        .from('profiles')
        .select('user_id')
        .eq('shop_id', shop.id)
        .eq('role', 'farmer');

      if (fetchErr) {
        return res.status(400).json({ error: fetchErr.message });
      }

      if (!farmers || farmers.length === 0) {
        return res.status(400).json({ error: 'No farmers are currently linked to your shop.' });
      }

      // 3. Insert notification for each farmer
      const formattedTitle = `[${shop.shop_name}] ${title}`;
      const notificationsToInsert = farmers.map((f: any) => ({
        user_id: f.user_id,
        title: formattedTitle,
        message,
        type,
        is_read: false
      }));

      const { error: insertErr } = await supabaseAdmin
        .from('notifications')
        .insert(notificationsToInsert);

      if (insertErr) {
        return res.status(400).json({ error: insertErr.message });
      }

      return res.status(200).json({
        message: 'Notification broadcasted successfully to all linked farmers!'
      });
    } catch (err) {
      next(err);
    }
  }

  public static async listAllShops(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { data: shops, error: shopsError } = await supabaseAdmin
        .from('shops')
        .select('*')
        .eq('is_approved', true);

      if (shopsError) return res.status(400).json({ error: shopsError.message });

      const { data: profiles, error: profilesError } = await supabaseAdmin
        .from('profiles')
        .select('user_id, full_name, mobile');
      if (profilesError) return res.status(400).json({ error: profilesError.message });

      const { data: products, error: productsError } = await supabaseAdmin
        .from('products')
        .select('*');
      if (productsError) return res.status(400).json({ error: productsError.message });

      const joined = (shops || []).map((shop: any) => {
        const owner = (profiles || []).find((p: any) => p.user_id === shop.owner_id);
        const shopProducts = (products || []).filter((p: any) => p.shop_id === shop.id);
        return {
          id: shop.id,
          shop_name: shop.shop_name,
          license_number: shop.license_number,
          address: shop.address,
          gps_lat: shop.gps_lat,
          gps_lng: shop.gps_lng,
          owner_name: owner ? owner.full_name : 'N/A',
          owner_mobile: owner ? owner.mobile : 'N/A',
          products: shopProducts
        };
      });

      return res.status(200).json(joined);
    } catch (err) {
      next(err);
    }
  }
}
