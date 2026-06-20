// =============================================================================
// Smart Krushi Mitra - COMPLETE MEGA SEED SCRIPT
// Run: node scripts/seed-all-crops.js
// =============================================================================

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const log = (msg) => console.log(`\x1b[32m✔\x1b[0m ${msg}`);
const warn = (msg) => console.warn(`\x1b[33m⚠\x1b[0m ${msg}`);

const CROPS = {
  WHEAT:       'f99617d1-e63d-4c8d-8fe0-cbb1fa0d7ff3',
  RICE:        '0a7114bb-5e36-4d51-87ab-89cd34efab20',
  SUGARCANE:   '1b8224cc-6f47-5e62-98bc-90de45f0bc31',
  TUR:         '2c9335dd-7a58-6f73-a9cd-01ef56f1cd42',
  CHICKPEA:    '3d0446ee-8b69-7a84-bade-12fe67f2de53',
  GROUNDNUT:   '4e1557ff-9c7a-8b95-cbef-230f78f3ef64',
  ONION:       '5f2668aa-bd8b-9ca6-dcf0-341a89f4f075',
  TOMATO:      '6a3779bb-ce9c-ad07-edf1-452b90f50186',
  MAIZE:       '7b4880cc-dfad-be18-fef2-563c01f61297',
  BAJRA:       '8c5991dd-e0be-cf29-0fa3-674d12f723a8',
  JOWAR:       '9d6002ee-f1cf-d03a-1ab4-785e23f834b9',
  GRAPES:      'ae7113ff-02df-e14b-2bc5-896f34f945ca',
  POMEGRANATE: 'bf8224aa-13e0-f25c-3cd6-9a7f45a056db',
  MANGO:       'c09335bb-24f1-036d-4de7-ab8f56b167ec',
  BANANA:      'd10446cc-3502-147e-5ef8-bc9f67c278ed',
  TURMERIC:    'e21557dd-4613-258f-6f09-cd0f78d389fe',
  GINGER:      'f32668ee-5724-369f-7f1a-de1f89e49aff',
  CHILLI:      '043779ff-6835-47af-8f2b-ef2f9af50b00',
};

const CROP_MASTER_DATA = [
  { id: CROPS.WHEAT, name: 'Wheat (Gahu / गहु)', category: 'Cereal', duration_days: 120, expected_yield: 20 },
  { id: CROPS.RICE, name: 'Rice (Bhat / भात)', category: 'Cereal', duration_days: 130, expected_yield: 25 },
  { id: CROPS.SUGARCANE, name: 'Sugarcane (Oos / ऊस)', category: 'Cash Crop', duration_days: 360, expected_yield: 400 },
  { id: CROPS.TUR, name: 'Tur (Arhar / तूर)', category: 'Pulse', duration_days: 160, expected_yield: 8 },
  { id: CROPS.CHICKPEA, name: 'Chickpea (Harbara / हरभरा)', category: 'Pulse', duration_days: 110, expected_yield: 10 },
  { id: CROPS.GROUNDNUT, name: 'Groundnut (Bhuimug / भुईमूग)', category: 'Oilseed', duration_days: 120, expected_yield: 12 },
  { id: CROPS.ONION, name: 'Onion (Kanda / कांदा)', category: 'Vegetable', duration_days: 120, expected_yield: 120 },
  { id: CROPS.TOMATO, name: 'Tomato (टोमॅटो)', category: 'Vegetable', duration_days: 110, expected_yield: 200 },
  { id: CROPS.MAIZE, name: 'Maize (Maka / मका)', category: 'Cereal', duration_days: 110, expected_yield: 30 },
  { id: CROPS.BAJRA, name: 'Bajra (बाजरी)', category: 'Cereal', duration_days: 90, expected_yield: 12 },
  { id: CROPS.JOWAR, name: 'Jowar (Sorghum / ज्वारी)', category: 'Cereal', duration_days: 110, expected_yield: 15 },
  { id: CROPS.GRAPES, name: 'Grapes (Draksha / द्राक्ष)', category: 'Fruit', duration_days: 150, expected_yield: 100 },
  { id: CROPS.POMEGRANATE, name: 'Pomegranate (Dalimb / डाळिंब)', category: 'Fruit', duration_days: 180, expected_yield: 60 },
  { id: CROPS.MANGO, name: 'Mango (Amba / आंबा)', category: 'Fruit', duration_days: 365, expected_yield: 50 },
  { id: CROPS.BANANA, name: 'Banana (Keli / केळी)', category: 'Fruit', duration_days: 300, expected_yield: 250 },
  { id: CROPS.TURMERIC, name: 'Turmeric (Halad / हळद)', category: 'Spice', duration_days: 240, expected_yield: 80 },
  { id: CROPS.GINGER, name: 'Ginger (Aale / आले)', category: 'Spice', duration_days: 240, expected_yield: 70 },
  { id: CROPS.CHILLI, name: 'Chilli (Mirchi / मिरची)', category: 'Spice', duration_days: 150, expected_yield: 40 }
];

// Proper UUID format Stage IDs
const S = {
  W1:'f9910001-0000-0000-0000-000000000001', W2:'f9910001-0000-0000-0000-000000000002',
  W3:'f9910001-0000-0000-0000-000000000003', W4:'f9910001-0000-0000-0000-000000000004',
  R1:'0a110002-0000-0000-0000-000000000001', R2:'0a110002-0000-0000-0000-000000000002',
  R3:'0a110002-0000-0000-0000-000000000003', R4:'0a110002-0000-0000-0000-000000000004',
  SC1:'1b820003-0000-0000-0000-000000000001', SC2:'1b820003-0000-0000-0000-000000000002',
  SC3:'1b820003-0000-0000-0000-000000000003', SC4:'1b820003-0000-0000-0000-000000000004',
  SC5:'1b820003-0000-0000-0000-000000000005',
  T1:'2c930004-0000-0000-0000-000000000001', T2:'2c930004-0000-0000-0000-000000000002',
  T3:'2c930004-0000-0000-0000-000000000003', T4:'2c930004-0000-0000-0000-000000000004',
  CP1:'3d040005-0000-0000-0000-000000000001', CP2:'3d040005-0000-0000-0000-000000000002',
  CP3:'3d040005-0000-0000-0000-000000000003', CP4:'3d040005-0000-0000-0000-000000000004',
  GN1:'4e150006-0000-0000-0000-000000000001', GN2:'4e150006-0000-0000-0000-000000000002',
  GN3:'4e150006-0000-0000-0000-000000000003', GN4:'4e150006-0000-0000-0000-000000000004',
  ON1:'5f260007-0000-0000-0000-000000000001', ON2:'5f260007-0000-0000-0000-000000000002',
  ON3:'5f260007-0000-0000-0000-000000000003', ON4:'5f260007-0000-0000-0000-000000000004',
  ON5:'5f260007-0000-0000-0000-000000000005',
  TM1:'6a370008-0000-0000-0000-000000000001', TM2:'6a370008-0000-0000-0000-000000000002',
  TM3:'6a370008-0000-0000-0000-000000000003', TM4:'6a370008-0000-0000-0000-000000000004',
  MZ1:'7b480009-0000-0000-0000-000000000001', MZ2:'7b480009-0000-0000-0000-000000000002',
  MZ3:'7b480009-0000-0000-0000-000000000003', MZ4:'7b480009-0000-0000-0000-000000000004',
  BJ1:'8c590010-0000-0000-0000-000000000001', BJ2:'8c590010-0000-0000-0000-000000000002',
  BJ3:'8c590010-0000-0000-0000-000000000003', BJ4:'8c590010-0000-0000-0000-000000000004',
  JW1:'9d600011-0000-0000-0000-000000000001', JW2:'9d600011-0000-0000-0000-000000000002',
  JW3:'9d600011-0000-0000-0000-000000000003', JW4:'9d600011-0000-0000-0000-000000000004',
  GP1:'ae710012-0000-0000-0000-000000000001', GP2:'ae710012-0000-0000-0000-000000000002',
  GP3:'ae710012-0000-0000-0000-000000000003', GP4:'ae710012-0000-0000-0000-000000000004',
  PM1:'bf820013-0000-0000-0000-000000000001', PM2:'bf820013-0000-0000-0000-000000000002',
  PM3:'bf820013-0000-0000-0000-000000000003', PM4:'bf820013-0000-0000-0000-000000000004',
  MG1:'c0930014-0000-0000-0000-000000000001', MG2:'c0930014-0000-0000-0000-000000000002',
  MG3:'c0930014-0000-0000-0000-000000000003', MG4:'c0930014-0000-0000-0000-000000000004',
  BN1:'d1040015-0000-0000-0000-000000000001', BN2:'d1040015-0000-0000-0000-000000000002',
  BN3:'d1040015-0000-0000-0000-000000000003', BN4:'d1040015-0000-0000-0000-000000000004',
  TU1:'e2150016-0000-0000-0000-000000000001', TU2:'e2150016-0000-0000-0000-000000000002',
  TU3:'e2150016-0000-0000-0000-000000000003', TU4:'e2150016-0000-0000-0000-000000000004',
  GI1:'f3260017-0000-0000-0000-000000000001', GI2:'f3260017-0000-0000-0000-000000000002',
  GI3:'f3260017-0000-0000-0000-000000000003', GI4:'f3260017-0000-0000-0000-000000000004',
  CH1:'04370018-0000-0000-0000-000000000001', CH2:'04370018-0000-0000-0000-000000000002',
  CH3:'04370018-0000-0000-0000-000000000003', CH4:'04370018-0000-0000-0000-000000000004',
};

const STAGES = [
  { id: S.W1,  crop_master_id: CROPS.WHEAT,       stage_name: 'Sowing & Germination (पेरणी व उगवण)', start_day: 1, end_day: 20 },
  { id: S.W2,  crop_master_id: CROPS.WHEAT,       stage_name: 'Crown Root Initiation & Tillering (मूळ अवस्था व फुटवे)', start_day: 21, end_day: 45 },
  { id: S.W3,  crop_master_id: CROPS.WHEAT,       stage_name: 'Flowering & Ear Emergence (फुलोरा व कणीस निघणे)', start_day: 46, end_day: 90 },
  { id: S.W4,  crop_master_id: CROPS.WHEAT,       stage_name: 'Grain Filling & Maturity (दाणे भरणे व पिकणे)', start_day: 91, end_day: 120 },
  { id: S.R1,  crop_master_id: CROPS.RICE,        stage_name: 'Nursery & Transplanting (रोपवाटिका व लागण)', start_day: 1, end_day: 30 },
  { id: S.R2,  crop_master_id: CROPS.RICE,        stage_name: 'Active Tillering (फुटवा अवस्था)', start_day: 31, end_day: 55 },
  { id: S.R3,  crop_master_id: CROPS.RICE,        stage_name: 'Panicle Initiation & Flowering (ओंबी निघणे व फुलोरा)', start_day: 56, end_day: 90 },
  { id: S.R4,  crop_master_id: CROPS.RICE,        stage_name: 'Grain Filling & Harvest (दाणे भरणे व कापणी)', start_day: 91, end_day: 130 },
  { id: S.SC1, crop_master_id: CROPS.SUGARCANE,   stage_name: 'Germination & Establishment (उगवण व जोमदार वाढ)', start_day: 1, end_day: 30 },
  { id: S.SC2, crop_master_id: CROPS.SUGARCANE,   stage_name: 'Tillering Phase (फुटवा टप्पा)', start_day: 31, end_day: 90 },
  { id: S.SC3, crop_master_id: CROPS.SUGARCANE,   stage_name: 'Grand Growth Phase (जलद वाढ टप्पा)', start_day: 91, end_day: 210 },
  { id: S.SC4, crop_master_id: CROPS.SUGARCANE,   stage_name: 'Maturation Phase (परिपक्वता टप्पा)', start_day: 211, end_day: 330 },
  { id: S.SC5, crop_master_id: CROPS.SUGARCANE,   stage_name: 'Harvesting (कापणी)', start_day: 331, end_day: 360 },
  { id: S.T1,  crop_master_id: CROPS.TUR,         stage_name: 'Sowing & Seedling (पेरणी व रोप)', start_day: 1, end_day: 25 },
  { id: S.T2,  crop_master_id: CROPS.TUR,         stage_name: 'Vegetative & Branching (शाकीय वाढ व फांद्या)', start_day: 26, end_day: 80 },
  { id: S.T3,  crop_master_id: CROPS.TUR,         stage_name: 'Flower Initiation & Pod Setting (फुलोरा व शेंगा धरणे)', start_day: 81, end_day: 130 },
  { id: S.T4,  crop_master_id: CROPS.TUR,         stage_name: 'Pod Maturity & Harvest (शेंगा पिकणे व काढणी)', start_day: 131, end_day: 160 },
  { id: S.CP1, crop_master_id: CROPS.CHICKPEA,    stage_name: 'Sowing & Seedling (पेरणी व रोप)', start_day: 1, end_day: 25 },
  { id: S.CP2, crop_master_id: CROPS.CHICKPEA,    stage_name: 'Vegetative & Branching (शाकीय वाढ व फांद्या)', start_day: 26, end_day: 60 },
  { id: S.CP3, crop_master_id: CROPS.CHICKPEA,    stage_name: 'Flowering & Pod Formation (फुलोरा व शेंगा)', start_day: 61, end_day: 90 },
  { id: S.CP4, crop_master_id: CROPS.CHICKPEA,    stage_name: 'Pod Filling & Maturity (शेंगा भरणे व पिकणे)', start_day: 91, end_day: 110 },
  { id: S.GN1, crop_master_id: CROPS.GROUNDNUT,   stage_name: 'Sowing & Germination (पेरणी व उगवण)', start_day: 1, end_day: 20 },
  { id: S.GN2, crop_master_id: CROPS.GROUNDNUT,   stage_name: 'Vegetative Growth (शाकीय वाढ)', start_day: 21, end_day: 45 },
  { id: S.GN3, crop_master_id: CROPS.GROUNDNUT,   stage_name: 'Flowering & Pegging (फुलोरा व खुंटी रोपण)', start_day: 46, end_day: 75 },
  { id: S.GN4, crop_master_id: CROPS.GROUNDNUT,   stage_name: 'Pod Development & Maturity (शेंगा भरणे व पिकणे)', start_day: 76, end_day: 120 },
  { id: S.ON1, crop_master_id: CROPS.ONION,       stage_name: 'Nursery & Transplanting (रोपवाटिका व लागण)', start_day: 1, end_day: 21 },
  { id: S.ON2, crop_master_id: CROPS.ONION,       stage_name: 'Vegetative Growth (शाकीय वाढ)', start_day: 22, end_day: 40 },
  { id: S.ON3, crop_master_id: CROPS.ONION,       stage_name: 'Bulb Initiation (कांदा तयार होणे सुरू)', start_day: 41, end_day: 60 },
  { id: S.ON4, crop_master_id: CROPS.ONION,       stage_name: 'Bulb Development (कांदा मोठा होणे)', start_day: 61, end_day: 85 },
  { id: S.ON5, crop_master_id: CROPS.ONION,       stage_name: 'Maturity & Harvest (पिकणे व काढणी)', start_day: 86, end_day: 120 },
  { id: S.TM1, crop_master_id: CROPS.TOMATO,      stage_name: 'Seedling & Establishment (रोप व स्थापना)', start_day: 1, end_day: 25 },
  { id: S.TM2, crop_master_id: CROPS.TOMATO,      stage_name: 'Vegetative Growth (शाकीय वाढ)', start_day: 26, end_day: 40 },
  { id: S.TM3, crop_master_id: CROPS.TOMATO,      stage_name: 'Flowering & Fruit Set (फुलोरा व फळधारणा)', start_day: 41, end_day: 55 },
  { id: S.TM4, crop_master_id: CROPS.TOMATO,      stage_name: 'Fruiting & Harvest (फळे व काढणी)', start_day: 56, end_day: 110 },
  { id: S.MZ1, crop_master_id: CROPS.MAIZE,       stage_name: 'Germination & Seedling (उगवण व रोप)', start_day: 1, end_day: 14 },
  { id: S.MZ2, crop_master_id: CROPS.MAIZE,       stage_name: 'Vegetative / Knee-High Stage (शाकीय वाढ)', start_day: 15, end_day: 39 },
  { id: S.MZ3, crop_master_id: CROPS.MAIZE,       stage_name: 'Flowering & Tasseling (फुलोरा व तुरा)', start_day: 40, end_day: 65 },
  { id: S.MZ4, crop_master_id: CROPS.MAIZE,       stage_name: 'Grain Filling & Maturity (दाणे भरणे व पिकणे)', start_day: 66, end_day: 110 },
  { id: S.BJ1, crop_master_id: CROPS.BAJRA,       stage_name: 'Sowing & Germination (पेरणी व उगवण)', start_day: 1, end_day: 15 },
  { id: S.BJ2, crop_master_id: CROPS.BAJRA,       stage_name: 'Vegetative & Tillering (शाकीय वाढ व फुटवे)', start_day: 16, end_day: 40 },
  { id: S.BJ3, crop_master_id: CROPS.BAJRA,       stage_name: 'Flowering & Ear Formation (फुलोरा व कणीस)', start_day: 41, end_day: 65 },
  { id: S.BJ4, crop_master_id: CROPS.BAJRA,       stage_name: 'Grain Filling & Harvest (दाणे भरणे व काढणी)', start_day: 66, end_day: 90 },
  { id: S.JW1, crop_master_id: CROPS.JOWAR,       stage_name: 'Sowing & Germination (पेरणी व उगवण)', start_day: 1, end_day: 15 },
  { id: S.JW2, crop_master_id: CROPS.JOWAR,       stage_name: 'Vegetative Growth (शाकीय वाढ)', start_day: 16, end_day: 45 },
  { id: S.JW3, crop_master_id: CROPS.JOWAR,       stage_name: 'Flowering & Ear Formation (फुलोरा व कणीस)', start_day: 46, end_day: 75 },
  { id: S.JW4, crop_master_id: CROPS.JOWAR,       stage_name: 'Grain Filling & Harvest (दाणे भरणे व काढणी)', start_day: 76, end_day: 110 },
  { id: S.GP1, crop_master_id: CROPS.GRAPES,      stage_name: 'Bud Break & Shoot Growth (कळ्या फुटणे व शाखा वाढ)', start_day: 1, end_day: 40 },
  { id: S.GP2, crop_master_id: CROPS.GRAPES,      stage_name: 'Flowering & Fruit Set (फुलोरा व घड धरणे)', start_day: 41, end_day: 70 },
  { id: S.GP3, crop_master_id: CROPS.GRAPES,      stage_name: 'Berry Development (मणी वाढ)', start_day: 71, end_day: 110 },
  { id: S.GP4, crop_master_id: CROPS.GRAPES,      stage_name: 'Ripening & Harvest (पिकणे व काढणी)', start_day: 111, end_day: 150 },
  { id: S.PM1, crop_master_id: CROPS.POMEGRANATE, stage_name: 'Bahar Treatment & Pruning (बहार व छाटणी)', start_day: 1, end_day: 30 },
  { id: S.PM2, crop_master_id: CROPS.POMEGRANATE, stage_name: 'Flowering (फुलोरा)', start_day: 31, end_day: 70 },
  { id: S.PM3, crop_master_id: CROPS.POMEGRANATE, stage_name: 'Fruit Development (फळ वाढ)', start_day: 71, end_day: 140 },
  { id: S.PM4, crop_master_id: CROPS.POMEGRANATE, stage_name: 'Fruit Maturity & Harvest (फळ पिकणे व काढणी)', start_day: 141, end_day: 180 },
  { id: S.MG1, crop_master_id: CROPS.MANGO,       stage_name: 'Post-Harvest Rest & Vegetative Flush (काढणीनंतर विश्रांती व नवीन पालवी)', start_day: 1, end_day: 120 },
  { id: S.MG2, crop_master_id: CROPS.MANGO,       stage_name: 'Flower Bud Induction & Panicle Emergence (फुलकळ्या व मोहोर)', start_day: 121, end_day: 210 },
  { id: S.MG3, crop_master_id: CROPS.MANGO,       stage_name: 'Fruit Set & Development (फळधारणा व वाढ)', start_day: 211, end_day: 300 },
  { id: S.MG4, crop_master_id: CROPS.MANGO,       stage_name: 'Fruit Maturity & Harvest (फळ पिकणे व काढणी)', start_day: 301, end_day: 365 },
  { id: S.BN1, crop_master_id: CROPS.BANANA,      stage_name: 'Establishment (स्थापना)', start_day: 1, end_day: 30 },
  { id: S.BN2, crop_master_id: CROPS.BANANA,      stage_name: 'Vegetative Growth (शाकीय वाढ)', start_day: 31, end_day: 120 },
  { id: S.BN3, crop_master_id: CROPS.BANANA,      stage_name: 'Pre-Flowering (फुलोऱ्यापूर्वी)', start_day: 121, end_day: 180 },
  { id: S.BN4, crop_master_id: CROPS.BANANA,      stage_name: 'Flowering & Fruiting (फुलोरा व केळफूल)', start_day: 181, end_day: 300 },
  { id: S.TU1, crop_master_id: CROPS.TURMERIC,    stage_name: 'Planting & Establishment (लागवड व स्थापना)', start_day: 1, end_day: 45 },
  { id: S.TU2, crop_master_id: CROPS.TURMERIC,    stage_name: 'Vegetative Growth (शाकीय वाढ)', start_day: 46, end_day: 120 },
  { id: S.TU3, crop_master_id: CROPS.TURMERIC,    stage_name: 'Rhizome Initiation & Development (कंद निर्मिती)', start_day: 121, end_day: 180 },
  { id: S.TU4, crop_master_id: CROPS.TURMERIC,    stage_name: 'Maturity & Harvest (पिकणे व काढणी)', start_day: 181, end_day: 240 },
  { id: S.GI1, crop_master_id: CROPS.GINGER,      stage_name: 'Planting & Germination (लागवड व उगवण)', start_day: 1, end_day: 30 },
  { id: S.GI2, crop_master_id: CROPS.GINGER,      stage_name: 'Vegetative Growth & Tillering (शाकीय वाढ व फुटवे)', start_day: 31, end_day: 90 },
  { id: S.GI3, crop_master_id: CROPS.GINGER,      stage_name: 'Rhizome Development (आल्याचे कंद भरणे)', start_day: 91, end_day: 180 },
  { id: S.GI4, crop_master_id: CROPS.GINGER,      stage_name: 'Maturity & Harvest (पिकणे व काढणी)', start_day: 181, end_day: 240 },
  { id: S.CH1, crop_master_id: CROPS.CHILLI,      stage_name: 'Seedling & Establishment (रोप व स्थापना)', start_day: 1, end_day: 25 },
  { id: S.CH2, crop_master_id: CROPS.CHILLI,      stage_name: 'Vegetative Growth (शाकीय वाढ)', start_day: 26, end_day: 50 },
  { id: S.CH3, crop_master_id: CROPS.CHILLI,      stage_name: 'Flowering & Fruit Set (फुलोरा व फळधारणा)', start_day: 51, end_day: 85 },
  { id: S.CH4, crop_master_id: CROPS.CHILLI,      stage_name: 'Fruit Development & Harvest (फळे पिकणे व काढणी)', start_day: 86, end_day: 150 },
];

const FERTILIZERS = [
  { crop_master_id: CROPS.WHEAT, stage_id: S.W1, fertilizer_name: 'DAP + Zinc Sulphate Basal Dose (पायाभूत खत)', quantity: 'DAP 50 kg + Zinc Sulphate 10 kg + Urea 20 kg per acre at Sowing' },
  { crop_master_id: CROPS.WHEAT, stage_id: S.W2, fertilizer_name: 'Urea Top Dressing (युरिया टॉप ड्रेसिंग)', quantity: 'Urea 35 kg per acre at Crown Root Initiation (Day 20-25)' },
  { crop_master_id: CROPS.WHEAT, stage_id: S.W3, fertilizer_name: 'Urea Final Dose (अंतिम युरिया)', quantity: 'Urea 20 kg per acre at Tillering (Day 45)' },
  { crop_master_id: CROPS.WHEAT, stage_id: S.W4, fertilizer_name: 'NPK 19:19:19 Foliar Spray (फोलिअर स्प्रे)', quantity: 'NPK 19:19:19 1 kg per acre spray during Grain Filling' },
  { crop_master_id: CROPS.RICE, stage_id: S.R1, fertilizer_name: 'DAP + MOP Basal Dose (पायाभूत खत)', quantity: 'DAP 50 kg + MOP 20 kg per acre at transplanting' },
  { crop_master_id: CROPS.RICE, stage_id: S.R2, fertilizer_name: 'Urea Top Dressing (युरिया टॉप ड्रेसिंग)', quantity: 'Urea 40 kg per acre at Active Tillering (Day 25-30)' },
  { crop_master_id: CROPS.RICE, stage_id: S.R3, fertilizer_name: 'Urea + Zinc Sulphate (युरिया व जस्त)', quantity: 'Urea 25 kg + Zinc Sulphate 8 kg per acre at Panicle Initiation (Day 55-60)' },
  { crop_master_id: CROPS.SUGARCANE, stage_id: S.SC1, fertilizer_name: 'SSP + MOP + Urea Basal (पायाभूत खत)', quantity: 'SSP 250 kg + MOP 75 kg + Urea 50 kg per acre at planting' },
  { crop_master_id: CROPS.SUGARCANE, stage_id: S.SC2, fertilizer_name: 'Urea Top Dressing (युरिया)', quantity: 'Urea 60 kg per acre at Tillering Stage (Day 30-60)' },
  { crop_master_id: CROPS.SUGARCANE, stage_id: S.SC3, fertilizer_name: 'Urea + MOP Grand Growth Dose (जलद वाढ खत)', quantity: 'Urea 60 kg + MOP 35 kg per acre during Grand Growth Phase' },
  { crop_master_id: CROPS.TUR, stage_id: S.T1, fertilizer_name: 'DAP + Gypsum Basal Dose (पायाभूत खत)', quantity: 'DAP 50 kg + Gypsum 50 kg per acre at sowing' },
  { crop_master_id: CROPS.TUR, stage_id: S.T2, fertilizer_name: 'NPK 18:18:18 Foliar Spray (शाकीय वाढ खत)', quantity: 'NPK 18:18:18 Spray at Vegetative Stage (Day 25)' },
  { crop_master_id: CROPS.TUR, stage_id: S.T3, fertilizer_name: '11:42:11 + Boron Spray (फुलोरा खत)', quantity: '11:42:11 1 kg + Boron 250g per acre spray at Flower Initiation (Day 80)' },
  { crop_master_id: CROPS.TUR, stage_id: S.T4, fertilizer_name: 'CalciBor Spray (शेंगा भरण्यासाठी)', quantity: 'CalciBor spray at Pod Filling Stage (Day 100-125)' },
  { crop_master_id: CROPS.CHICKPEA, stage_id: S.CP1, fertilizer_name: 'DAP + Zinc Sulphate Basal Dose (पायाभूत खत)', quantity: 'DAP 50 kg + Zinc Sulphate 10 kg per acre at sowing' },
  { crop_master_id: CROPS.CHICKPEA, stage_id: S.CP2, fertilizer_name: 'NPK 19:19:19 Foliar Spray (शाकीय वाढ)', quantity: 'NPK 19:19:19 200g per acre spray at Branching (Day 20-25)' },
  { crop_master_id: CROPS.CHICKPEA, stage_id: S.CP3, fertilizer_name: '0:52:34 Foliar Spray (फुलोरा खत)', quantity: '0:52:34 200g per acre spray at Flowering (Day 45-70)' },
  { crop_master_id: CROPS.GROUNDNUT, stage_id: S.GN1, fertilizer_name: 'DAP + MOP Basal Dose (पायाभूत खत)', quantity: 'DAP 50 kg + MOP 15 kg per acre at sowing' },
  { crop_master_id: CROPS.GROUNDNUT, stage_id: S.GN3, fertilizer_name: 'Gypsum at Flowering (जिप्सम - फुलोरा)', quantity: 'Gypsum 200-250 kg per acre at Pegging Stage (Day 40-45). Critical for pod filling.' },
  { crop_master_id: CROPS.ONION, stage_id: S.ON1, fertilizer_name: 'Urea + Complex + Sulfur Basal (पायाभूत खत)', quantity: 'Urea 50 kg + 10:26:26 50 kg + Sulfur 20 kg per acre at planting' },
  { crop_master_id: CROPS.ONION, stage_id: S.ON2, fertilizer_name: 'Urea Top Dressing (टॉप ड्रेसिंग)', quantity: 'Urea 50 kg per acre + NPK 19:19:19 spray at Vegetative Stage (Day 30-40)' },
  { crop_master_id: CROPS.ONION, stage_id: S.ON4, fertilizer_name: '0:52:34 Foliar Spray (कांदा भरण्यासाठी)', quantity: '0:52:34 spray at Bulb Development (Day 60) to enhance bulb size' },
  { crop_master_id: CROPS.TOMATO, stage_id: S.TM1, fertilizer_name: 'NPK 13:40:13 Fertigation (स्थापना खत)', quantity: 'NPK 13:40:13 via fertigation + Humic Acid at Seedling Stage (Day 7-25)' },
  { crop_master_id: CROPS.TOMATO, stage_id: S.TM2, fertilizer_name: 'NPK 19:19:19 + Magnesium (शाकीय वाढ खत)', quantity: 'NPK 19:19:19 + Magnesium Sulphate at Vegetative Stage (Day 25-40)' },
  { crop_master_id: CROPS.TOMATO, stage_id: S.TM3, fertilizer_name: 'NPK 0:52:34 + Boron + Zinc (फुलोरा खत)', quantity: '0:52:34 spray + Boron + Zinc foliar at Flowering (Day 40-50)' },
  { crop_master_id: CROPS.TOMATO, stage_id: S.TM4, fertilizer_name: 'NPK 13:00:45 High Potassium (फळ पिकवण खत)', quantity: 'NPK 13:00:45 High Potassium at Fruiting Stage (Day 50+)' },
  { crop_master_id: CROPS.MAIZE, stage_id: S.MZ1, fertilizer_name: 'Full P & K + Zinc + 1/3 N Basal (पायाभूत खत)', quantity: 'Full P & K + Zinc Sulphate 10 kg + 1/3 Nitrogen per acre at Sowing' },
  { crop_master_id: CROPS.MAIZE, stage_id: S.MZ2, fertilizer_name: 'Urea 1st Top Dressing (पहिला टॉप ड्रेसिंग)', quantity: 'Urea 40 kg per acre at Knee-High Stage (Day 30-35)' },
  { crop_master_id: CROPS.MAIZE, stage_id: S.MZ3, fertilizer_name: 'Urea 2nd Top Dressing (दुसरा टॉप ड्रेसिंग)', quantity: 'Urea 40 kg per acre at Pre-Tasseling (Day 55-60)' },
  { crop_master_id: CROPS.BAJRA, stage_id: S.BJ1, fertilizer_name: 'Full P & K + Half N Basal (पायाभूत खत)', quantity: 'Full P & K + Half Nitrogen at Sowing: 25 kg N + 18 kg P + 12 kg K per acre' },
  { crop_master_id: CROPS.BAJRA, stage_id: S.BJ2, fertilizer_name: 'Urea Top Dressing (टॉप ड्रेसिंग)', quantity: 'Remaining Half Nitrogen as Urea at Day 20-30' },
  { crop_master_id: CROPS.JOWAR, stage_id: S.JW1, fertilizer_name: 'Half N + Full P & K Basal (पायाभूत खत)', quantity: 'Urea 35 kg + SSP 100 kg + MOP 32 kg per acre at Sowing (Basal)' },
  { crop_master_id: CROPS.JOWAR, stage_id: S.JW2, fertilizer_name: 'Urea Top Dressing (टॉप ड्रेसिंग)', quantity: 'Remaining Half Nitrogen: Urea 35 kg per acre at Day 30' },
  { crop_master_id: CROPS.GRAPES, stage_id: S.GP1, fertilizer_name: 'High Nitrogen NPK (शाखा वाढ खत)', quantity: 'NPK 20:20:20 High Nitrogen via Fertigation at Bud Break (Day 0-40)' },
  { crop_master_id: CROPS.GRAPES, stage_id: S.GP2, fertilizer_name: 'High Phosphorus + Boron (फुलोरा खत)', quantity: '12:61:00 + Boron 500g/acre spray at Flowering (Day 41-70)' },
  { crop_master_id: CROPS.GRAPES, stage_id: S.GP3, fertilizer_name: 'SOP + Calcium Nitrate + Magnesium (मणी वाढ खत)', quantity: 'SOP 25 kg/acre + Calcium Nitrate 2g/L + Magnesium Sulphate at Berry Development' },
  { crop_master_id: CROPS.GRAPES, stage_id: S.GP4, fertilizer_name: 'NPK 13:00:45 High Potassium (पिकवण खत)', quantity: 'NPK 13:00:45 High Potassium at Ripening Stage for better sugar content' },
  { crop_master_id: CROPS.POMEGRANATE, stage_id: S.PM1, fertilizer_name: 'FYM + NPK Bahar Treatment (बहार उपचार खत)', quantity: 'FYM 20 kg/tree + 625g N + 250g P + 250g K per tree per year at Bahar Treatment' },
  { crop_master_id: CROPS.POMEGRANATE, stage_id: S.PM2, fertilizer_name: 'Remaining Nitrogen (उर्वरित नत्र)', quantity: 'Remaining 50% Nitrogen at Day 45-60 after Bahar' },
  { crop_master_id: CROPS.POMEGRANATE, stage_id: S.PM3, fertilizer_name: 'Zinc Sulphate + Boron Foliar Spray (सूक्ष्मखत)', quantity: 'Zinc Sulphate 0.5% + Boron foliar spray during Fruit Development' },
  { crop_master_id: CROPS.MANGO, stage_id: S.MG1, fertilizer_name: 'FYM + Half NPK Post-Harvest (काढणीनंतर खत)', quantity: 'FYM 10-20 kg/tree + Half dose NPK after harvest (June/July)' },
  { crop_master_id: CROPS.MANGO, stage_id: S.MG2, fertilizer_name: 'Remaining NPK + Zinc + Boron (मोहोरासाठी खत)', quantity: 'Remaining Half NPK + Zinc Sulphate 0.5% + Boron foliar spray at Pre-Flowering (October)' },
  { crop_master_id: CROPS.MANGO, stage_id: S.MG3, fertilizer_name: 'Calcium + Boron Foliar Spray (फळधारणा खत)', quantity: 'Calcium Nitrate 2g/L + Boric Acid 0.3% spray at Fruit Set stage' },
  { crop_master_id: CROPS.BANANA, stage_id: S.BN1, fertilizer_name: 'NPK 19:19:19 + Zinc (स्थापना खत)', quantity: 'NPK 19:19:19 + Zinc Sulphate 25 kg/acre in land prep at Establishment' },
  { crop_master_id: CROPS.BANANA, stage_id: S.BN2, fertilizer_name: 'High Nitrogen Urea (शाकीय वाढ खत)', quantity: 'High Nitrogen: Urea/Ammonium Sulphate in splits during Vegetative Stage' },
  { crop_master_id: CROPS.BANANA, stage_id: S.BN3, fertilizer_name: 'High Potassium + Boron (फुलोरा पूर्व खत)', quantity: 'MOP/SOP (High Potassium) + Boron foliar spray at Pre-Flowering Stage' },
  { crop_master_id: CROPS.BANANA, stage_id: S.BN4, fertilizer_name: 'Calcium Nitrate + SOP (फळ वाढ खत)', quantity: 'Calcium Nitrate 3g/L + SOP 0:0:50 at 3-4g/L at Flowering & Fruiting Stage' },
  { crop_master_id: CROPS.TURMERIC, stage_id: S.TU1, fertilizer_name: 'SSP + MOP + Urea + FYM Basal (पायाभूत खत)', quantity: 'SSP 60 kg + MOP 16 kg + Urea 25 kg per acre + FYM 150 quintals/acre at Planting' },
  { crop_master_id: CROPS.TURMERIC, stage_id: S.TU2, fertilizer_name: 'Urea Top Dressing (युरिया टॉप ड्रेसिंग)', quantity: 'Urea top dressing split at Day 45 and Day 90 after planting' },
  { crop_master_id: CROPS.TURMERIC, stage_id: S.TU3, fertilizer_name: 'High Potassium Fertigation (कंद वाढ खत)', quantity: 'NPK 13:8:20 or 12:12:36 High Potassium at Rhizome Initiation (Day 91-180)' },
  { crop_master_id: CROPS.GINGER, stage_id: S.GI1, fertilizer_name: 'SSP + MOP + Neem Cake + FYM Basal (पायाभूत खत)', quantity: 'SSP 60 kg + MOP 16 kg + Neem Cake 800 kg + FYM 10-15 tonnes per acre at Planting' },
  { crop_master_id: CROPS.GINGER, stage_id: S.GI2, fertilizer_name: 'Urea 1st Split Top Dressing (पहिला युरिया)', quantity: 'Urea 1st split (27 kg) per acre at Day 75 after planting' },
  { crop_master_id: CROPS.GINGER, stage_id: S.GI3, fertilizer_name: 'Urea 2nd Split Top Dressing (दुसरा युरिया)', quantity: 'Urea 2nd split (27 kg) per acre at 3 months after planting' },
  { crop_master_id: CROPS.CHILLI, stage_id: S.CH1, fertilizer_name: 'DAP + MOP + FYM Basal (पायाभूत खत)', quantity: 'DAP 50 kg + MOP 25 kg per acre + FYM 8-10 tonnes at Transplanting' },
  { crop_master_id: CROPS.CHILLI, stage_id: S.CH2, fertilizer_name: 'NPK 19:19:19 Fertigation (शाकीय वाढ खत)', quantity: 'NPK 19:19:19 via fertigation at Vegetative Growth (Day 20-40)' },
  { crop_master_id: CROPS.CHILLI, stage_id: S.CH3, fertilizer_name: '0:52:34 Flowering Fertilizer (फुलोरा खत)', quantity: '12:61:00 or 0:52:34 spray at Flowering & Fruit Set (Day 40-60)' },
  { crop_master_id: CROPS.CHILLI, stage_id: S.CH4, fertilizer_name: 'High Potassium + Calcium Nitrate (फळ पिकवण खत)', quantity: '0:0:50 High Potassium + Calcium Nitrate for fruit size at Fruiting Stage' },
];

const SPRAYS = [
  { crop_master_id: CROPS.WHEAT, stage_id: S.W2, spray_name: 'Clodinafop 400ml/acre (Narrow Leaf Weed Control - Herbicide)' },
  { crop_master_id: CROPS.WHEAT, stage_id: S.W3, spray_name: 'Propiconazole (Tilt) 1ml/liter (Yellow/Brown Rust Fungicide)' },
  { crop_master_id: CROPS.WHEAT, stage_id: S.W4, spray_name: 'Quinalphos 25 EC 400ml/acre (Stem Borer control if infestation exceeds ETL)' },
  { crop_master_id: CROPS.RICE, stage_id: S.R2, spray_name: 'Cartap Hydrochloride 50 SP 400g/acre (Stem Borer control at Tillering)' },
  { crop_master_id: CROPS.RICE, stage_id: S.R3, spray_name: 'Tricyclazole 75 WP 120g/acre (Leaf Blast & Neck Blast control)' },
  { crop_master_id: CROPS.RICE, stage_id: S.R3, spray_name: 'Propiconazole 25 EC 400ml/acre (Sheath Blight control at Day 60-75)' },
  { crop_master_id: CROPS.SUGARCANE, stage_id: S.SC1, spray_name: 'Atrazine 0.8 kg/acre Pre-emergence Herbicide (Weed control Day 3 after planting)' },
  { crop_master_id: CROPS.SUGARCANE, stage_id: S.SC2, spray_name: 'Dimethoate 1 ml/liter (Stem Borer & Aphid control at Tillering)' },
  { crop_master_id: CROPS.TUR, stage_id: S.T2, spray_name: 'Neem Oil 5% (Sucking Pest Preventive Spray at Vegetative Stage)' },
  { crop_master_id: CROPS.TUR, stage_id: S.T3, spray_name: 'Indoxacarb 14.5 SC 200ml/acre (Helicoverpa Pod Borer control at Flowering)' },
  { crop_master_id: CROPS.TUR, stage_id: S.T3, spray_name: 'HaNPV 450 LE/acre (Bio-pesticide for Pod Borer - Eco-friendly option)' },
  { crop_master_id: CROPS.CHICKPEA, stage_id: S.CP2, spray_name: 'NSKE 5% (Neem Seed Kernel Extract) for Aphid/Sucking Pest control' },
  { crop_master_id: CROPS.CHICKPEA, stage_id: S.CP3, spray_name: 'Indoxacarb 200ml/acre (Helicoverpa Pod Borer control at Flowering)' },
  { crop_master_id: CROPS.GROUNDNUT, stage_id: S.GN1, spray_name: 'Pendimethalin 1L/acre Pre-emergence Herbicide (Weed control at Sowing)' },
  { crop_master_id: CROPS.GROUNDNUT, stage_id: S.GN3, spray_name: 'Mancozeb 75% WP 30g/pump (Tikka Leaf Spot Fungicide at Flowering/Pegging)' },
  { crop_master_id: CROPS.GROUNDNUT, stage_id: S.GN3, spray_name: 'Imidacloprid 0.5ml/liter (Aphids & Thrips control)' },
  { crop_master_id: CROPS.ONION, stage_id: S.ON1, spray_name: 'Pendimethalin 1L/200L water (Pre-emergence Weed control Day 1 after transplanting)' },
  { crop_master_id: CROPS.ONION, stage_id: S.ON3, spray_name: 'Lambda-cyhalothrin 5 EC 10ml/pump (Thrips & Aphid control at Bulb Initiation)' },
  { crop_master_id: CROPS.ONION, stage_id: S.ON4, spray_name: 'Mancozeb 30g/pump (Purple Blotch / Blight Fungicide at Bulb Development)' },
  { crop_master_id: CROPS.TOMATO, stage_id: S.TM2, spray_name: 'Yellow Sticky Traps 10-15/acre (Whitefly/Aphid monitoring from Day 25)' },
  { crop_master_id: CROPS.TOMATO, stage_id: S.TM3, spray_name: 'Chlorantraniliprole (Coragen) 0.3ml/liter (Fruit Borer control at Flowering)' },
  { crop_master_id: CROPS.TOMATO, stage_id: S.TM4, spray_name: 'Acetamiprid 20 SP 100g/acre (Whitefly/Aphid control at Fruiting)' },
  { crop_master_id: CROPS.TOMATO, stage_id: S.TM4, spray_name: 'Mancozeb 25g/pump (Blight Fungicide Prevention at Fruiting Stage)' },
  { crop_master_id: CROPS.MAIZE, stage_id: S.MZ2, spray_name: 'Emamectin Benzoate 5% SG 100g/acre (Fall Armyworm control into whorl)' },
  { crop_master_id: CROPS.MAIZE, stage_id: S.MZ3, spray_name: 'Propiconazole 1ml/liter (Rust & Leaf Blight Fungicide at Flowering)' },
  { crop_master_id: CROPS.BAJRA, stage_id: S.BJ1, spray_name: 'Metalaxyl 35% SD 6g/kg Seed Treatment (Downy Mildew prevention at Sowing)' },
  { crop_master_id: CROPS.BAJRA, stage_id: S.BJ2, spray_name: 'Atrazine 50 WP 400g/acre (Pre-emergence Weed control at Day 15-20)' },
  { crop_master_id: CROPS.JOWAR, stage_id: S.JW1, spray_name: 'Thiram/Carbendazim 3g/kg Seed Treatment (Soil-borne disease prevention)' },
  { crop_master_id: CROPS.JOWAR, stage_id: S.JW2, spray_name: 'Cypermethrin 25% EC 100ml/acre (Shoot Fly & Stem Borer control)' },
  { crop_master_id: CROPS.JOWAR, stage_id: S.JW3, spray_name: 'Emamectin Benzoate 100g/acre (Stem Borer control at Flowering if infestation high)' },
  { crop_master_id: CROPS.GRAPES, stage_id: S.GP2, spray_name: 'Gibberellic Acid GA3 25 ppm (Berry Thinning at Full Bloom)' },
  { crop_master_id: CROPS.GRAPES, stage_id: S.GP3, spray_name: 'Carbendazim + Sulfur (Powdery Mildew Preventive Fungicide at Berry Development)' },
  { crop_master_id: CROPS.GRAPES, stage_id: S.GP3, spray_name: 'Imidacloprid 0.5ml/liter (Thrips & Mealybug control at Berry Development)' },
  { crop_master_id: CROPS.POMEGRANATE, stage_id: S.PM1, spray_name: 'Copper Oxychloride 2.5g/L (Bacterial Blight Prevention 7-10 day interval after Pruning)' },
  { crop_master_id: CROPS.POMEGRANATE, stage_id: S.PM3, spray_name: 'Neem Oil 3% (Pomegranate Butterfly preventive spray during Fruit Development)' },
  { crop_master_id: CROPS.POMEGRANATE, stage_id: S.PM4, spray_name: 'Azadirachtin 1% 3ml/L (Monthly Preventive Insecticide at Fruit Maturity)' },
  { crop_master_id: CROPS.MANGO, stage_id: S.MG2, spray_name: 'Hexaconazole / Sulfur (Powdery Mildew Preventive Fungicide before Flowering)' },
  { crop_master_id: CROPS.MANGO, stage_id: S.MG2, spray_name: 'Imidacloprid (Mango Hoppers & Thrips control at Vegetative Flush)' },
  { crop_master_id: CROPS.MANGO, stage_id: S.MG3, spray_name: 'Methyl Eugenol Traps 10-12/acre (Mango Fruit Fly monitoring from April-September)' },
  { crop_master_id: CROPS.BANANA, stage_id: S.BN2, spray_name: 'Imidacloprid 0.5ml/L (Aphid control - Aphids spread Banana Bunchy Top Virus)' },
  { crop_master_id: CROPS.BANANA, stage_id: S.BN3, spray_name: 'Copper Oxychloride (Leaf Spot/Sigatoka Preventive Fungicide - cover underside of leaves)' },
  { crop_master_id: CROPS.BANANA, stage_id: S.BN4, spray_name: 'Chlorpyrifos Drenching (Rhizome/Pseudostem Weevil soil drenching at Fruiting)' },
  { crop_master_id: CROPS.TURMERIC, stage_id: S.TU1, spray_name: 'Pendimethalin 800ml/acre (Pre-emergence Weed Control within 2-3 days of planting)' },
  { crop_master_id: CROPS.TURMERIC, stage_id: S.TU2, spray_name: 'Acephate 75 SP 600g/100L water (Rhizome Fly/Borer control at Vegetative Stage)' },
  { crop_master_id: CROPS.TURMERIC, stage_id: S.TU3, spray_name: 'Mancozeb 0.3% (Leaf Blotch/Spot Fungicide at Rhizome Initiation Stage)' },
  { crop_master_id: CROPS.GINGER, stage_id: S.GI1, spray_name: 'Mancozeb 3g/L Rhizome Treatment (Seed rhizome dip 30 min before planting to prevent rot)' },
  { crop_master_id: CROPS.GINGER, stage_id: S.GI2, spray_name: 'Neem Oil 0.5% (Shoot Borer prevention spray at fortnightly intervals July to October)' },
  { crop_master_id: CROPS.GINGER, stage_id: S.GI3, spray_name: 'Chlorpyriphos 0.075% soil drenching (Rhizome Soft Rot prevention if symptoms appear)' },
  { crop_master_id: CROPS.CHILLI, stage_id: S.CH1, spray_name: 'Yellow & Blue Sticky Traps (Thrips/Aphid/Whitefly monitoring from Day 1)' },
  { crop_master_id: CROPS.CHILLI, stage_id: S.CH3, spray_name: 'Imidacloprid or Fipronil (Thrips/Mites/Aphid control at Flowering)' },
  { crop_master_id: CROPS.CHILLI, stage_id: S.CH4, spray_name: 'Chlorpyrifos / Azadirachtin (Fruit Borer control at Fruiting Stage)' },
  { crop_master_id: CROPS.CHILLI, stage_id: S.CH4, spray_name: 'Copper-based Fungicide (Fruit Rot / Leaf Spot prevention at Fruiting Stage)' },
];

const IRRIGATION = [
  { crop_master_id: CROPS.WHEAT, stage_id: S.W2, water_requirement: 'Most Critical: First irrigation at Crown Root Initiation (Day 20-25) for tiller development. 50mm required.' },
  { crop_master_id: CROPS.WHEAT, stage_id: S.W3, water_requirement: 'Irrigation at Flowering/Ear Emergence (Day 65-70). 40mm required.' },
  { crop_master_id: CROPS.WHEAT, stage_id: S.W4, water_requirement: 'Irrigation at Grain Filling (Day 90-95). Avoid irrigation 15 days before harvest.' },
  { crop_master_id: CROPS.RICE, stage_id: S.R1, water_requirement: 'Maintain shallow standing water (2-3 cm) after transplanting for weed suppression.' },
  { crop_master_id: CROPS.RICE, stage_id: S.R2, water_requirement: 'Standing water 2-3 cm during Tillering phase for optimal tiller production.' },
  { crop_master_id: CROPS.RICE, stage_id: S.R3, water_requirement: 'Critical Stage: Increase water level to 5 cm from Panicle Initiation until 10 days before harvest.' },
  { crop_master_id: CROPS.SUGARCANE, stage_id: S.SC2, water_requirement: 'Avoid water stress during Tillering. Drip irrigation recommended. Irrigate every 8-10 days.' },
  { crop_master_id: CROPS.SUGARCANE, stage_id: S.SC3, water_requirement: 'Regular irrigation every 7-10 days during Grand Growth Phase. Critical for cane elongation.' },
  { crop_master_id: CROPS.SUGARCANE, stage_id: S.SC4, water_requirement: 'Reduce irrigation at Maturation Phase to increase sugar content. Stop 30 days before harvest.' },
  { crop_master_id: CROPS.TUR, stage_id: S.T3, water_requirement: 'Provide protective irrigation during dry spells at Flowering & Pod Setting. Tur is sensitive to waterlogging.' },
  { crop_master_id: CROPS.TUR, stage_id: S.T4, water_requirement: 'Stop irrigation 15-20 days before harvest. Ensure good drainage at all times.' },
  { crop_master_id: CROPS.CHICKPEA, stage_id: S.CP3, water_requirement: 'Light protective irrigation at Flowering if no rainfall for 10+ days. Avoid waterlogging.' },
  { crop_master_id: CROPS.CHICKPEA, stage_id: S.CP4, water_requirement: 'Light irrigation if needed at Pod Filling. Stop irrigation 2 weeks before harvest.' },
  { crop_master_id: CROPS.GROUNDNUT, stage_id: S.GN2, water_requirement: 'Avoid irrigation for ~25 days after establishment to synchronize flowering.' },
  { crop_master_id: CROPS.GROUNDNUT, stage_id: S.GN3, water_requirement: 'Critical Stage: Irrigate at Flowering & Peg Penetration (Day 40-45) for pod development.' },
  { crop_master_id: CROPS.GROUNDNUT, stage_id: S.GN4, water_requirement: 'Maintain soil moisture during Pod Development. Last irrigation at Day 90-95. Stop before harvest.' },
  { crop_master_id: CROPS.ONION, stage_id: S.ON2, water_requirement: 'Drip irrigation recommended. Irrigate every 5-7 days at Vegetative Stage.' },
  { crop_master_id: CROPS.ONION, stage_id: S.ON3, water_requirement: 'Critical Stage: Maintain consistent moisture at Bulb Initiation (Day 40-60). Do not over-water.' },
  { crop_master_id: CROPS.ONION, stage_id: S.ON5, water_requirement: 'Stop irrigation 15 days before harvest when foliage turns yellow/brown.' },
  { crop_master_id: CROPS.TOMATO, stage_id: S.TM1, water_requirement: 'Drip irrigation recommended from the start. Ensure good drainage - waterlogging causes disease.' },
  { crop_master_id: CROPS.TOMATO, stage_id: S.TM3, water_requirement: 'Critical: Avoid water stress at Flowering. Consistent moisture for proper fruit set.' },
  { crop_master_id: CROPS.TOMATO, stage_id: S.TM4, water_requirement: 'Uniform moisture at Fruiting stage to prevent blossom end rot. Drip irrigation ideal.' },
  { crop_master_id: CROPS.MAIZE, stage_id: S.MZ3, water_requirement: 'Most Critical Stage: Avoid water stress at Flowering & Tasseling. Ensure irrigation if rain is absent.' },
  { crop_master_id: CROPS.MAIZE, stage_id: S.MZ4, water_requirement: 'Maintain soil moisture during Grain Filling. Reduce irrigation as crop approaches maturity.' },
  { crop_master_id: CROPS.BAJRA, stage_id: S.BJ3, water_requirement: 'Irrigate at Flowering stage if rainfall is inadequate. Bajra is drought-tolerant but benefits here.' },
  { crop_master_id: CROPS.BAJRA, stage_id: S.BJ4, water_requirement: 'Light irrigation at Grain Filling if needed. Stop irrigation as crop nears maturity.' },
  { crop_master_id: CROPS.JOWAR, stage_id: S.JW3, water_requirement: 'Irrigate at Flowering stage if rainfall is insufficient. Critical for grain yield.' },
  { crop_master_id: CROPS.JOWAR, stage_id: S.JW4, water_requirement: 'Maintain moisture at Grain Filling. Stop irrigation 15 days before harvest.' },
  { crop_master_id: CROPS.GRAPES, stage_id: S.GP1, water_requirement: 'Drip irrigation essential. Begin moderate watering at Bud Break. Adjust based on soil moisture.' },
  { crop_master_id: CROPS.GRAPES, stage_id: S.GP3, water_requirement: 'Regular drip irrigation at Berry Development. Avoid waterlogging which causes disease.' },
  { crop_master_id: CROPS.GRAPES, stage_id: S.GP4, water_requirement: 'Reduce irrigation at Ripening Stage. Excess moisture can dilute sugar and cause disease.' },
  { crop_master_id: CROPS.POMEGRANATE, stage_id: S.PM1, water_requirement: 'Drip irrigation recommended. Ensure perfect drainage. Avoid waterlogging at all stages.' },
  { crop_master_id: CROPS.POMEGRANATE, stage_id: S.PM3, water_requirement: 'Consistent moisture during Fruit Development for uniform size. Drip at 2-3 day intervals.' },
  { crop_master_id: CROPS.POMEGRANATE, stage_id: S.PM4, water_requirement: 'Reduce water at Fruit Maturity to improve taste and color. Stop 10 days before harvest.' },
  { crop_master_id: CROPS.MANGO, stage_id: S.MG1, water_requirement: 'Avoid irrigation 2-3 months before expected flowering to induce dry stress for better blossom.' },
  { crop_master_id: CROPS.MANGO, stage_id: S.MG3, water_requirement: 'Begin irrigation after fruit set. Drip irrigation every 3-5 days during Fruit Development.' },
  { crop_master_id: CROPS.MANGO, stage_id: S.MG4, water_requirement: 'Reduce irrigation at Fruit Maturity. Stop 15 days before harvest for better fruit quality.' },
  { crop_master_id: CROPS.BANANA, stage_id: S.BN1, water_requirement: 'Drip irrigation mandatory. 8-10 liters per plant per day at Establishment Stage.' },
  { crop_master_id: CROPS.BANANA, stage_id: S.BN2, water_requirement: 'High water demand during Vegetative Growth. 15-20 liters per plant per day via drip.' },
  { crop_master_id: CROPS.BANANA, stage_id: S.BN4, water_requirement: 'Consistent drip irrigation at Flowering & Fruiting for bunch development. Avoid drought stress.' },
  { crop_master_id: CROPS.TURMERIC, stage_id: S.TU1, water_requirement: 'Irrigate immediately after planting. Mulch with green leaves to retain moisture. Avoid waterlogging.' },
  { crop_master_id: CROPS.TURMERIC, stage_id: S.TU3, water_requirement: 'Maintain consistent moisture at Rhizome Initiation. Drip irrigation every 8-10 days.' },
  { crop_master_id: CROPS.TURMERIC, stage_id: S.TU4, water_requirement: 'Reduce irrigation at Maturity Stage. Harvest when leaves turn yellow and dry.' },
  { crop_master_id: CROPS.GINGER, stage_id: S.GI1, water_requirement: 'Mulch immediately after planting with green leaves to retain soil moisture.' },
  { crop_master_id: CROPS.GINGER, stage_id: S.GI2, water_requirement: 'Light irrigation every 10-15 days if not rainfed. Avoid waterlogging at all costs to prevent rot.' },
  { crop_master_id: CROPS.GINGER, stage_id: S.GI3, water_requirement: 'Maintain moisture during Rhizome Development. Reduce watering 30 days before harvest.' },
  { crop_master_id: CROPS.CHILLI, stage_id: S.CH1, water_requirement: 'Drip irrigation + Plastic mulching recommended. Irrigate every 5-7 days at Establishment.' },
  { crop_master_id: CROPS.CHILLI, stage_id: S.CH3, water_requirement: 'Critical: Consistent moisture at Flowering & Fruit Set. Water stress causes flower/fruit drop.' },
  { crop_master_id: CROPS.CHILLI, stage_id: S.CH4, water_requirement: 'Regular drip irrigation at Fruiting Stage. Reduce irrigation as final harvest approaches.' },
];

const DISEASES = [
  { crop_master_id: CROPS.WHEAT, name: 'Yellow Rust (पिवळा गंज)', symptoms: 'Yellow stripes/pustules on leaves parallel to leaf veins.', treatment: 'Spray Propiconazole (Tilt) 1ml/L or Tebuconazole 1ml/L as soon as symptoms appear.' },
  { crop_master_id: CROPS.RICE, name: 'Blast Disease (भात करपा)', symptoms: 'Diamond shaped lesions with grey center and brown border on leaves and neck.', treatment: 'Spray Tricyclazole 75 WP 120g/acre at first symptom. Repeat after 15 days if needed.' },
  { crop_master_id: CROPS.RICE, name: 'Sheath Blight (आवरण करपा)', symptoms: 'Oval/irregular greenish-grey lesions on leaf sheaths near water level.', treatment: 'Spray Validamycin or Hexaconazole 5 SC 400ml/acre when 25% tillers are infected.' },
  { crop_master_id: CROPS.SUGARCANE, name: 'Red Rot (लाल सड)', symptoms: 'Internal red staining with white spots on cross-section of stalk.', treatment: 'Use healthy certified setts. Treat setts with Carbendazim 1g/L for 15 minutes before planting.' },
  { crop_master_id: CROPS.TUR, name: 'Sterility Mosaic (बांझपण मोझाईक)', symptoms: 'Infected plants show mosaic yellow-green mottling and remain sterile - no pods formed.', treatment: 'No cure. Remove and destroy infected plants immediately. Control mite vectors with Dicofol spray.' },
  { crop_master_id: CROPS.CHICKPEA, name: 'Fusarium Wilt (मान मोडी / उकाडा)', symptoms: 'Plants wilt suddenly turning pale green then yellow. Root shows brown discoloration.', treatment: 'Use resistant varieties. Seed treatment with Trichoderma viride 6g/kg + Carbendazim 2g/kg.' },
  { crop_master_id: CROPS.GROUNDNUT, name: 'Tikka Leaf Spot (तिका पानकरपा)', symptoms: 'Dark brown circular spots with yellow halo on leaves leading to early defoliation.', treatment: 'Spray Mancozeb 75% WP 30g per pump or Chlorothalonil 2g/L at first sign.' },
  { crop_master_id: CROPS.ONION, name: 'Purple Blotch (जांभळा डाग रोग)', symptoms: 'Small white lesions with purple center on leaves leading to dieback.', treatment: 'Spray Mancozeb 2.5g/L or Iprodione 1.5g/L at 7-10 day intervals during humid weather.' },
  { crop_master_id: CROPS.TOMATO, name: 'Early Blight (आगोदर करपा)', symptoms: 'Dark brown concentric ring spots (target board pattern) on older leaves.', treatment: 'Spray Mancozeb + Metalaxyl 2.5g/L or Azoxystrobin 1ml/L at first symptom.' },
  { crop_master_id: CROPS.MAIZE, name: 'Northern Leaf Blight (पाने करपा)', symptoms: 'Long grey-green lesions on leaves that turn tan as they mature.', treatment: 'Spray Mancozeb 2g/L or Propiconazole 1ml/L when disease appears.' },
  { crop_master_id: CROPS.GRAPES, name: 'Powdery Mildew (भुकटी बुरशी)', symptoms: 'White powdery coating on leaves shoots and berries. Berries may crack.', treatment: 'Spray Sulfur 80 WP 3g/L or Myclobutanil 1g/L. Maintain good canopy aeration.' },
  { crop_master_id: CROPS.POMEGRANATE, name: 'Bacterial Blight (जीवाणूजन्य करपा)', symptoms: 'Water-soaked spots on leaves/fruits turning dark brown/black leading to fruit cracking and drop.', treatment: 'Spray Copper Oxychloride 2.5g/L at 7-10 day intervals. Rotate with Bronopol 0.5g/L + Captan 3g/L.' },
  { crop_master_id: CROPS.MANGO, name: 'Powdery Mildew (भुकटी बुरशी)', symptoms: 'White powdery growth on inflorescence and young fruits causing flower/fruit drop.', treatment: 'Spray Sulfur 80% WP 3g/L or Hexaconazole 1ml/L at first symptom during flowering.' },
  { crop_master_id: CROPS.BANANA, name: 'Sigatoka Leaf Spot (सिगाटोका पानावरील डाग)', symptoms: 'Yellow streaks on youngest leaves progressing to dark brown necrotic spots.', treatment: 'Spray Mancozeb 2g/L or Propiconazole 1ml/L. Ensure thorough coverage of leaf underside.' },
  { crop_master_id: CROPS.TURMERIC, name: 'Leaf Blotch (पान करपा)', symptoms: 'Brown rectangular spots on leaves often with yellow border leading to drying.', treatment: 'Spray Mancozeb 0.25% or Copper Oxychloride 0.3% at first sign of infection.' },
  { crop_master_id: CROPS.GINGER, name: 'Soft Rot / Rhizome Rot (मऊ सड)', symptoms: 'Yellowing of lower leaves wilting soft water-soaked lesions on rhizomes.', treatment: 'Ensure perfect drainage. Soil drench with Metalaxyl + Mancozeb. Remove and destroy infected plants.' },
  { crop_master_id: CROPS.CHILLI, name: 'Anthracnose / Fruit Rot (फळ सड)', symptoms: 'Dark sunken lesions on fruits with concentric rings. Infected fruits shrivel and drop.', treatment: 'Spray Copper Hydroxide or Mancozeb 2g/L. Use resistant varieties. Avoid excess moisture.' },
];

const PESTS = [
  { crop_master_id: CROPS.WHEAT, name: 'Aphid (माव)', symptoms: 'Small soft-bodied insects on leaves and ears causing yellowing and honeydew secretion.', control_method: 'Spray Dimethoate 30 EC 1.5ml/L or Thiamethoxam 25 WG 0.2g/L when colonies are seen.' },
  { crop_master_id: CROPS.RICE, name: 'Brown Plant Hopper (तपकिरी तुडतुडा)', symptoms: 'Hopper burn - circular burnt patches in field. Insects cluster at base of plants.', control_method: 'Spray Pymetrozine 50 WG 0.3g/L or Buprofezin 25 SC 1ml/L. Avoid synthetic pyrethroids.' },
  { crop_master_id: CROPS.SUGARCANE, name: 'Early Shoot Borer (खोड किडा)', symptoms: 'Dead heart in young plants. Affected shoots emit foul smell when pulled.', control_method: 'Release Trichogramma egg parasitoids. Spray Chlorantraniliprole 18.5 SC 0.3ml/L if ETL crossed.' },
  { crop_master_id: CROPS.TUR, name: 'Tur Pod Borer / Helicoverpa (बोंडअळी)', symptoms: 'Circular holes in pods. Damaged seeds with larval frass inside pods.', control_method: 'Install Pheromone traps 5/acre. Spray HaNPV 450 LE/acre or Indoxacarb 14.5 SC 200ml/acre.' },
  { crop_master_id: CROPS.CHICKPEA, name: 'Gram Pod Borer / Helicoverpa (हरभरा बोंडअळी)', symptoms: 'Larva eats from inside pod. Circular holes in pods. Half-eaten seeds visible.', control_method: 'Pheromone traps 5-6/hectare. Spray HaNPV at first sign. Indoxacarb at ETL crossing.' },
  { crop_master_id: CROPS.GROUNDNUT, name: 'Leaf Miner (पान खाणारी अळी)', symptoms: 'Serpentine mines (white tunnels) visible on leaves from larval feeding.', control_method: 'Spray Fipronil 5 SC 1ml/L or Imidacloprid 0.5ml/L when mines are first noticed.' },
  { crop_master_id: CROPS.ONION, name: 'Onion Thrips (फुलकिडे)', symptoms: 'Silvery streaks on leaves curling of leaves deformed bulbs. Stunted plant growth.', control_method: 'Spray Spinosad 2.5 SC 1ml/L or Lambda-cyhalothrin 5 EC 1ml/L. Use blue sticky traps.' },
  { crop_master_id: CROPS.TOMATO, name: 'Tomato Fruit Borer (फळ पोखरणारी अळी)', symptoms: 'Pin holes on green fruits. Caterpillar feeds inside fruit. Rotting of fruits follows.', control_method: 'Pheromone traps 10/acre. Spray Chlorantraniliprole 0.3ml/L or Emamectin Benzoate 0.4g/L.' },
  { crop_master_id: CROPS.MAIZE, name: 'Fall Armyworm (लष्करी अळी)', symptoms: 'Ragged holes in leaves and whorl. Frass in whorl. Pin holes on cobs.', control_method: 'Spray Emamectin Benzoate 5% SG 100g/acre or Chlorantraniliprole 18.5 SC into the whorl at ETL.' },
  { crop_master_id: CROPS.BAJRA, name: 'Shoot Fly (खोड माशी)', symptoms: 'Dead heart symptom in young seedlings. Central leaf wilts and dries.', control_method: 'Early sowing in recommended window. Treat seeds with Thiamethoxam 70 WS 2g/kg. Remove dead hearts.' },
  { crop_master_id: CROPS.JOWAR, name: 'Stem Borer (खोड किडा)', symptoms: 'Dead heart in young plants. Small entry holes in stem. Wilting of central shoot.', control_method: 'Early sowing. Spray Cypermethrin 25% EC 100ml/acre when infestation exceeds economic threshold.' },
  { crop_master_id: CROPS.GRAPES, name: 'Mealybug (पांढरी माव)', symptoms: 'White waxy cottony clusters on stems and bunches. Honeydew secretion causing sooty mold.', control_method: 'Spray Chlorpyrifos 20 EC 2ml/L or use Profenophos for severe infestations. Maintain orchard hygiene.' },
  { crop_master_id: CROPS.POMEGRANATE, name: 'Pomegranate Butterfly (डाळिंब फुलपाखरू)', symptoms: 'Larvae bore into developing fruits causing premature fruit drop and internal damage.', control_method: 'Individual fruit bagging after marble stage. Neem Oil 3% spray. Remove and destroy affected fruits.' },
  { crop_master_id: CROPS.MANGO, name: 'Mango Hopper (आंबा तुडतुडा)', symptoms: 'Nymphs and adults suck sap from inflorescence. Honeydew causes sooty mold on flowers.', control_method: 'Spray Imidacloprid 0.3ml/L or Deltamethrin 1ml/L at bud emergence. Avoid spray at full bloom.' },
  { crop_master_id: CROPS.BANANA, name: 'Banana Weevil / Pseudostem Weevil (केळी भुंगेरा)', symptoms: 'Entry holes at base of pseudostem. Yellowing and wilting of plants. Internal tunneling.', control_method: 'Soil drenching with Chlorpyrifos 20 EC 2ml/L around pseudostem. Use healthy tissue culture plants.' },
  { crop_master_id: CROPS.TURMERIC, name: 'Shoot Borer / Rhizome Fly (कंद माशी)', symptoms: 'Tunneling inside pseudostems. Wilting of infested shoots. Visible entry holes.', control_method: 'Spray Acephate 75 SP 600g/100L water. Remove and destroy infested shoots. Neem-based preventive sprays.' },
  { crop_master_id: CROPS.GINGER, name: 'Shoot Borer (गड माशी)', symptoms: 'Yellowing and wilting of shoots. Entry holes at base. White larva visible inside stem.', control_method: 'Neem Oil 0.5% spray at fortnightly intervals July-October. Remove and destroy affected shoots.' },
  { crop_master_id: CROPS.CHILLI, name: 'Chilli Thrips (फुलकिडे)', symptoms: 'Upward curling of leaves silvery streaks. Deformed fruits. Stunted plant growth.', control_method: 'Spray Spinosad 2.5 SC 1ml/L or Fipronil 5 SC 1ml/L. Alternate with Neem Oil to prevent resistance.' },
];

const fs = require('fs');

async function generateSQL() {
  console.log('\n🌾 Smart Krushi Mitra - Executing Mega Seed Script...\n');

  console.log('\n⏳ Seeding Crop Master...');
  const { error: err0 } = await supabase.from('crop_master').upsert(CROP_MASTER_DATA, { onConflict: 'id' });
  if (err0) { console.error('Error in Crop Master:', err0); return; }
  console.log('✅ Crop Master Seeded!');

  console.log('\n⏳ Seeding Crop Stages...');
  let sql = `-- =============================================================================\n`;
  sql += `-- Smart Krushi Mitra - MEGA SEED SCRIPT (20 Crops)\n`;
  sql += `-- Generated on: ${new Date().toISOString()}\n`;
  sql += `-- Execute this script in your Supabase SQL Editor to bypass RLS policies.\n`;
  sql += `-- =============================================================================\n\n`;

  const { error: err1 } = await supabase.from('crop_stages').upsert(STAGES, { onConflict: 'id' });
  if (err1) { console.error('Error in Crop Stages:', err1); return; }
  console.log('✅ Crop Stages Seeded!');

  console.log('\n⏳ Seeding Fertilizer Schedule...');
  const { error: err2 } = await supabase.from('fertilizer_schedule').insert(FERTILIZERS);
  if (err2) { console.error('Error in Fertilizer Schedule:', err2); return; }
  console.log('✅ Fertilizer Schedule Seeded!');

  console.log('\n⏳ Seeding Spray Schedule...');
  const { error: err3 } = await supabase.from('spray_schedule').insert(SPRAYS);
  if (err3) { console.error('Error in Spray Schedule:', err3); return; }
  console.log('✅ Spray Schedule Seeded!');

  console.log('\n⏳ Seeding Irrigation Schedule...');
  const { error: err4 } = await supabase.from('irrigation_schedule').insert(IRRIGATION);
  if (err4) { console.error('Error in Irrigation Schedule:', err4); return; }
  console.log('✅ Irrigation Schedule Seeded!');

  console.log('\n⏳ Seeding Diseases...');
  const { error: err5 } = await supabase.from('diseases').insert(DISEASES);
  if (err5) { console.error('Error in Diseases:', err5); return; }
  console.log('✅ Diseases Seeded!');

  console.log('\n⏳ Seeding Pests...');
  const { error: err6 } = await supabase.from('pests').insert(PESTS);
  if (err6) { console.error('Error in Pests:', err6); return; }
  console.log('✅ Pests Seeded!');

  console.log('\n\x1b[32m🎉 Mega Seed Completed Successfully via REST API!\x1b[0m\n');
}

generateSQL().catch(e => { console.error('CRASH:', e.message); process.exit(1); });
