import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

const isPlaceholder = supabaseUrl.includes('your-supabase-project') || 
                      supabaseServiceKey.includes('your-service-role-key') ||
                      !supabaseServiceKey.startsWith('ey');

const db: Record<string, any[]> = {
  profiles: [
    {
      id: 'mock-profile-id',
      user_id: 'mock-user-id',
      full_name: 'Sanchit Kadu',
      mobile: '9876543210',
      email: 'farmer@example.com',
      state: 'Maharashtra',
      district: 'Pune',
      taluka: 'Haveli',
      village: 'Manjri',
      role: 'farmer'
    }
  ],
  crops: [],
  crop_master: [
    { id: 'b30353c5-f761-460d-8521-4ea78e4726e6', name: 'Cotton (Kapus / कपास)', category: 'Cash Crop', duration_days: 150, expected_yield: '10-12 Quintals/Acre' },
    { id: 'd14467d0-1c09-411a-85ba-c189ef7dc6bb', name: 'Soybean (सोयाबीन)', category: 'Oilseed', duration_days: 100, expected_yield: '8-10 Quintals/Acre' },
    { id: 'f99617d1-e63d-4c8d-8fe0-cbb1fa0d7ff3', name: 'Wheat (Gahu / गेहूं)', category: 'Cereal', duration_days: 120, expected_yield: '15-20 Quintals/Acre' },
    { id: '0a7114bb-5e36-4d51-87ab-89cd34efab20', name: 'Rice (Bhat / धान / भात)', category: 'Cereal', duration_days: 130, expected_yield: '18-22 Quintals/Acre' },
    { id: '1b8224cc-6f47-5e62-98bc-90de45f0bc31', name: 'Sugarcane (Us / ऊस)', category: 'Cash Crop', duration_days: 360, expected_yield: '40-50 Tons/Acre' },
    { id: '2c9335dd-7a58-6f73-a9cd-01ef56f1cd42', name: 'Tur / Pigeon Pea (तूर)', category: 'Pulse', duration_days: 160, expected_yield: '6-8 Quintals/Acre' },
    { id: '3d0446ee-8b69-7a84-bade-12fe67f2de53', name: 'Chickpea / Harbhara (हरभरा)', category: 'Pulse', duration_days: 110, expected_yield: '7-9 Quintals/Acre' },
    { id: '4e1557ff-9c7a-8b95-cbef-230f78f3ef64', name: 'Groundnut (Bhuimug / भुईमूग)', category: 'Oilseed', duration_days: 120, expected_yield: '10-12 Quintals/Acre' },
    { id: '5f2668aa-bd8b-9ca6-dcf0-341a89f4f075', name: 'Onion (Kanda / कांदा)', category: 'Vegetable', duration_days: 120, expected_yield: '100-120 Quintals/Acre' },
    { id: '6a3779bb-ce9c-ad07-edf1-452b90f50186', name: 'Tomato (टोमॅटो)', category: 'Vegetable', duration_days: 110, expected_yield: '150-200 Quintals/Acre' },
    { id: '7b4880cc-dfad-be18-fef2-563c01f61297', name: 'Maize (Maka / मका)', category: 'Cereal', duration_days: 110, expected_yield: '20-25 Quintals/Acre' },
    { id: '8c5991dd-e0be-cf29-0fa3-674d12f723a8', name: 'Bajra (बाजरी)', category: 'Cereal', duration_days: 90, expected_yield: '8-10 Quintals/Acre' },
    { id: '9d6002ee-f1cf-d03a-1ab4-785e23f834b9', name: 'Jowar (ज्वारी)', category: 'Cereal', duration_days: 110, expected_yield: '10-12 Quintals/Acre' },
    { id: 'ae7113ff-02df-e14b-2bc5-896f34f945ca', name: 'Grapes (Drakshe / द्राक्षे)', category: 'Fruit', duration_days: 150, expected_yield: '10-12 Tons/Acre' },
    { id: 'bf8224aa-13e0-f25c-3cd6-9a7f45a056db', name: 'Pomegranate (Dalimb / डाळिंब)', category: 'Fruit', duration_days: 180, expected_yield: '6-8 Tons/Acre' },
    { id: 'c09335bb-24f1-036d-4de7-ab8f56b167ec', name: 'Mango (Amba / आंबा)', category: 'Fruit', duration_days: 365, expected_yield: '4-5 Tons/Acre' },
    { id: 'd10446cc-3502-147e-5ef8-bc9f67c278ed', name: 'Banana (Keli / केळी)', category: 'Fruit', duration_days: 300, expected_yield: '25-30 Tons/Acre' },
    { id: 'e21557dd-4613-258f-6f09-cd0f78d389fe', name: 'Turmeric (Halad / हळद)', category: 'Spices', duration_days: 240, expected_yield: '20-25 Quintals/Acre' },
    { id: 'f32668ee-5724-369f-7f1a-de1f89e49aff', name: 'Ginger (Ale / आले)', category: 'Spices', duration_days: 240, expected_yield: '15-20 Quintals/Acre' },
    { id: '043779ff-6835-47af-8f2b-ef2f9af50b00', name: 'Chilli (Mirchi / मिरची)', category: 'Vegetable', duration_days: 150, expected_yield: '8-10 Tons/Acre' }
  ],
  crop_stages: [
    { id: 'c01', crop_master_id: 'b30353c5-f761-460d-8521-4ea78e4726e6', stage_name: 'Sowing & Germination', start_day: 1, end_day: 15 },
    { id: 'c02', crop_master_id: 'b30353c5-f761-460d-8521-4ea78e4726e6', stage_name: 'Vegetative Phase', start_day: 16, end_day: 45 },
    { id: 's01', crop_master_id: 'd14467d0-1c09-411a-85ba-c189ef7dc6bb', stage_name: 'Sowing & Seedling', start_day: 1, end_day: 20 },
    { id: 's02', crop_master_id: 'd14467d0-1c09-411a-85ba-c189ef7dc6bb', stage_name: 'Flowering stage', start_day: 21, end_day: 50 }
  ],
  fertilizer_schedule: [
    { id: 'f1', crop_master_id: 'b30353c5-f761-460d-8521-4ea78e4726e6', stage_id: 'c01', fertilizer_name: 'Urea & SSP', quantity: 'Urea 20kg + SSP 75kg/acre' },
    { id: 'f2', crop_master_id: 'b30353c5-f761-460d-8521-4ea78e4726e6', stage_id: 'c02', fertilizer_name: 'NPK 19:19:19', quantity: 'NPK 1kg/acre' }
  ],
  spray_schedule: [
    { id: 'sp1', crop_master_id: 'b30353c5-f761-460d-8521-4ea78e4726e6', stage_id: 'c02', spray_name: 'Neem Oil (1500 ppm)' }
  ],
  irrigation_schedule: [
    { id: 'i1', crop_master_id: 'b30353c5-f761-460d-8521-4ea78e4726e6', stage_id: 'c01', water_requirement: 'Light watering' }
  ],
  diseases: [],
  pests: [],
  notifications: [],
  weather_cache: []
};

const mockAuthUsers: any[] = [
  {
    id: 'mock-user-id',
    phone: '+919876543210',
    email: 'farmer@example.com',
    user_metadata: {
      full_name: 'Sanchit Kadu'
    }
  }
];

// Helper to create chainable query builders
const createChainableQuery = (tableName: string) => {
  let list = db[tableName] || [];
  let currentFilter = [...list];

  const query: any = {
    select: (columns?: string) => {
      // Mock joins
      if (columns && columns.includes('*') && columns.includes('crop_master')) {
        currentFilter = currentFilter.map(item => {
          const master = db.crop_master.find(m => m.id === item.crop_master_id);
          return { ...item, crop_master: master };
        });
      }
      return query;
    },
    eq: (col: string, val: any) => {
      currentFilter = currentFilter.filter(item => item[col] === val);
      return query;
    },
    in: (col: string, vals: any[]) => {
      currentFilter = currentFilter.filter(item => vals.includes(item[col]));
      return query;
    },
    gt: (col: string, val: any) => {
      currentFilter = currentFilter.filter(item => item[col] > val);
      return query;
    },
    order: (col: string, options?: any) => {
      currentFilter.sort((a, b) => (a[col] > b[col] ? 1 : -1));
      if (options?.ascending === false) {
        currentFilter.reverse();
      }
      return query;
    },
    single: async () => {
      if (currentFilter.length === 0) {
        return { data: null, error: { message: 'Row not found' } };
      }
      return { data: currentFilter[0], error: null };
    },
    insert: (payload: any) => {
      const records = Array.isArray(payload) ? payload : [payload];
      const inserted = records.map(r => {
        const item = { id: Math.random().toString(36).substring(7), ...r, created_at: new Date().toISOString() };
        db[tableName].push(item);
        return item;
      });
      currentFilter = inserted;
      return query;
    },
    update: (payload: any) => {
      currentFilter.forEach(item => {
        Object.assign(item, payload);
      });
      return query;
    },
    delete: () => {
      const idsToDelete = currentFilter.map(item => item.id);
      db[tableName] = db[tableName].filter(item => !idsToDelete.includes(item.id));
      return { error: null };
    },
    // Allows direct await evaluation
    then: (onfulfilled: any) => {
      onfulfilled({ data: currentFilter, count: currentFilter.length, error: null });
    }
  };

  return query;
};

// Create Mock Supabase Client structure
const mockSupabase = {
  auth: {
    signInWithOtp: async ({ phone }: { phone: string }) => {
      return { data: {}, error: null };
    },
    verifyOtp: async ({ phone, token }: { phone: string; token: string }) => {
      const mobile = phone.replace('+91', '');
      return {
        data: {
          session: { access_token: 'mock-session-token' }
        },
        error: null
      };
    },
    admin: {
      createUser: async (payload: any) => {
        const user = {
          id: Math.random().toString(36).substring(7),
          phone: payload.phone,
          email: payload.email,
          user_metadata: payload.user_metadata
        };
        mockAuthUsers.push(user);
        return { data: { user }, error: null };
      },
      listUsers: async () => {
        return { data: { users: mockAuthUsers }, error: null };
      },
      generateLink: async (payload: any) => {
        return { data: { properties: { action_link: '#' } }, error: null };
      }
    },
    getUser: async (token: string) => {
      // Find matching user from mock profiles/users
      const user = mockAuthUsers[0] || { id: 'mock-user-id', phone: '+919999999999' };
      return { data: { user }, error: null };
    }
  },
  from: (tableName: string) => {
    if (!db[tableName]) {
      db[tableName] = [];
    }
    return createChainableQuery(tableName);
  }
};

export const supabaseAdmin = isPlaceholder
  ? (mockSupabase as any)
  : createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
