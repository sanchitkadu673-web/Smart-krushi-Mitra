import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

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
      role: 'farmer',
      shop_id: 'mock-shop-id'
    },
    {
      id: 'mock-shop-owner-profile-id',
      user_id: 'mock-shop-owner-user-id',
      full_name: 'Sanchit ShopOwner',
      mobile: '9876543211',
      email: 'shop@example.com',
      state: 'Maharashtra',
      district: 'Pune',
      taluka: 'Haveli',
      village: 'Manjri',
      role: 'shop_owner'
    },
    {
      id: 'mock-admin-profile-id',
      user_id: 'mock-admin-user-id',
      full_name: 'Sanchit Admin',
      mobile: '9876543212',
      email: 'admin@example.com',
      state: 'Maharashtra',
      district: 'Pune',
      taluka: 'Haveli',
      village: 'Manjri',
      role: 'super_admin'
    },
    {
      id: 'mock-shop-owner-profile-id-kanha',
      user_id: 'mock-shop-owner-user-id-kanha',
      full_name: 'kanha patil',
      mobile: '8767366337',
      email: 'kanha@example.com',
      state: 'Maharashtra',
      district: 'Akola',
      taluka: 'Akot',
      village: 'Akola',
      role: 'shop_owner'
    }
  ],
  shops: [
    {
      id: 'mock-shop-id',
      owner_id: 'mock-shop-owner-user-id',
      shop_name: 'Kadu Krushi Seva Kendra',
      license_number: '27AADCB2230M1Z2',
      address: 'Manjri, Haveli, Pune, Maharashtra',
      is_approved: true
    },
    {
      id: 'mock-shop-id-kanha',
      owner_id: 'mock-shop-owner-user-id-kanha',
      shop_name: 'kanha krushi seva kendr',
      license_number: '27ABCD14541565',
      address: 'akola, Akot, Akola, Maharashtra',
      is_approved: true
    }
  ],
  products: [
    {
      id: 'mock-product-1',
      shop_id: 'mock-shop-id',
      name: 'Urea 46%',
      company: 'IFFCO',
      category: 'Fertilizer',
      price: 266.50,
      stock_quantity: 50,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'mock-product-2',
      shop_id: 'mock-shop-id',
      name: '10:26:26 NPK',
      company: 'IFFCO',
      category: 'Fertilizer',
      price: 1470.00,
      stock_quantity: 30,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'mock-product-3',
      shop_id: 'mock-shop-id',
      name: 'Neem Oil',
      company: 'Growell',
      category: 'Pesticide',
      price: 350.00,
      stock_quantity: 15,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  crops: [],
  crop_master: [
    { 
      id: 'b30353c5-f761-460d-8521-4ea78e4726e6', 
      name: 'Cotton (Kapus / कपास)', 
      category: 'Cash Crop', 
      duration_days: 150, 
      expected_yield: '10-12 Quintals/Acre',
      description: 'Cotton is a major cash crop in India, grown in tropical and subtropical regions. It requires well-drained deep black clayey soil (Regur).',
      varieties: 'Bt Cotton (Kanak, Bunny, Maruti), Non-Bt (NHH-44)'
    },
    { 
      id: 'd14467d0-1c09-411a-85ba-c189ef7dc6bb', 
      name: 'Soybean (सोयाबीन)', 
      category: 'Oilseed', 
      duration_days: 100, 
      expected_yield: '8-10 Quintals/Acre',
      description: 'Soybean is a key oilseed crop rich in protein, widely cultivated in Central India during the Kharif season.',
      varieties: 'JS 335, JS 93-05, MACS 1188, Phule Sangam (KDS-726)'
    },
    { 
      id: 'f99617d1-e63d-4c8d-8fe0-cbb1fa0d7ff3', 
      name: 'Wheat (Gahu / गेहूं)', 
      category: 'Cereal', 
      duration_days: 120, 
      expected_yield: '15-20 Quintals/Acre',
      description: 'Wheat is a vital Rabi cereal crop, requiring cool growing weather, moderate rain, and clayey loam soils.',
      varieties: 'Lok-1, GW 496, HD 2189, MACS 2496'
    },
    { 
      id: '0a7114bb-5e36-4d51-87ab-89cd34efab20', 
      name: 'Rice (Bhat / धान / भात)', 
      category: 'Cereal', 
      duration_days: 130, 
      expected_yield: '18-22 Quintals/Acre',
      description: 'Rice is the staple Kharif crop requiring high temperatures, high humidity, and standing water during its early stages.',
      varieties: 'Indrayani, Basmati 370, Jaya, Phule Samrudhi'
    },
    { 
      id: '1b8224cc-6f47-5e62-98bc-90de45f0bc31', 
      name: 'Sugarcane (Us / ऊस)', 
      category: 'Cash Crop', 
      duration_days: 360, 
      expected_yield: '40-50 Tons/Acre',
      description: 'Sugarcane is a long-duration tropical cash crop requiring high temperatures, abundant water, and fertile soils.',
      varieties: 'Co 86032 (Nira), CoM 0265 (Phule 265), Co 92005'
    },
    { 
      id: '2c9335dd-7a58-6f73-a9cd-01ef56f1cd42', 
      name: 'Tur / Pigeon Pea (तूर)', 
      category: 'Pulse', 
      duration_days: 160, 
      expected_yield: '6-8 Quintals/Acre',
      description: 'Pigeon pea is an important legume crop rich in protein, cultivated primarily as a rainfed crop in semi-arid areas.',
      varieties: 'Vipula, BDN 711, BSMR 736 (Maruti), Phule Rajeshwari'
    },
    { 
      id: '3d0446ee-8b69-7a84-bade-12fe67f2de53', 
      name: 'Chickpea / Harbhara (हरभरा)', 
      category: 'Pulse', 
      duration_days: 110, 
      expected_yield: '7-9 Quintals/Acre',
      description: 'Harbhara is a major Rabi pulse crop that thrives in cool weather and residual soil moisture.',
      varieties: 'Vijay, Digvijay, JAKI 9218, Phule Vikram'
    },
    { 
      id: '4e1557ff-9c7a-8b95-cbef-230f78f3ef64', 
      name: 'Groundnut (Bhuimug / भुईमूग)', 
      category: 'Oilseed', 
      duration_days: 120, 
      expected_yield: '10-12 Quintals/Acre',
      description: 'Groundnut is an essential oilseed crop that grows well in sandy loam soils and requires moderate rainfall.',
      varieties: 'TAG 24, Phule Vyas, SB 11, TG 37A'
    },
    { 
      id: '5f2668aa-bd8b-9ca6-dcf0-341a89f4f075', 
      name: 'Onion (Kanda / कांदा)', 
      category: 'Vegetable', 
      duration_days: 120, 
      expected_yield: '100-120 Quintals/Acre',
      description: 'Onion is a high-value vegetable crop grown across multiple seasons (Kharif, Late Kharif, Rabi) in well-drained loamy soils.',
      varieties: 'N-2-4-1, Baswant 780, Phule Suvarna, Bhima Kiran'
    },
    { 
      id: '6a3779bb-ce9c-ad07-edf1-452b90f50186', 
      name: 'Tomato (टोमॅटो)', 
      category: 'Vegetable', 
      duration_days: 110, 
      expected_yield: '150-200 Quintals/Acre',
      description: 'Tomato is a widely grown commercial vegetable crop sensitive to frost and waterlogging.',
      varieties: 'Abhinav, Jayshree, Phule Raja, Vaishali'
    },
    { 
      id: '7b4880cc-dfad-be18-fef2-563c01f61297', 
      name: 'Maize (Maka / मका)', 
      category: 'Cereal', 
      duration_days: 110, 
      expected_yield: '20-25 Quintals/Acre',
      description: 'Maize is a versatile crop used for food, fodder, and industrial feed, growing in diverse climatic conditions.',
      varieties: 'Rajarshi, Ganga 11, Pioneer 30V92, Dekalb 9108'
    },
    { 
      id: '8c5991dd-e0be-cf29-0fa3-674d12f723a8', 
      name: 'Bajra (बाजरी)', 
      category: 'Cereal', 
      duration_days: 90, 
      expected_yield: '8-10 Quintals/Acre',
      description: 'Pearl millet is a drought-tolerant millet crop grown in sandy soils and dry, warm areas.',
      varieties: 'ICTP 8203, Phule Aadishakti, Pioneer 86M86, Shraddha'
    },
    { 
      id: '9d6002ee-f1cf-d03a-1ab4-785e23f834b9', 
      name: 'Jowar (ज्वारी)', 
      category: 'Cereal', 
      duration_days: 110, 
      expected_yield: '10-12 Quintals/Acre',
      description: 'Sorghum is a drought-resistant food and fodder crop grown in both Kharif and Rabi seasons in dry areas.',
      varieties: 'Dagadi, Phule Vasudha, CSV 20, Maldandi (M-35-1)'
    },
    { 
      id: 'ae7113ff-02df-e14b-2bc5-896f34f945ca', 
      name: 'Grapes (Drakshe / द्राक्षे)', 
      category: 'Fruit', 
      duration_days: 150, 
      expected_yield: '10-12 Tons/Acre',
      description: 'Grapes are a high-value commercial horticultural fruit crop requiring warm, dry weather and trellising support.',
      varieties: 'Thompson Seedless, Sharad Seedless, Tas-A-Ganesh, Manik Chaman'
    },
    { 
      id: 'bf8224aa-13e0-f25c-3cd6-9a7f45a056db', 
      name: 'Pomegranate (Dalimb / डाळिंब)', 
      category: 'Fruit', 
      duration_days: 180, 
      expected_yield: '6-8 Tons/Acre',
      description: 'Pomegranate is a hardy fruit crop suited for semi-arid regions with high tolerance to dry climates and salinity.',
      varieties: 'Bhagwa (Shendri), Ganesh, Mridula, Phule Arakta'
    },
    { 
      id: 'c09335bb-24f1-036d-4de7-ab8f56b167ec', 
      name: 'Mango (Amba / आंबा)', 
      category: 'Fruit', 
      duration_days: 365, 
      expected_yield: '4-5 Tons/Acre',
      description: 'Mango is the king of fruits, grown as a perennial orchard tree requiring warm climates and dry periods during flowering.',
      varieties: 'Alphonso (Hapus), Kesar, Totapuri, Pairi'
    },
    { 
      id: 'd10446cc-3502-147e-5ef8-bc9f67c278ed', 
      name: 'Banana (Keli / केळी)', 
      category: 'Fruit', 
      duration_days: 300, 
      expected_yield: '25-30 Tons/Acre',
      description: 'Banana is a water-intensive tropical fruit crop requiring highly fertile organic soils and sheltered locations.',
      varieties: 'Grand Naine (G-9), Shrimanti, Basrai, Robusta'
    },
    { 
      id: 'e21557dd-4613-258f-6f09-cd0f78d389fe', 
      name: 'Turmeric (Halad / हळद)', 
      category: 'Spices', 
      duration_days: 240, 
      expected_yield: '20-25 Quintals/Acre',
      description: 'Turmeric is a valuable commercial spice crop grown for its underground medicinal rhizomes.',
      varieties: 'Selam, Krishna, Phule Waiga, Tekurpet'
    },
    { 
      id: 'f32668ee-5724-369f-7f1a-de1f89e49aff', 
      name: 'Ginger (Ale / आले)', 
      category: 'Spices', 
      duration_days: 240, 
      expected_yield: '15-20 Quintals/Acre',
      description: 'Ginger is an important cash spice crop requiring hot, humid climates, rich clay soils, and partial shade.',
      varieties: 'Mahim, Varada, IISR Rejatha, Suprabha'
    },
    { 
      id: '043779ff-6835-47af-8f2b-ef2f9af50b00', 
      name: 'Chilli (Mirchi / मिरची)', 
      category: 'Vegetable', 
      duration_days: 150, 
      expected_yield: '8-10 Tons/Acre',
      description: 'Chilli is a key spice and vegetable crop requiring warm weather, bright sunshine, and well-drained soils.',
      varieties: 'Jwala, Phule Mukta, G-4, Sankeshwari'
    }
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
  },
  {
    id: 'mock-shop-owner-user-id',
    phone: '+919876543211',
    email: 'shop@example.com',
    user_metadata: {
      full_name: 'Sanchit ShopOwner'
    }
  },
  {
    id: 'mock-admin-user-id',
    phone: '+919876543212',
    email: 'admin@example.com',
    user_metadata: {
      full_name: 'Sanchit Admin'
    }
  },
  {
    id: 'mock-shop-owner-user-id-kanha',
    phone: '+918767366337',
    email: 'kanha@example.com',
    user_metadata: {
      full_name: 'kanha patil'
    }
  }
];

const DB_FILE = path.join(__dirname, '../../.dev-database.json');

function saveToFile() {
  try {
    const data = {
      db,
      mockAuthUsers
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving dev database to file:', err);
  }
}

function loadFromFile() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const dataStr = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(dataStr);
      if (data.db) {
        for (const key of Object.keys(data.db)) {
          if (Array.isArray(data.db[key])) {
            db[key] = data.db[key];
          }
        }
      }
      if (Array.isArray(data.mockAuthUsers)) {
        mockAuthUsers.length = 0;
        mockAuthUsers.push(...data.mockAuthUsers);
      }
      console.log('Successfully loaded dev database from file.');
    }
  } catch (err) {
    console.error('Error loading dev database from file:', err);
  }
}

// Load database from file at startup
loadFromFile();

// Helper to create chainable query builders
const createChainableQuery = (tableName: string) => {
  let list = db[tableName] || [];
  let currentFilter = [...list];

  const query: any = {
    select: (columns?: string, options?: { count?: string; head?: boolean }) => {
      query.selectOptions = options;
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
      if (query.isWrite) {
        saveToFile();
      }
      if (currentFilter.length === 0) {
        return { data: null, error: { message: 'Row not found' } };
      }
      return { data: currentFilter[0], error: null };
    },
    insert: (payload: any) => {
      query.isWrite = true;
      const records = Array.isArray(payload) ? payload : [payload];
      const inserted = records.map(r => {
        // Simulating UNIQUE constraints for mock DB
        if (tableName === 'profiles' && r.mobile) {
          const existingIdx = db.profiles.findIndex(p => p.mobile === r.mobile);
          if (existingIdx !== -1) {
            db.profiles[existingIdx] = { ...db.profiles[existingIdx], ...r };
            return db.profiles[existingIdx];
          }
        }
        if (tableName === 'shops' && r.owner_id) {
          const existingIdx = db.shops.findIndex(s => s.owner_id === r.owner_id);
          if (existingIdx !== -1) {
            db.shops[existingIdx] = { ...db.shops[existingIdx], ...r };
            return db.shops[existingIdx];
          }
        }
        const item = { id: Math.random().toString(36).substring(7), ...r, created_at: new Date().toISOString() };
        db[tableName].push(item);
        return item;
      });
      currentFilter = inserted;
      return query;
    },
    update: (payload: any) => {
      query.isWrite = true;
      currentFilter.forEach(item => {
        Object.assign(item, payload);
      });
      return query;
    },
    delete: () => {
      query.isDelete = true;
      query.isWrite = true;
      return query;
    },
    ilike: (col: string, val: string) => {
      const cleanVal = val.replace(/%/g, '').toLowerCase();
      currentFilter = currentFilter.filter(item => 
        (item[col] || '').toString().toLowerCase().includes(cleanVal)
      );
      return query;
    },
    // Allows direct await evaluation
    then: (onfulfilled: any) => {
      if (query.isDelete) {
        const idsToDelete = currentFilter.map(item => item.id);
        db[tableName] = db[tableName].filter(item => !idsToDelete.includes(item.id));
        if (query.isWrite) {
          saveToFile();
        }
        onfulfilled({ data: null, error: null });
      } else {
        if (query.isWrite) {
          saveToFile();
        }
        const data = query.selectOptions?.head ? null : currentFilter;
        const count = currentFilter.length;
        onfulfilled({ data, count, error: null });
      }
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
          session: { access_token: `mock-token-${mobile}` }
        },
        error: null
      };
    },
    signInWithPassword: async ({ phone, password }: { phone: string; password: any }) => {
      const mobile = phone.replace('+91', '');
      return {
        data: {
          session: { access_token: `mock-token-${mobile}` }
        },
        error: null
      };
    },
    admin: {
      createUser: async (payload: any) => {
        const existing = mockAuthUsers.find(u => u.phone === payload.phone);
        if (existing) {
          return { data: { user: existing }, error: null };
        }
        const user = {
          id: Math.random().toString(36).substring(7),
          phone: payload.phone,
          email: payload.email,
          user_metadata: payload.user_metadata
        };
        mockAuthUsers.push(user);
        saveToFile();
        return { data: { user }, error: null };
      },
      listUsers: async () => {
        return { data: { users: mockAuthUsers }, error: null };
      },
      deleteUser: async (id: string) => {
        const index = mockAuthUsers.findIndex(u => u.id === id);
        if (index !== -1) {
          mockAuthUsers.splice(index, 1);
          saveToFile();
        }
        return { data: {}, error: null };
      },
      generateLink: async (payload: any) => {
        return { data: { properties: { action_link: '#' } }, error: null };
      }
    },
    getUser: async (token: string) => {
      if (token && token.startsWith('mock-token-')) {
        const mobile = token.replace('mock-token-', '');
        const profile = db.profiles.find(p => p.mobile === mobile);
        if (profile) {
          return {
            data: {
              user: {
                id: profile.user_id,
                phone: `+91${mobile}`,
                email: profile.email,
                user_metadata: {
                  full_name: profile.full_name
                }
              }
            },
            error: null
          };
        }
      }
      return { data: { user: null }, error: { message: 'User not found or invalid token' } };
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
