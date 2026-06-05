-- Seed Data for Smart Krushi Mitra

-- 1. Crop Master Records
-- Cotton (Kapus) - Category: Cash Crop, Duration: 150 days
INSERT INTO public.crop_master (id, name, category, duration_days, expected_yield, description, varieties) VALUES
('b30353c5-f761-460d-8521-4ea78e4726e6', 'Cotton (Kapus / कपास)', 'Cash Crop', 150, '10-12 Quintals/Acre', 'Cotton is a major cash crop in India, grown in tropical and subtropical regions. It requires well-drained deep black clayey soil (Regur).', 'Bt Cotton (Kanak, Bunny, Maruti), Non-Bt (NHH-44)')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, varieties = EXCLUDED.varieties;

-- Soybean - Category: Oilseed, Duration: 100 days
INSERT INTO public.crop_master (id, name, category, duration_days, expected_yield, description, varieties) VALUES
('d14467d0-1c09-411a-85ba-c189ef7dc6bb', 'Soybean (सोयाबीन)', 'Oilseed', 100, '8-10 Quintals/Acre', 'Soybean is a key oilseed crop rich in protein, widely cultivated in Central India during the Kharif season.', 'JS 335, JS 93-05, MACS 1188, Phule Sangam (KDS-726)')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, varieties = EXCLUDED.varieties;

-- Wheat (Gahu) - Category: Cereal, Duration: 120 days
INSERT INTO public.crop_master (id, name, category, duration_days, expected_yield, description, varieties) VALUES
('f99617d1-e63d-4c8d-8fe0-cbb1fa0d7ff3', 'Wheat (Gahu / गेहूं)', 'Cereal', 120, '15-20 Quintals/Acre', 'Wheat is a vital Rabi cereal crop, requiring cool growing weather, moderate rain, and clayey loam soils.', 'Lok-1, GW 496, HD 2189, MACS 2496')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, varieties = EXCLUDED.varieties;

-- Rice (Bhat) - Category: Cereal, Duration: 130 days
INSERT INTO public.crop_master (id, name, category, duration_days, expected_yield, description, varieties) VALUES
('0a7114bb-5e36-4d51-87ab-89cd34efab20', 'Rice (Bhat / धान / भात)', 'Cereal', 130, '18-22 Quintals/Acre', 'Rice is the staple Kharif crop requiring high temperatures, high humidity, and standing water during its early stages.', 'Indrayani, Basmati 370, Jaya, Phule Samrudhi')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, varieties = EXCLUDED.varieties;

-- Sugarcane (Us) - Category: Cash Crop, Duration: 360 days
INSERT INTO public.crop_master (id, name, category, duration_days, expected_yield, description, varieties) VALUES
('1b8224cc-6f47-5e62-98bc-90de45f0bc31', 'Sugarcane (Us / ऊस)', 'Cash Crop', 360, '40-50 Tons/Acre', 'Sugarcane is a long-duration tropical cash crop requiring high temperatures, abundant water, and fertile soils.', 'Co 86032 (Nira), CoM 0265 (Phule 265), Co 92005')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, varieties = EXCLUDED.varieties;

-- Tur / Pigeon Pea (Tur) - Category: Pulse, Duration: 160 days
INSERT INTO public.crop_master (id, name, category, duration_days, expected_yield, description, varieties) VALUES
('2c9335dd-7a58-6f73-a9cd-01ef56f1cd42', 'Tur / Pigeon Pea (तूर)', 'Pulse', 160, '6-8 Quintals/Acre', 'Pigeon pea is an important legume crop rich in protein, cultivated primarily as a rainfed crop in semi-arid areas.', 'Vipula, BDN 711, BSMR 736 (Maruti), Phule Rajeshwari')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, varieties = EXCLUDED.varieties;

-- Harbhara / Chickpea (Harbhara) - Category: Pulse, Duration: 110 days
INSERT INTO public.crop_master (id, name, category, duration_days, expected_yield, description, varieties) VALUES
('3d0446ee-8b69-7a84-bade-12fe67f2de53', 'Chickpea / Harbhara (हरभरा)', 'Pulse', 110, '7-9 Quintals/Acre', 'Harbhara is a major Rabi pulse crop that thrives in cool weather and residual soil moisture.', 'Vijay, Digvijay, JAKI 9218, Phule Vikram')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, varieties = EXCLUDED.varieties;

-- Groundnut (Bhuimug) - Category: Oilseed, Duration: 120 days
INSERT INTO public.crop_master (id, name, category, duration_days, expected_yield, description, varieties) VALUES
('4e1557ff-9c7a-8b95-cbef-230f78f3ef64', 'Groundnut (Bhuimug / भुईमूग)', 'Oilseed', 120, '10-12 Quintals/Acre', 'Groundnut is an essential oilseed crop that grows well in sandy loam soils and requires moderate rainfall.', 'TAG 24, Phule Vyas, SB 11, TG 37A')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, varieties = EXCLUDED.varieties;

-- Onion (Kanda) - Category: Vegetable, Duration: 120 days
INSERT INTO public.crop_master (id, name, category, duration_days, expected_yield, description, varieties) VALUES
('5f2668aa-bd8b-9ca6-dcf0-341a89f4f075', 'Onion (Kanda / कांदा)', 'Vegetable', 120, '100-120 Quintals/Acre', 'Onion is a high-value vegetable crop grown across multiple seasons (Kharif, Late Kharif, Rabi) in well-drained loamy soils.', 'N-2-4-1, Baswant 780, Phule Suvarna, Bhima Kiran')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, varieties = EXCLUDED.varieties;

-- Tomato - Category: Vegetable, Duration: 110 days
INSERT INTO public.crop_master (id, name, category, duration_days, expected_yield, description, varieties) VALUES
('6a3779bb-ce9c-ad07-edf1-452b90f50186', 'Tomato (टोमॅटो)', 'Vegetable', 110, '150-200 Quintals/Acre', 'Tomato is a widely grown commercial vegetable crop sensitive to frost and waterlogging.', 'Abhinav, Jayshree, Phule Raja, Vaishali')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, varieties = EXCLUDED.varieties;

-- Maize (Maka) - Category: Cereal, Duration: 110 days
INSERT INTO public.crop_master (id, name, category, duration_days, expected_yield, description, varieties) VALUES
('7b4880cc-dfad-be18-fef2-563c01f61297', 'Maize (Maka / मका)', 'Cereal', 110, '20-25 Quintals/Acre', 'Maize is a versatile crop used for food, fodder, and industrial feed, growing in diverse climatic conditions.', 'Rajarshi, Ganga 11, Pioneer 30V92, Dekalb 9108')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, varieties = EXCLUDED.varieties;

-- Bajra - Category: Cereal, Duration: 90 days
INSERT INTO public.crop_master (id, name, category, duration_days, expected_yield, description, varieties) VALUES
('8c5991dd-e0be-cf29-0fa3-674d12f723a8', 'Bajra (बाजरी)', 'Cereal', 90, '8-10 Quintals/Acre', 'Pearl millet is a drought-tolerant millet crop grown in sandy soils and dry, warm areas.', 'ICTP 8203, Phule Aadishakti, Pioneer 86M86, Shraddha')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, varieties = EXCLUDED.varieties;

-- Jowar - Category: Cereal, Duration: 110 days
INSERT INTO public.crop_master (id, name, category, duration_days, expected_yield, description, varieties) VALUES
('9d6002ee-f1cf-d03a-1ab4-785e23f834b9', 'Jowar (ज्वारी)', 'Cereal', 110, '10-12 Quintals/Acre', 'Sorghum is a drought-resistant food and fodder crop grown in both Kharif and Rabi seasons in dry areas.', 'Dagadi, Phule Vasudha, CSV 20, Maldandi (M-35-1)')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, varieties = EXCLUDED.varieties;

-- Grapes (Drakshe) - Category: Fruit, Duration: 150 days
INSERT INTO public.crop_master (id, name, category, duration_days, expected_yield, description, varieties) VALUES
('ae7113ff-02df-e14b-2bc5-896f34f945ca', 'Grapes (Drakshe / द्राक्षे)', 'Fruit', 150, '10-12 Tons/Acre', 'Grapes are a high-value commercial horticultural fruit crop requiring warm, dry weather and trellising support.', 'Thompson Seedless, Sharad Seedless, Tas-A-Ganesh, Manik Chaman')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, varieties = EXCLUDED.varieties;

-- Pomegranate (Dalimb) - Category: Fruit, Duration: 180 days
INSERT INTO public.crop_master (id, name, category, duration_days, expected_yield, description, varieties) VALUES
('bf8224aa-13e0-f25c-3cd6-9a7f45a056db', 'Pomegranate (Dalimb / डाळिंब)', 'Fruit', 180, '6-8 Tons/Acre', 'Pomegranate is a hardy fruit crop suited for semi-arid regions with high tolerance to dry climates and salinity.', 'Bhagwa (Shendri), Ganesh, Mridula, Phule Arakta')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, varieties = EXCLUDED.varieties;

-- Mango (Amba) - Category: Fruit, Duration: 365 days
INSERT INTO public.crop_master (id, name, category, duration_days, expected_yield, description, varieties) VALUES
('c09335bb-24f1-036d-4de7-ab8f56b167ec', 'Mango (Amba / आंबा)', 'Fruit', 365, '4-5 Tons/Acre', 'Mango is the king of fruits, grown as a perennial orchard tree requiring warm climates and dry periods during flowering.', 'Alphonso (Hapus), Kesar, Totapuri, Pairi')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, varieties = EXCLUDED.varieties;

-- Banana (Keli) - Category: Fruit, Duration: 300 days
INSERT INTO public.crop_master (id, name, category, duration_days, expected_yield, description, varieties) VALUES
('d10446cc-3502-147e-5ef8-bc9f67c278ed', 'Banana (Keli / केळी)', 'Fruit', 300, '25-30 Tons/Acre', 'Banana is a water-intensive tropical fruit crop requiring highly fertile organic soils and sheltered locations.', 'Grand Naine (G-9), Shrimanti, Basrai, Robusta')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, varieties = EXCLUDED.varieties;

-- Turmeric (Halad) - Category: Spices, Duration: 240 days
INSERT INTO public.crop_master (id, name, category, duration_days, expected_yield, description, varieties) VALUES
('e21557dd-4613-258f-6f09-cd0f78d389fe', 'Turmeric (Halad / हळद)', 'Spices', 240, '20-25 Quintals/Acre', 'Turmeric is a valuable commercial spice crop grown for its underground medicinal rhizomes.', 'Selam, Krishna, Phule Waiga, Tekurpet')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, varieties = EXCLUDED.varieties;

-- Ginger (Ale) - Category: Spices, Duration: 240 days
INSERT INTO public.crop_master (id, name, category, duration_days, expected_yield, description, varieties) VALUES
('f32668ee-5724-369f-7f1a-de1f89e49aff', 'Ginger (Ale / आले)', 'Spices', 240, '15-20 Quintals/Acre', 'Ginger is an important cash spice crop requiring hot, humid climates, rich clay soils, and partial shade.', 'Mahim, Varada, IISR Rejatha, Suprabha')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, varieties = EXCLUDED.varieties;

-- Chilli (Mirchi) - Category: Vegetable, Duration: 150 days
INSERT INTO public.crop_master (id, name, category, duration_days, expected_yield, description, varieties) VALUES
('043779ff-6835-47af-8f2b-ef2f9af50b00', 'Chilli (Mirchi / मिरची)', 'Vegetable', 150, '8-10 Tons/Acre', 'Chilli is a key spice and vegetable crop requiring warm weather, bright sunshine, and well-drained soils.', 'Jwala, Phule Mukta, G-4, Sankeshwari')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, varieties = EXCLUDED.varieties;



-- 2. Crop Stages
-- Cotton Stages
INSERT INTO public.crop_stages (id, crop_master_id, stage_name, start_day, end_day) VALUES
('c0101010-0000-0000-0000-000000000001', 'b30353c5-f761-460d-8521-4ea78e4726e6', 'Sowing & Germination (पेरणी आणि उगवण)', 1, 15),
('c0101010-0000-0000-0000-000000000002', 'b30353c5-f761-460d-8521-4ea78e4726e6', 'Vegetative Phase (शाकीय वाढ)', 16, 45),
('c0101010-0000-0000-0000-000000000003', 'b30353c5-f761-460d-8521-4ea78e4726e6', 'Flowering & Square Formation (पाती आणि फुले धरणे)', 46, 85),
('c0101010-0000-0000-0000-000000000004', 'b30353c5-f761-460d-8521-4ea78e4726e6', 'Boll Development (बोंड भरणे)', 86, 120),
('c0101010-0000-0000-0000-000000000005', 'b30353c5-f761-460d-8521-4ea78e4726e6', 'Boll Bursting & Harvesting (बोंडे फुटणे आणि वेचणी)', 121, 150)
ON CONFLICT DO NOTHING;

-- Soybean Stages
INSERT INTO public.crop_stages (id, crop_master_id, stage_name, start_day, end_day) VALUES
('a0202020-0000-0000-0000-000000000001', 'd14467d0-1c09-411a-85ba-c189ef7dc6bb', 'Sowing & Seedling (पेरणी व रोप अवस्था)', 1, 20),
('a0202020-0000-0000-0000-000000000002', 'd14467d0-1c09-411a-85ba-c189ef7dc6bb', 'Flowering stage (फूल धारणा अवस्था)', 21, 50),
('a0202020-0000-0000-0000-000000000003', 'd14467d0-1c09-411a-85ba-c189ef7dc6bb', 'Pod formation (शेंगा भरणे अवस्था)', 51, 80),
('a0202020-0000-0000-0000-000000000004', 'd14467d0-1c09-411a-85ba-c189ef7dc6bb', 'Maturity & Harvest (परिपक्वता आणि कापणी)', 81, 100)
ON CONFLICT DO NOTHING;


-- 3. Fertilizer Schedule
-- Cotton Fertilizers
INSERT INTO public.fertilizer_schedule (crop_master_id, stage_id, fertilizer_name, quantity) VALUES
('b30353c5-f761-460d-8521-4ea78e4726e6', 'c0101010-0000-0000-0000-000000000001', 'Urea & Single Super Phosphate (SSP)', 'Basal Dose: Urea 20kg + SSP 75kg per acre'),
('b30353c5-f761-460d-8521-4ea78e4726e6', 'c0101010-0000-0000-0000-000000000002', 'Natures NPK 19:19:19 Soluble Fertilizer', 'Spray: NPK 19:19:19 1kg per acre'),
('b30353c5-f761-460d-8521-4ea78e4726e6', 'c0101010-0000-0000-0000-000000000003', 'Urea & Muriate of Potash (MOP)', 'Urea 35kg + MOP 20kg per acre'),
('b30353c5-f761-460d-8521-4ea78e4726e6', 'c0101010-0000-0000-0000-000000000004', 'NPK 0:52:34 & Micro-nutrients', 'Spray: NPK 0:52:34 1.5kg per acre')
ON CONFLICT DO NOTHING;

-- Soybean Fertilizers
INSERT INTO public.fertilizer_schedule (crop_master_id, stage_id, fertilizer_name, quantity) VALUES
('d14467d0-1c09-411a-85ba-c189ef7dc6bb', 'a0202020-0000-0000-0000-000000000001', 'DAP (Diammonium Phosphate) & Sulphur', 'Basal Dose: DAP 50kg + Sulphur 10kg per acre'),
('d14467d0-1c09-411a-85ba-c189ef7dc6bb', 'a0202020-0000-0000-0000-000000000002', 'NPK 19:19:19 Soluble Spray', 'NPK 19:19:19 1kg per acre'),
('d14467d0-1c09-411a-85ba-c189ef7dc6bb', 'a0202020-0000-0000-0000-000000000003', 'NPK 0:52:34 & Boron', '0:52:34 1kg + Boron 250g per acre')
ON CONFLICT DO NOTHING;


-- 4. Spray Schedule
-- Cotton Sprays
INSERT INTO public.spray_schedule (crop_master_id, stage_id, spray_name) VALUES
('b30353c5-f761-460d-8521-4ea78e4726e6', 'c0101010-0000-0000-0000-000000000002', 'Neem Oil (1500 ppm) for sucking pests prevention'),
('b30353c5-f761-460d-8521-4ea78e4726e6', 'c0101010-0000-0000-0000-000000000003', 'Imidacloprid (Jassids & Thrips control)'),
('b30353c5-f761-460d-8521-4ea78e4726e6', 'c0101010-0000-0000-0000-000000000004', 'Profenophos + Cypermethrin (Bollworm control)')
ON CONFLICT DO NOTHING;

-- Soybean Sprays
INSERT INTO public.spray_schedule (crop_master_id, stage_id, spray_name) VALUES
('d14467d0-1c09-411a-85ba-c189ef7dc6bb', 'a0202020-0000-0000-0000-000000000002', 'Chlorantraniliprole (Coragen) for Girdle Beetle and Semilooper control'),
('d14467d0-1c09-411a-85ba-c189ef7dc6bb', 'a0202020-0000-0000-0000-000000000003', 'Tebuconazole + Sulphur (Rust & Leaf Spot prevention)')
ON CONFLICT DO NOTHING;


-- 5. Irrigation Schedule
-- Cotton Irrigation
INSERT INTO public.irrigation_schedule (crop_master_id, stage_id, water_requirement) VALUES
('b30353c5-f761-460d-8521-4ea78e4726e6', 'c0101010-0000-0000-0000-000000000001', 'Light watering right after sowing if soil lacks moisture'),
('b30353c5-f761-460d-8521-4ea78e4726e6', 'c0101010-0000-0000-0000-000000000002', 'Interval of 12-15 days depending on rain'),
('b30353c5-f761-460d-8521-4ea78e4726e6', 'c0101010-0000-0000-0000-000000000003', 'Critical stage: maintain moisture. Interval of 8-10 days'),
('b30353c5-f761-460d-8521-4ea78e4726e6', 'c0101010-0000-0000-0000-000000000004', 'Maintain consistent moisture to avoid boll shedding')
ON CONFLICT DO NOTHING;

-- Soybean Irrigation
INSERT INTO public.irrigation_schedule (crop_master_id, stage_id, water_requirement) VALUES
('d14467d0-1c09-411a-85ba-c189ef7dc6bb', 'a0202020-0000-0000-0000-000000000002', 'Irrigate if rain is absent for more than 10 days'),
('d14467d0-1c09-411a-85ba-c189ef7dc6bb', 'a0202020-0000-0000-0000-000000000003', 'Most critical stage. Dry spells during pod fill reduce yield significantly. Water immediately.')
ON CONFLICT DO NOTHING;


-- 6. Diseases
INSERT INTO public.diseases (crop_master_id, name, symptoms, treatment) VALUES
('b30353c5-f761-460d-8521-4ea78e4726e6', 'Bacterial Leaf Blight (जिवाणूजन्य करपा)', 'Water-soaked angular spots on leaves, turning brown/black.', 'Spray Copper Oxychloride 25g + Streptocycline 2g in 10 liters of water.'),
('d14467d0-1c09-411a-85ba-c189ef7dc6bb', 'Soybean Rust (तांबेरा रोग)', 'Brownish pustules on the lower surface of leaves.', 'Spray Tebuconazole 10% + Sulphur 65% WG at 2g/liter of water.')
ON CONFLICT DO NOTHING;


-- 7. Pests
INSERT INTO public.pests (crop_master_id, name, symptoms, control_method) VALUES
('b30353c5-f761-460d-8521-4ea78e4726e6', 'Pink Bollworm (गुलाबी बोंडअळी)', 'Rosette flowers, exit holes in bolls, damaged seeds inside.', 'Set up pheromone traps (5 per acre). Spray Profenophos 50 EC at 2ml/liter.'),
('d14467d0-1c09-411a-85ba-c189ef7dc6bb', 'Girdle Beetle (चक्री भुंगेरा)', 'Girdled/cut marks on stems leading to wilting of top branch.', 'Spray Chlorantraniliprole 18.5% SC (Coragen) at 0.3ml per liter of water.')
ON CONFLICT DO NOTHING;
