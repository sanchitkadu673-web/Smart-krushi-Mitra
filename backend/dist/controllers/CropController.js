"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CropController = void 0;
const supabase_1 = require("../config/supabase");
const schemas_1 = require("../validators/schemas");
const NotificationService_1 = require("../services/NotificationService");
class CropController {
    static async listCropMasters(req, res, next) {
        try {
            const { data, error } = await supabase_1.supabaseAdmin.from('crop_master').select('*');
            if (error) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(200).json(data);
        }
        catch (err) {
            next(err);
        }
    }
    static async listCrops(req, res, next) {
        try {
            const userId = req.user?.id;
            const { data: crops, error } = await supabase_1.supabaseAdmin
                .from('crops')
                .select('*, crop_master(*)')
                .eq('user_id', userId);
            if (error) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(200).json(crops);
        }
        catch (err) {
            next(err);
        }
    }
    static async createCrop(req, res, next) {
        try {
            const userId = req.user?.id;
            const validated = schemas_1.addCropSchema.parse(req.body);
            const { data: crop, error } = await supabase_1.supabaseAdmin
                .from('crops')
                .insert({
                user_id: userId,
                crop_master_id: validated.cropMasterId,
                sowing_date: validated.sowingDate,
                area: validated.area,
                variety: validated.variety,
                farming_type: validated.farmingType,
                status: validated.status || 'active'
            })
                .select('*, crop_master(*)')
                .single();
            if (error) {
                return res.status(400).json({ error: error.message });
            }
            // Generate crop notifications immediately upon registering a crop
            await NotificationService_1.NotificationService.generateCropNotifications(crop.id);
            // --- AI Generation ---
            try {
                const { AiService } = require('../services/AiService');
                const cropName = crop.crop_master?.name || 'Unknown Crop';
                const aiData = await AiService.generateCropSchedule(cropName, crop.sowing_date, validated.soilType || undefined, validated.soilReport || undefined, validated.soilReportMime || undefined);
                // Update crop with AI data
                await supabase_1.supabaseAdmin
                    .from('crops')
                    .update({ ai_schedule_data: aiData })
                    .eq('id', crop.id);
                crop.ai_schedule_data = aiData;
            }
            catch (aiErr) {
                console.error("AI Generation failed:", aiErr);
            }
            return res.status(201).json(crop);
        }
        catch (err) {
            next(err);
        }
    }
    static async getCropDetails(req, res, next) {
        try {
            const userId = req.user?.id;
            const { id } = req.params;
            const { data: crop, error } = await supabase_1.supabaseAdmin
                .from('crops')
                .select('*, crop_master(*)')
                .eq('id', id)
                .single();
            if (error || !crop) {
                return res.status(404).json({ error: 'Crop not found' });
            }
            // Verify ownership
            if (crop.user_id !== userId && req.user?.role !== 'admin') {
                return res.status(403).json({ error: 'Forbidden: Access restricted to crop owner' });
            }
            return res.status(200).json(crop);
        }
        catch (err) {
            next(err);
        }
    }
    static async updateCrop(req, res, next) {
        try {
            const userId = req.user?.id;
            const { id } = req.params;
            const validated = schemas_1.updateCropSchema.parse(req.body);
            // Verify ownership first
            const { data: existing } = await supabase_1.supabaseAdmin
                .from('crops')
                .select('user_id')
                .eq('id', id)
                .single();
            if (!existing) {
                return res.status(404).json({ error: 'Crop not found' });
            }
            if (existing.user_id !== userId && req.user?.role !== 'admin') {
                return res.status(403).json({ error: 'Forbidden: Access restricted to crop owner' });
            }
            const { data: crop, error } = await supabase_1.supabaseAdmin
                .from('crops')
                .update({
                sowing_date: validated.sowingDate,
                area: validated.area,
                variety: validated.variety,
                farming_type: validated.farmingType,
                status: validated.status
            })
                .eq('id', id)
                .select('*, crop_master(*)')
                .single();
            if (error) {
                return res.status(400).json({ error: error.message });
            }
            // Regenerate notifications in case date/stage changed
            await NotificationService_1.NotificationService.generateCropNotifications(crop.id);
            return res.status(200).json(crop);
        }
        catch (err) {
            next(err);
        }
    }
    static async deleteCrop(req, res, next) {
        try {
            const userId = req.user?.id;
            const { id } = req.params;
            const { data: existing } = await supabase_1.supabaseAdmin
                .from('crops')
                .select('user_id')
                .eq('id', id)
                .single();
            if (!existing) {
                return res.status(404).json({ error: 'Crop not found' });
            }
            if (existing.user_id !== userId && req.user?.role !== 'admin') {
                return res.status(403).json({ error: 'Forbidden: Access restricted to crop owner' });
            }
            const { error } = await supabase_1.supabaseAdmin
                .from('crops')
                .delete()
                .eq('id', id);
            if (error) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(200).json({ message: 'Crop deleted successfully' });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.CropController = CropController;
