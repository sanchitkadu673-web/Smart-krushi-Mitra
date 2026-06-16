"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const supabase_1 = require("../config/supabase");
const AdvisoryScheduler_1 = require("../services/AdvisoryScheduler");
class AdminController {
    static async getStats(req, res, next) {
        try {
            const { count: totalFarmers } = await supabase_1.supabaseAdmin
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'farmer');
            const { count: totalShopOwners } = await supabase_1.supabaseAdmin
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'shop_owner');
            const { count: totalCrops } = await supabase_1.supabaseAdmin
                .from('crops')
                .select('*', { count: 'exact', head: true });
            const { count: activeCrops } = await supabase_1.supabaseAdmin
                .from('crops')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'active');
            const { count: notificationsSent } = await supabase_1.supabaseAdmin
                .from('notifications')
                .select('*', { count: 'exact', head: true });
            return res.status(200).json({
                totalFarmers: totalFarmers || 0,
                totalShopOwners: totalShopOwners || 0,
                totalCrops: totalCrops || 0,
                activeCrops: activeCrops || 0,
                notificationsSent: notificationsSent || 0
            });
        }
        catch (err) {
            next(err);
        }
    }
    // 1. Crop Master CRUD
    static async listCropMasters(req, res, next) {
        try {
            const { data, error } = await supabase_1.supabaseAdmin.from('crop_master').select('*');
            if (error)
                return res.status(400).json({ error: error.message });
            return res.status(200).json(data);
        }
        catch (err) {
            next(err);
        }
    }
    static async createCropMaster(req, res, next) {
        try {
            const { data, error } = await supabase_1.supabaseAdmin.from('crop_master').insert(req.body).select().single();
            if (error)
                return res.status(400).json({ error: error.message });
            return res.status(201).json(data);
        }
        catch (err) {
            next(err);
        }
    }
    static async updateCropMaster(req, res, next) {
        try {
            const { id } = req.params;
            const { data, error } = await supabase_1.supabaseAdmin.from('crop_master').update(req.body).eq('id', id).select().single();
            if (error)
                return res.status(400).json({ error: error.message });
            return res.status(200).json(data);
        }
        catch (err) {
            next(err);
        }
    }
    static async deleteCropMaster(req, res, next) {
        try {
            const { id } = req.params;
            const { error } = await supabase_1.supabaseAdmin.from('crop_master').delete().eq('id', id);
            if (error)
                return res.status(400).json({ error: error.message });
            return res.status(200).json({ message: 'Crop master deleted successfully' });
        }
        catch (err) {
            next(err);
        }
    }
    // 2. Crop Stages CRUD
    static async listStages(req, res, next) {
        try {
            const { data, error } = await supabase_1.supabaseAdmin.from('crop_stages').select('*');
            if (error)
                return res.status(400).json({ error: error.message });
            return res.status(200).json(data);
        }
        catch (err) {
            next(err);
        }
    }
    static async createStage(req, res, next) {
        try {
            const { data, error } = await supabase_1.supabaseAdmin.from('crop_stages').insert(req.body).select().single();
            if (error)
                return res.status(400).json({ error: error.message });
            return res.status(201).json(data);
        }
        catch (err) {
            next(err);
        }
    }
    static async updateStage(req, res, next) {
        try {
            const { id } = req.params;
            const { data, error } = await supabase_1.supabaseAdmin.from('crop_stages').update(req.body).eq('id', id).select().single();
            if (error)
                return res.status(400).json({ error: error.message });
            return res.status(200).json(data);
        }
        catch (err) {
            next(err);
        }
    }
    static async deleteStage(req, res, next) {
        try {
            const { id } = req.params;
            const { error } = await supabase_1.supabaseAdmin.from('crop_stages').delete().eq('id', id);
            if (error)
                return res.status(400).json({ error: error.message });
            return res.status(200).json({ message: 'Crop stage deleted' });
        }
        catch (err) {
            next(err);
        }
    }
    // Listing farmers for admin
    static async listFarmers(req, res, next) {
        try {
            const { data: farmers, error: farmersError } = await supabase_1.supabaseAdmin
                .from('profiles')
                .select('*')
                .eq('role', 'farmer');
            if (farmersError)
                return res.status(400).json({ error: farmersError.message });
            const { data: crops, error: cropsError } = await supabase_1.supabaseAdmin
                .from('crops')
                .select('*, crop_master(*)');
            const { data: shops, error: shopsError } = await supabase_1.supabaseAdmin
                .from('shops')
                .select('*');
            const joined = (farmers || []).map((farmer) => {
                const farmerCrops = (crops || []).filter((c) => c.user_id === farmer.user_id);
                const linkedShop = (shops || []).find((s) => s.id === farmer.shop_id);
                return {
                    ...farmer,
                    crops: farmerCrops,
                    shop: linkedShop || null
                };
            });
            return res.status(200).json(joined);
        }
        catch (err) {
            next(err);
        }
    }
    // Listing shops for admin
    static async listShops(req, res, next) {
        try {
            const { data: shops, error: shopsError } = await supabase_1.supabaseAdmin.from('shops').select('*');
            if (shopsError)
                return res.status(400).json({ error: shopsError.message });
            const { data: profiles, error: profilesError } = await supabase_1.supabaseAdmin
                .from('profiles')
                .select('*');
            if (profilesError)
                return res.status(400).json({ error: profilesError.message });
            const joined = shops.map((shop) => {
                const owner = profiles.find((p) => p.user_id === shop.owner_id);
                const linkedFarmers = profiles.filter((p) => p.role === 'farmer' && p.shop_id === shop.id);
                return {
                    ...shop,
                    owner: owner || null,
                    farmersCount: linkedFarmers.length,
                    farmers: linkedFarmers.map((f) => ({
                        id: f.id,
                        full_name: f.full_name,
                        mobile: f.mobile,
                        village: f.village,
                        taluka: f.taluka,
                        district: f.district
                    }))
                };
            });
            return res.status(200).json(joined);
        }
        catch (err) {
            next(err);
        }
    }
    // Broadcast notification to all users
    static async broadcastNotification(req, res, next) {
        try {
            const { title, message, type } = req.body;
            if (!title || !message || !type) {
                return res.status(400).json({ error: 'Title, message and type are required' });
            }
            const { data: profiles, error: fetchErr } = await supabase_1.supabaseAdmin.from('profiles').select('user_id');
            if (fetchErr)
                return res.status(400).json({ error: fetchErr.message });
            if (!profiles || profiles.length === 0) {
                return res.status(200).json({ message: 'No users registered to receive alerts' });
            }
            const notificationsToInsert = profiles.map((p) => ({
                user_id: p.user_id,
                title,
                message,
                type,
                is_read: false
            }));
            const { error: insertErr } = await supabase_1.supabaseAdmin.from('notifications').insert(notificationsToInsert);
            if (insertErr)
                return res.status(400).json({ error: insertErr.message });
            return res.status(200).json({ message: 'Alert broadcasted successfully to all users!' });
        }
        catch (err) {
            next(err);
        }
    }
    // Delete a farmer profile and auth account
    static async deleteFarmer(req, res, next) {
        try {
            const { id } = req.params;
            const { data: profile, error: profileError } = await supabase_1.supabaseAdmin
                .from('profiles')
                .select('user_id')
                .eq('id', id)
                .single();
            if (profileError || !profile) {
                return res.status(404).json({ error: 'Farmer profile not found' });
            }
            const userId = profile.user_id;
            // Delete the profile (cascading tables will clean up local data)
            const { error: deleteProfileError } = await supabase_1.supabaseAdmin
                .from('profiles')
                .delete()
                .eq('id', id);
            if (deleteProfileError) {
                return res.status(400).json({ error: deleteProfileError.message });
            }
            // Delete user from Supabase Auth
            const { error: deleteAuthError } = await supabase_1.supabaseAdmin.auth.admin.deleteUser(userId);
            if (deleteAuthError) {
                console.warn('Could not delete user from auth (likely mock user):', deleteAuthError.message);
            }
            return res.status(200).json({ message: 'Farmer deleted successfully' });
        }
        catch (err) {
            next(err);
        }
    }
    // Delete a shop, its owner's profile, and auth account
    static async deleteShop(req, res, next) {
        try {
            const { id } = req.params;
            const { data: shop, error: shopError } = await supabase_1.supabaseAdmin
                .from('shops')
                .select('owner_id')
                .eq('id', id)
                .single();
            if (shopError || !shop) {
                return res.status(404).json({ error: 'Shop not found' });
            }
            const ownerId = shop.owner_id;
            // Delete the shop
            const { error: deleteShopError } = await supabase_1.supabaseAdmin
                .from('shops')
                .delete()
                .eq('id', id);
            if (deleteShopError) {
                return res.status(400).json({ error: deleteShopError.message });
            }
            // Delete owner profile
            await supabase_1.supabaseAdmin
                .from('profiles')
                .delete()
                .eq('user_id', ownerId);
            // Delete owner from Auth
            const { error: deleteAuthError } = await supabase_1.supabaseAdmin.auth.admin.deleteUser(ownerId);
            if (deleteAuthError) {
                console.warn('Could not delete owner from auth:', deleteAuthError.message);
            }
            return res.status(200).json({ message: 'Shop and owner deleted successfully' });
        }
        catch (err) {
            next(err);
        }
    }
    // Toggle approval status for a shop
    static async toggleShopApproval(req, res, next) {
        try {
            const { id } = req.params;
            const { is_approved } = req.body;
            const { data, error } = await supabase_1.supabaseAdmin
                .from('shops')
                .update({ is_approved })
                .eq('id', id)
                .select()
                .single();
            if (error)
                return res.status(400).json({ error: error.message });
            return res.status(200).json(data);
        }
        catch (err) {
            next(err);
        }
    }
    // Diseases CRUD
    static async listDiseases(req, res, next) {
        try {
            const { data, error } = await supabase_1.supabaseAdmin.from('diseases').select('*');
            if (error)
                return res.status(400).json({ error: error.message });
            return res.status(200).json(data);
        }
        catch (err) {
            next(err);
        }
    }
    static async createDisease(req, res, next) {
        try {
            const { data, error } = await supabase_1.supabaseAdmin.from('diseases').insert(req.body).select().single();
            if (error)
                return res.status(400).json({ error: error.message });
            return res.status(201).json(data);
        }
        catch (err) {
            next(err);
        }
    }
    static async updateDisease(req, res, next) {
        try {
            const { id } = req.params;
            const { data, error } = await supabase_1.supabaseAdmin.from('diseases').update(req.body).eq('id', id).select().single();
            if (error)
                return res.status(400).json({ error: error.message });
            return res.status(200).json(data);
        }
        catch (err) {
            next(err);
        }
    }
    static async deleteDisease(req, res, next) {
        try {
            const { id } = req.params;
            const { error } = await supabase_1.supabaseAdmin.from('diseases').delete().eq('id', id);
            if (error)
                return res.status(400).json({ error: error.message });
            return res.status(200).json({ message: 'Disease deleted successfully' });
        }
        catch (err) {
            next(err);
        }
    }
    // Pests CRUD
    static async listPests(req, res, next) {
        try {
            const { data, error } = await supabase_1.supabaseAdmin.from('pests').select('*');
            if (error)
                return res.status(400).json({ error: error.message });
            return res.status(200).json(data);
        }
        catch (err) {
            next(err);
        }
    }
    static async createPest(req, res, next) {
        try {
            const { data, error } = await supabase_1.supabaseAdmin.from('pests').insert(req.body).select().single();
            if (error)
                return res.status(400).json({ error: error.message });
            return res.status(201).json(data);
        }
        catch (err) {
            next(err);
        }
    }
    static async updatePest(req, res, next) {
        try {
            const { id } = req.params;
            const { data, error } = await supabase_1.supabaseAdmin.from('pests').update(req.body).eq('id', id).select().single();
            if (error)
                return res.status(400).json({ error: error.message });
            return res.status(200).json(data);
        }
        catch (err) {
            next(err);
        }
    }
    static async deletePest(req, res, next) {
        try {
            const { id } = req.params;
            const { error } = await supabase_1.supabaseAdmin.from('pests').delete().eq('id', id);
            if (error)
                return res.status(400).json({ error: error.message });
            return res.status(200).json({ message: 'Pest deleted successfully' });
        }
        catch (err) {
            next(err);
        }
    }
    // Trigger weather advisory scan manually
    static async triggerWeatherAdvisories(req, res, next) {
        try {
            const result = await AdvisoryScheduler_1.AdvisoryScheduler.checkAndSendAdvisories();
            return res.status(200).json({
                message: 'Weather advisories scan triggered successfully',
                checkedDistricts: result.checked,
                notificationsSent: result.sent
            });
        }
        catch (err) {
            next(err);
        }
    }
    // Update landing page settings
    static async updateLandingPage(req, res, next) {
        try {
            const { data, error } = await supabase_1.supabaseAdmin
                .from('landing_page_settings')
                .update(req.body)
                .eq('id', 'landing_page_default')
                .select()
                .single();
            if (error) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(200).json(data);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AdminController = AdminController;
