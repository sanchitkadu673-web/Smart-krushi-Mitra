"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceKey || supabaseServiceKey.startsWith('your-')) {
    console.error('Error: Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env');
    process.exit(1);
}
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
const cropMasters = [
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
];
async function updateDatabase() {
    console.log('Starting Supabase crop_master update...');
    // First, attempt to alter the table structure to add columns if they don't exist
    // Since we cannot run raw DDL via postgrest, we try to update a test field or directly upsert.
    // Note: if columns description & varieties are not yet created in the online Supabase schema, this upsert will fail.
    for (const crop of cropMasters) {
        const { error } = await supabase
            .from('crop_master')
            .upsert(crop, { onConflict: 'name' });
        if (error) {
            console.error(`Failed to update ${crop.name}:`, error.message);
        }
        else {
            console.log(`Successfully updated ${crop.name}`);
        }
    }
    console.log('Update complete.');
}
updateDatabase();
