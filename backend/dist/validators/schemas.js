"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCropMasterSchema = exports.updateCropSchema = exports.addCropSchema = exports.otpVerifySchema = exports.otpSendSchema = exports.loginPasswordSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    mobile: zod_1.z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
    email: zod_1.z.string().email('Invalid email address').optional().or(zod_1.z.literal('')),
    state: zod_1.z.string().min(1, 'State is required'),
    district: zod_1.z.string().min(1, 'District is required'),
    taluka: zod_1.z.string().min(1, 'Taluka is required'),
    village: zod_1.z.string().min(1, 'Village is required'),
    role: zod_1.z.enum(['farmer', 'admin', 'super_admin', 'shop_owner', 'expert']).optional().default('farmer'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters').optional().or(zod_1.z.literal('')),
    shopName: zod_1.z.string().optional().or(zod_1.z.literal('')),
    gstNumber: zod_1.z.string().optional().or(zod_1.z.literal(''))
}).superRefine((data, ctx) => {
    if (data.role === 'shop_owner') {
        if (!data.password) {
            ctx.addIssue({ path: ['password'], code: zod_1.z.ZodIssueCode.custom, message: 'Password is required for Shop Owners' });
        }
        if (!data.shopName) {
            ctx.addIssue({ path: ['shopName'], code: zod_1.z.ZodIssueCode.custom, message: 'Shop Name is required for Shop Owners' });
        }
        // GST number might be optional for some, but user requested it. We can make it required.
        if (!data.gstNumber) {
            ctx.addIssue({ path: ['gstNumber'], code: zod_1.z.ZodIssueCode.custom, message: 'GST Number is required for Shop Owners' });
        }
    }
});
exports.loginPasswordSchema = zod_1.z.object({
    mobile: zod_1.z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
    password: zod_1.z.string().min(6, 'Password required')
});
exports.otpSendSchema = zod_1.z.object({
    mobile: zod_1.z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number').optional(),
    email: zod_1.z.string().email('Invalid email address').optional()
});
exports.otpVerifySchema = zod_1.z.object({
    mobile: zod_1.z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number').optional(),
    email: zod_1.z.string().email('Invalid email address').optional(),
    otp: zod_1.z.string().length(6, 'OTP must be exactly 6 digits')
});
exports.addCropSchema = zod_1.z.object({
    cropMasterId: zod_1.z.string().uuid('Invalid Crop Master reference'),
    sowingDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Sowing date must be YYYY-MM-DD'),
    area: zod_1.z.number().positive('Area must be a positive number').optional().nullable(),
    variety: zod_1.z.string().optional().nullable(),
    farmingType: zod_1.z.enum(['irrigated', 'rainfed']).optional().default('irrigated'),
    status: zod_1.z.enum(['active', 'harvested', 'abandoned']).optional(),
    soilType: zod_1.z.string().optional().nullable(),
    soilReport: zod_1.z.string().optional().nullable(),
    soilReportMime: zod_1.z.string().optional().nullable()
});
exports.updateCropSchema = exports.addCropSchema.partial();
exports.adminCropMasterSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Crop name required'),
    category: zod_1.z.string().min(1, 'Category required'),
    durationDays: zod_1.z.number().int().positive('Duration must be positive'),
    expectedYield: zod_1.z.string().min(1, 'Expected yield required')
});
