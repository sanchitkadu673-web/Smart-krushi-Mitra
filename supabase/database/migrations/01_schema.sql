-- Supabase Database Schema for Smart Krushi Mitra
-- Enables UUID and necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ROLES TYPE
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('farmer', 'admin', 'super_admin', 'shop_owner', 'expert');
EXCEPTION WHEN duplicate_object THEN 
    -- If exists, try adding new values
    BEGIN ALTER TYPE user_role ADD VALUE 'super_admin'; EXCEPTION WHEN duplicate_object THEN null; END;
    BEGIN ALTER TYPE user_role ADD VALUE 'shop_owner'; EXCEPTION WHEN duplicate_object THEN null; END;
    BEGIN ALTER TYPE user_role ADD VALUE 'expert'; EXCEPTION WHEN duplicate_object THEN null; END;
END $$;

DO $$ BEGIN
    CREATE TYPE crop_status AS ENUM ('active', 'harvested', 'abandoned');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE alert_type AS ENUM ('fertilizer', 'spray', 'pest', 'disease', 'irrigation', 'harvest', 'weather');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    taluka TEXT NOT NULL,
    village TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'farmer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CROP MASTER TABLE
CREATE TABLE IF NOT EXISTS public.crop_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    duration_days INTEGER NOT NULL,
    expected_yield TEXT NOT NULL,
    description TEXT,
    varieties TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CROPS TABLE (Farmer's registered crops)
CREATE TABLE IF NOT EXISTS public.crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    crop_master_id UUID REFERENCES public.crop_master(id) ON DELETE RESTRICT,
    sowing_date DATE NOT NULL,
    area NUMERIC(10, 2),
    variety TEXT,
    farming_type TEXT DEFAULT 'irrigated',
    status crop_status NOT NULL DEFAULT 'active',
    ai_schedule_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CROP STAGES TABLE
CREATE TABLE IF NOT EXISTS public.crop_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_master_id UUID REFERENCES public.crop_master(id) ON DELETE CASCADE,
    stage_name TEXT NOT NULL,
    start_day INTEGER NOT NULL,
    end_day INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- FERTILIZER SCHEDULE TABLE
CREATE TABLE IF NOT EXISTS public.fertilizer_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_master_id UUID REFERENCES public.crop_master(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES public.crop_stages(id) ON DELETE CASCADE,
    fertilizer_name TEXT NOT NULL,
    quantity TEXT NOT NULL, -- e.g., "50 kg/acre"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SPRAY SCHEDULE TABLE
CREATE TABLE IF NOT EXISTS public.spray_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_master_id UUID REFERENCES public.crop_master(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES public.crop_stages(id) ON DELETE CASCADE,
    spray_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- IRRIGATION SCHEDULE TABLE
CREATE TABLE IF NOT EXISTS public.irrigation_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_master_id UUID REFERENCES public.crop_master(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES public.crop_stages(id) ON DELETE CASCADE,
    water_requirement TEXT NOT NULL, -- e.g., "Moderate", "High", "50mm"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- DISEASES TABLE
CREATE TABLE IF NOT EXISTS public.diseases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_master_id UUID REFERENCES public.crop_master(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    symptoms TEXT NOT NULL,
    treatment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PESTS TABLE
CREATE TABLE IF NOT EXISTS public.pests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_master_id UUID REFERENCES public.crop_master(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    symptoms TEXT NOT NULL,
    control_method TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type alert_type NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- WEATHER CACHE TABLE
CREATE TABLE IF NOT EXISTS public.weather_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location TEXT NOT NULL UNIQUE, -- e.g., "lat,lng" or taluka name
    weather_data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    performed_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TRIGGERS & FUNCTIONS FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
DROP TRIGGER IF EXISTS update_crops_updated_at ON public.crops;
CREATE TRIGGER update_crops_updated_at BEFORE UPDATE ON public.crops FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fertilizer_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spray_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.irrigation_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
CREATE POLICY "Allow users to update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Allow users to insert own profile" ON public.profiles;
CREATE POLICY "Allow users to insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND (role = 'admin'::user_role OR role = 'super_admin'::user_role)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Crop Master Policies
DROP POLICY IF EXISTS "Allow public read to crop master" ON public.crop_master;
CREATE POLICY "Allow public read to crop master" ON public.crop_master FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow admins to manage crop master" ON public.crop_master;
CREATE POLICY "Allow admins to manage crop master" ON public.crop_master FOR ALL USING (public.is_admin());

-- 3. Crops Policies
DROP POLICY IF EXISTS "Allow users to view own crops" ON public.crops;
CREATE POLICY "Allow users to view own crops" ON public.crops FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "Allow users to manage own crops" ON public.crops;
CREATE POLICY "Allow users to manage own crops" ON public.crops FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- 4. Crop Stages Policies
DROP POLICY IF EXISTS "Allow public read to crop stages" ON public.crop_stages;
CREATE POLICY "Allow public read to crop stages" ON public.crop_stages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow admins to manage crop stages" ON public.crop_stages;
CREATE POLICY "Allow admins to manage crop stages" ON public.crop_stages FOR ALL USING (public.is_admin());

-- 5. Fertilizer Policies
DROP POLICY IF EXISTS "Allow public read to fertilizer schedule" ON public.fertilizer_schedule;
CREATE POLICY "Allow public read to fertilizer schedule" ON public.fertilizer_schedule FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow admins to manage fertilizer schedule" ON public.fertilizer_schedule;
CREATE POLICY "Allow admins to manage fertilizer schedule" ON public.fertilizer_schedule FOR ALL USING (public.is_admin());

-- 6. Spray Policies
DROP POLICY IF EXISTS "Allow public read to spray schedule" ON public.spray_schedule;
CREATE POLICY "Allow public read to spray schedule" ON public.spray_schedule FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow admins to manage spray schedule" ON public.spray_schedule;
CREATE POLICY "Allow admins to manage spray schedule" ON public.spray_schedule FOR ALL USING (public.is_admin());

-- 7. Irrigation Policies
DROP POLICY IF EXISTS "Allow public read to irrigation schedule" ON public.irrigation_schedule;
CREATE POLICY "Allow public read to irrigation schedule" ON public.irrigation_schedule FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow admins to manage irrigation schedule" ON public.irrigation_schedule;
CREATE POLICY "Allow admins to manage irrigation schedule" ON public.irrigation_schedule FOR ALL USING (public.is_admin());

-- 8. Diseases Policies
DROP POLICY IF EXISTS "Allow public read to diseases" ON public.diseases;
CREATE POLICY "Allow public read to diseases" ON public.diseases FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow admins to manage diseases" ON public.diseases;
CREATE POLICY "Allow admins to manage diseases" ON public.diseases FOR ALL USING (public.is_admin());

-- 9. Pests Policies
DROP POLICY IF EXISTS "Allow public read to pests" ON public.pests;
CREATE POLICY "Allow public read to pests" ON public.pests FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow admins to manage pests" ON public.pests;
CREATE POLICY "Allow admins to manage pests" ON public.pests FOR ALL USING (public.is_admin());

-- 10. Notifications Policies
DROP POLICY IF EXISTS "Allow users to manage own notifications" ON public.notifications;
CREATE POLICY "Allow users to manage own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- 11. Weather Cache Policies
DROP POLICY IF EXISTS "Allow public read to weather cache" ON public.weather_cache;
CREATE POLICY "Allow public read to weather cache" ON public.weather_cache FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow admins to manage weather cache" ON public.weather_cache;
CREATE POLICY "Allow admins to manage weather cache" ON public.weather_cache FOR ALL USING (public.is_admin());

-- 12. Audit Logs Policies
DROP POLICY IF EXISTS "Allow admins to view audit logs" ON public.audit_logs;
CREATE POLICY "Allow admins to view audit logs" ON public.audit_logs FOR SELECT USING (public.is_admin());
DROP POLICY IF EXISTS "Allow insert audit logs" ON public.audit_logs;
CREATE POLICY "Allow insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_crops_user_id ON public.crops(user_id);
CREATE INDEX IF NOT EXISTS idx_crop_stages_crop_master_id ON public.crop_stages(crop_master_id);
CREATE INDEX IF NOT EXISTS idx_fertilizer_stage_id ON public.fertilizer_schedule(stage_id);
CREATE INDEX IF NOT EXISTS idx_spray_stage_id ON public.spray_schedule(stage_id);
CREATE INDEX IF NOT EXISTS idx_irrigation_stage_id ON public.irrigation_schedule(stage_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON public.notifications(user_id, is_read);

-- ==========================================
-- PHASE 1: NEW TABLES FOR PLATFORM EXPANSION
-- ==========================================

-- SHOPS TABLE
CREATE TABLE IF NOT EXISTS public.shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    shop_name TEXT NOT NULL,
    license_number TEXT NOT NULL,
    gps_lat TEXT,
    gps_lng TEXT,
    address TEXT NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g., Fertilizer, Pesticide, Seed
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- EXPERTS TABLE
CREATE TABLE IF NOT EXISTS public.experts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    specialization TEXT NOT NULL,
    qualification TEXT NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- EXPERT QUERIES TABLE
CREATE TABLE IF NOT EXISTS public.expert_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    expert_id UUID REFERENCES public.experts(id) ON DELETE SET NULL,
    question TEXT NOT NULL,
    answer TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, answered
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PRODUCT REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.product_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS FOR NEW TABLES
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_requests ENABLE ROW LEVEL SECURITY;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_shops_updated_at ON public.shops;
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON public.shops FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS update_expert_queries_updated_at ON public.expert_queries;
CREATE TRIGGER update_expert_queries_updated_at BEFORE UPDATE ON public.expert_queries FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS update_product_requests_updated_at ON public.product_requests;
CREATE TRIGGER update_product_requests_updated_at BEFORE UPDATE ON public.product_requests FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Add shop_id reference to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS shop_id UUID REFERENCES public.shops(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_shop_id ON public.profiles(shop_id);
