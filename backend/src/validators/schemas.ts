import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  state: z.string().min(1, 'State is required'),
  district: z.string().min(1, 'District is required'),
  taluka: z.string().min(1, 'Taluka is required'),
  village: z.string().min(1, 'Village is required'),
  role: z.enum(['farmer', 'admin']).optional().default('farmer')
});

export const otpSendSchema = z.object({
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number').optional(),
  email: z.string().email('Invalid email address').optional()
});

export const otpVerifySchema = z.object({
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number').optional(),
  email: z.string().email('Invalid email address').optional(),
  otp: z.string().length(6, 'OTP must be exactly 6 digits')
});

export const addCropSchema = z.object({
  cropMasterId: z.string().uuid('Invalid Crop Master reference'),
  sowingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Sowing date must be YYYY-MM-DD'),
  area: z.number().positive('Area must be a positive number').optional(),
  variety: z.string().optional(),
  farmingType: z.enum(['irrigated', 'rainfed']).optional().default('irrigated'),
  status: z.enum(['active', 'harvested', 'abandoned']).optional()
});

export const updateCropSchema = addCropSchema.partial();

export const adminCropMasterSchema = z.object({
  name: z.string().min(1, 'Crop name required'),
  category: z.string().min(1, 'Category required'),
  durationDays: z.number().int().positive('Duration must be positive'),
  expectedYield: z.string().min(1, 'Expected yield required')
});
