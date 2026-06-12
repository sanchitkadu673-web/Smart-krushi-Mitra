import { supabaseAdmin } from '../config/supabase';

export interface RecommendationResponse {
  cropId: string;
  cropName: string;
  sowingDate: string;
  daysSinceSowing: number;
  currentStage: {
    stageName: string;
    startDay: number;
    endDay: number;
    stageId: string;
  } | null;
  nextStage: {
    stageName: string;
    startDay: number;
  } | null;
  harvestDate: string;
  fertilizers: any[];
  sprays: any[];
  irrigation: any[];
  allStages: any[];
  allFertilizers: any[];
  allSprays: any[];
  allIrrigation: any[];
  diseases: any[];
  pests: any[];
  seedBrands?: string;
  cultivationGuide?: string;
}

export class RecommendationEngineService {
  public static async getRecommendations(cropId: string): Promise<RecommendationResponse> {
    // 1. Fetch Crop details
    const { data: crop, error: cropError } = await supabaseAdmin
      .from('crops')
      .select('*, crop_master(*)')
      .eq('id', cropId)
      .single();

    if (cropError || !crop) {
      throw new Error(`Crop not found: ${cropError?.message}`);
    }

    const sowingDate = new Date(crop.sowing_date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - sowingDate.getTime());
    const daysSinceSowing = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const durationDays = crop.crop_master.duration_days;
    const harvestDateObj = new Date(sowingDate);
    harvestDateObj.setDate(sowingDate.getDate() + durationDays);
    const harvestDate = harvestDateObj.toISOString().split('T')[0];

    // 2. Fetch all stages
    const { data: stages, error: stagesError } = await supabaseAdmin
      .from('crop_stages')
      .select('*')
      .eq('crop_master_id', crop.crop_master_id)
      .order('start_day', { ascending: true });

    if (stagesError) {
      throw new Error(`Error fetching crop stages: ${stagesError.message}`);
    }

    // Find current stage
    let currentStage = null;
    let nextStage = null;

    let activeStages = stages || [];
    if (activeStages.length === 0) {
      const d = durationDays;
      activeStages = [
        {
          id: 'default-stage-1',
          crop_master_id: crop.crop_master_id,
          stage_name: 'Sowing & Germination (पेरणी आणि उगवण)',
          start_day: 1,
          end_day: Math.floor(d * 0.15)
        },
        {
          id: 'default-stage-2',
          crop_master_id: crop.crop_master_id,
          stage_name: 'Vegetative Phase (शाकीय वाढ)',
          start_day: Math.floor(d * 0.15) + 1,
          end_day: Math.floor(d * 0.45)
        },
        {
          id: 'default-stage-3',
          crop_master_id: crop.crop_master_id,
          stage_name: 'Flowering & Fruit/Pod Formation (फूल आणि शेंगा/फळ धारणा)',
          start_day: Math.floor(d * 0.45) + 1,
          end_day: Math.floor(d * 0.75)
        },
        {
          id: 'default-stage-4',
          crop_master_id: crop.crop_master_id,
          stage_name: 'Maturity & Harvesting (परिपक्वता आणि कापणी)',
          start_day: Math.floor(d * 0.75) + 1,
          end_day: d
        }
      ];
    }

    if (activeStages && activeStages.length > 0) {
      for (let i = 0; i < activeStages.length; i++) {
        const stage = activeStages[i];
        if (daysSinceSowing >= stage.start_day && daysSinceSowing <= stage.end_day) {
          currentStage = {
            stageId: stage.id,
            stageName: stage.stage_name,
            startDay: stage.start_day,
            endDay: stage.end_day
          };
          if (i + 1 < activeStages.length) {
            nextStage = {
              stageName: activeStages[i + 1].stage_name,
              startDay: activeStages[i + 1].start_day
            };
          }
          break;
        }
      }

      // Fallback if days since sowing exceeds last stage
      if (!currentStage && daysSinceSowing > activeStages[activeStages.length - 1].end_day) {
        currentStage = {
          stageId: activeStages[activeStages.length - 1].id,
          stageName: activeStages[activeStages.length - 1].stage_name,
          startDay: activeStages[activeStages.length - 1].start_day,
          endDay: activeStages[activeStages.length - 1].end_day
        };
      }
      
      // Fallback if crop is newly sowed (before day 1)
      if (!currentStage && daysSinceSowing < activeStages[0].start_day) {
        currentStage = {
          stageId: activeStages[0].id,
          stageName: activeStages[0].stage_name,
          startDay: activeStages[0].start_day,
          endDay: activeStages[0].end_day
        };
      }
    }

    // 3. Fetch ALL recommendations
    let allFertilizers: any[] = [];
    let allSprays: any[] = [];
    let allIrrigation: any[] = [];

    if (activeStages && activeStages.length > 0 && activeStages[0].id.startsWith('default-stage-')) {
      // Create mock full schedule
      allFertilizers = [
        { id: 'df-1', stage_id: activeStages[0].id, fertilizer_name: 'NPK Organic Compost / Base Dose (सेंद्रिय खत)', quantity: 'Basal Dose: 50kg per acre' },
        { id: 'df-2', stage_id: activeStages[1].id, fertilizer_name: 'NPK 19:19:19 Soluble Fertilizer (१९:१९:१९ विद्राव्य खत)', quantity: 'Spray: 1kg per acre' },
        { id: 'df-3', stage_id: activeStages[2].id, fertilizer_name: 'NPK 0:52:34 & Micro-nutrients (०:५२:३४ आणि सूक्ष्म अन्नद्रव्ये)', quantity: 'Spray: 1.5kg per acre' }
      ];
      allSprays = [
        { id: 'ds-1', stage_id: activeStages[0].id, spray_name: 'Neem Oil Spray (कडुलिंब अर्क) for sucking pests prevention' },
        { id: 'ds-2', stage_id: activeStages[1].id, spray_name: 'Bio-Insecticide / Neem Oil (जैविक कीटकनाशक) for crop growth protection' },
        { id: 'ds-3', stage_id: activeStages[2].id, spray_name: 'Fungicide spray (बुरशीनाशक फवारणी) for flower rot prevention' },
        { id: 'ds-4', stage_id: activeStages[3].id, spray_name: 'No sprays recommended close to harvest (कापणीच्या वेळी फवारणी टाळा)' }
      ];
      allIrrigation = [
        { id: 'di-1', stage_id: activeStages[0].id, water_requirement: 'Light watering right after sowing if soil lacks moisture (पेरणीनंतर हलके पाणी)' },
        { id: 'di-2', stage_id: activeStages[1].id, water_requirement: 'Moderate watering at interval of 10-12 days (१०-१२ दिवसांच्या अंतराने मध्यम पाणी)' },
        { id: 'di-3', stage_id: activeStages[2].id, water_requirement: 'Critical stage: maintain consistent soil moisture (महत्त्वाचा टप्पा: जमिनीत पुरेसा ओलावा ठेवा)' },
        { id: 'di-4', stage_id: activeStages[3].id, water_requirement: 'Stop watering 10-15 days before harvest (कापणीच्या १०-१५ दिवस आधी पाणी देणे बंद करा)' }
      ];
    } else {
      const { data: fertData } = await supabaseAdmin
        .from('fertilizer_schedule')
        .select('*')
        .eq('crop_master_id', crop.crop_master_id);
      allFertilizers = fertData || [];

      const { data: sprayData } = await supabaseAdmin
        .from('spray_schedule')
        .select('*')
        .eq('crop_master_id', crop.crop_master_id);
      allSprays = sprayData || [];

      const { data: irrData } = await supabaseAdmin
        .from('irrigation_schedule')
        .select('*')
        .eq('crop_master_id', crop.crop_master_id);
      allIrrigation = irrData || [];
    }

    if (crop.farming_type === 'rainfed') {
      if (allIrrigation.length === 0 && activeStages && activeStages.length > 0) {
        allIrrigation = [{ id: 'di-rainfed', stage_id: activeStages[0].id, water_requirement: 'Rainfed Crop: Rely on natural rainfall. Provide life-saving irrigation only during extended dry spells (पावसावर अवलंबून. पावसाचा खंड पडल्यास संरक्षित पाणी द्या).' }];
      } else {
        allIrrigation = allIrrigation.map(irr => ({
          ...irr,
          water_requirement: `Rainfed (जिरायती): Rely on rainfall. Provide life-saving irrigation if needed. (Original: ${irr.water_requirement})`
        }));
      }
    }

    // Keep backwards compatibility for current stage
    let fertilizers = currentStage ? allFertilizers.filter(f => f.stage_id === currentStage!.stageId) : [];
    let sprays = currentStage ? allSprays.filter(s => s.stage_id === currentStage!.stageId) : [];
    let irrigation = currentStage ? allIrrigation.filter(i => i.stage_id === currentStage!.stageId) : [];


    // 4. Fetch all Diseases & Pests associated with the crop master
    const { data: dbDiseases } = await supabaseAdmin
      .from('diseases')
      .select('*')
      .eq('crop_master_id', crop.crop_master_id);

    let diseases = dbDiseases || [];
    if (diseases.length === 0) {
      diseases = [
        {
          id: 'default-dis-1',
          name: 'Powdery Mildew (भुरी रोग)',
          symptoms: 'White powdery growth on leaves and stems.',
          treatment: 'Spray Sulphur 80% WP @ 2g/liter of water or Dinocap @ 1ml/liter.'
        }
      ];
    }

    const { data: dbPests } = await supabaseAdmin
      .from('pests')
      .select('*')
      .eq('crop_master_id', crop.crop_master_id);

    let pests = dbPests || [];
    if (pests.length === 0) {
      pests = [
        {
          id: 'default-pest-1',
          name: 'Aphids / Thrips (मावा / तुडतुडे)',
          symptoms: 'Curling of leaves, sticky honeydew on leaves.',
          control_method: 'Spray Neem Seed Kernel Extract (NSKE) 5% or Dimethoate 30 EC @ 2ml/liter.'
        }
      ];
    }

    // Helper for seed brands and cultivation guide
    let seedBrands = 'Local certified seed distributors';
    let cultivationGuide = 'General tillage, soil testing, and timely irrigation recommended.';

    const nameLower = crop.crop_master.name.toLowerCase();
    if (nameLower.includes('cotton') || nameLower.includes('kapus')) {
      seedBrands = 'Rasi Seeds (Neo, RCH-659), Mahyco (Kanak), Kaveri Seeds (Jadoo), Nuziveedu Seeds (Bhakti)';
      cultivationGuide = 'Deep ploughing in summer. Spacing of 90x60 cm or 120x60 cm. Pre-sowing seed treatment with Imidacloprid (7g/kg) to protect against early sucking pests. First spray at 25-30 days after sowing.';
    } else if (nameLower.includes('soybean')) {
      seedBrands = 'Mahabeej (JS-335, Phule Sangam), Eagle Seeds, Rasi Seeds, Rajkumar Seeds';
      cultivationGuide = 'Ploughing followed by 2 harrowings. Spacing of 45x15 cm. Sowing depth of 3-5 cm. Seed treatment with Carboxin + Thiram (2g/kg) and Rhizobium culture. First spray at 20 days after sowing.';
    } else if (nameLower.includes('wheat') || nameLower.includes('gahu')) {
      seedBrands = 'Mahabeej (Lok-1, HD-2189), Shriram Seeds (Shriram 252), JK Seeds, Pioneer';
      cultivationGuide = 'Fine seedbed preparation by 2-3 harrowings. Sowing at spacing of 22.5 cm in lines. Pre-irrigation required before sowing. Seed treatment with Vitavax (2g/kg). First spray or weeding at 21 days.';
    } else if (nameLower.includes('rice') || nameLower.includes('bhat')) {
      seedBrands = 'Syngenta (NK 5251), Bayer (Arize 6444), Mahyco, Mahabeej (Indrayani)';
      cultivationGuide = 'Puddling of soil is critical. Sowing in nursery beds, then transplanting 21-25 days old seedlings into the main field with 20x15 cm spacing. Keep 2-5 cm of water level in the field. First spray at nursery stage.';
    } else if (nameLower.includes('sugarcane') || nameLower.includes('us')) {
      seedBrands = 'Local Government Sugar Factories, Vasantdada Sugar Institute (VSI) nurseries';
      cultivationGuide = 'Deep ploughing up to 30 cm. Ridge and furrow method at 120 cm spacing. Setts treatment with Carbendazim (0.1%) and Malathion (0.1%) for 15 mins before planting. First earthing up at 4 months.';
    } else if (nameLower.includes('tur') || nameLower.includes('pigeon')) {
      seedBrands = 'Mahabeej (Vipula, BDN-711), MPKV Rahuri (Phule Rajeshwari), local nurseries';
      cultivationGuide = 'Grows best in deep, well-drained loamy soils. Spacing 90x20 cm or 120x30 cm. Seed treatment with Trichoderma (5g/kg) and Rhizobium. Intercropping with Soybean (1:2 ratio) is highly recommended.';
    } else if (nameLower.includes('chickpea') || nameLower.includes('harbhara')) {
      seedBrands = 'Mahabeej (Vijay, Digvijay, Phule Vikram), local cooperative societies';
      cultivationGuide = 'Sow in residual soil moisture after Kharif harvest. Spacing 30x10 cm. Seed treatment with Trichoderma (5g/kg) and Ammonium Molybdate. Nipping of terminal buds at 30-35 days to promote branching.';
    } else if (nameLower.includes('groundnut') || nameLower.includes('bhuimug')) {
      seedBrands = 'Mahabeej (TAG-24, SB-11), Eagle Seeds, local certified seed sellers';
      cultivationGuide = 'Sandy loam soils are ideal. Spacing 30x10 cm. Seed treatment with Trichoderma (4g/kg). Apply Gypsum (200kg/acre) at flowering stage (40-45 days after sowing) to ensure proper pod development.';
    } else if (nameLower.includes('onion') || nameLower.includes('kanda')) {
      seedBrands = 'Panchganga Seeds, Kalash Seeds, Safal Seeds, Bhima Red (DOGR)';
      cultivationGuide = 'Raise seedlings in nursery beds for 40-45 days. Transplant in ridges/furrows at 15x10 cm spacing. Requires light, well-drained soils. First weeding and light irrigation at 15 days post transplant.';
    } else if (nameLower.includes('tomato')) {
      seedBrands = 'Syngenta (Abhinav, TO-3251), Seminis/Bayer (Ansal), Namdhari Seeds';
      cultivationGuide = 'Raise nursery for 30 days. Transplant at 60x45 cm spacing. Staking with bamboo poles is necessary at 30-35 days to support heavy fruiting. Drip irrigation and mulching sheets are highly recommended.';
    } else if (nameLower.includes('maize') || nameLower.includes('maka')) {
      seedBrands = 'Pioneer (P30V92), Dekalb/Bayer (9108), Syngenta (NK-6240)';
      cultivationGuide = 'Deep ploughing followed by harrowing. Spacing 60x20 cm. Sow seeds at 5 cm depth. Seed treatment with Metalaxyl (4g/kg) against downy mildew. First earthing up at 30 days.';
    } else if (nameLower.includes('bajra')) {
      seedBrands = 'Pioneer (86M86), Kaveri Seeds (Boss), Devgen, Shraddha (Mahyco)';
      cultivationGuide = 'Requires light sandy loam soil. Spacing 45x15 cm. Sowing depth of 2-3 cm. Thrives in low moisture. First inter-culturing and thinning at 15-20 days after sowing.';
    } else if (nameLower.includes('jowar')) {
      seedBrands = 'Mahyco (MSH-51), Kaveri Seeds, Mahabeej (Maldandi M-35-1)';
      cultivationGuide = 'Sowing in well-drained clayey soils. Spacing 45x15 cm. Seed treatment with Sulfur (3g/kg) for grain smut prevention. First weeding and inter-culturing at 25-30 days.';
    } else if (nameLower.includes('grapes') || nameLower.includes('drakshe')) {
      seedBrands = 'NRC Grapes Pune, certified grapevine nurseries (Thompson Seedless, Sharad)';
      cultivationGuide = 'Requires training on Y-trellis or Bower system. Spacing 3x1.8 meters. Pruning twice a year: Foundation pruning in April and Fruit pruning in October. Keep canopy open for sunlight.';
    } else if (nameLower.includes('pomegranate') || nameLower.includes('dalimb')) {
      seedBrands = 'MPKV Rahuri nurseries, tissue culture labs (Bhagwa, Ganesh)';
      cultivationGuide = 'Spacing of 4.5 x 3 meters. Sowing in pits of 60x60x60 cm. Bahar management (Ambe/Mrig/Hasta bahar selection) based on water availability. Pruning after harvest is necessary.';
    } else if (nameLower.includes('mango') || nameLower.includes('amba')) {
      seedBrands = 'DBSKKV Dapoli nurseries, Maharashtra State Agriculture nurseries (Alphonso, Kesar)';
      cultivationGuide = 'Planting spacing of 10x10 meters (or 5x5 meters for high density). Pit size of 1x1x1 meter filled with organic manure and bone meal. Regular basin cleanings and mulching during dry seasons.';
    } else if (nameLower.includes('banana') || nameLower.includes('keli')) {
      seedBrands = 'Jain Irrigation Systems (Grand Naine G-9), local tissue culture labs';
      cultivationGuide = 'Spacing of 1.8x1.8 meters. Plant tissue culture plantlets in pits. High requirements of Nitrogen and Potassium. Provide windbreak trees on borders. Earthing up at 3-4 months to support stem.';
    } else if (nameLower.includes('turmeric') || nameLower.includes('halad')) {
      seedBrands = 'IISR Kozhikode, local certified growers (Selam, Krishna)';
      cultivationGuide = 'Broad bed furrow (BBF) method is best. Spacing of 30x15 cm on raised beds. Mother rhizome sowing is preferred. Mulching with leaves right after planting to retain moisture.';
    } else if (nameLower.includes('ginger') || nameLower.includes('ale')) {
      seedBrands = 'IISR Kozhikode, local certified seed rhizome growers (Mahim)';
      cultivationGuide = 'Grows best in partial shade. Sowing on raised beds of 15 cm height at 30x20 cm spacing. Excellent drainage is essential to prevent rhizome rot. Organic mulching at sowing, 45, and 90 days.';
    } else if (nameLower.includes('chilli') || nameLower.includes('mirchi')) {
      seedBrands = 'Syngenta (Hot Pepper), Seminis, Namdhari Seeds (Jwala)';
      cultivationGuide = 'Transplant 30-35 days old seedlings. Spacing 60x45 cm. Requires high potassium and calcium to prevent blossom end rot. Disease preventive sprays starting at 15 days post transplant.';
    }

    return {
      cropId,
      cropName: crop.crop_master.name,
      sowingDate: crop.sowing_date,
      daysSinceSowing,
      currentStage,
      nextStage,
      harvestDate,
      fertilizers,
      sprays,
      irrigation,
      allStages: activeStages,
      allFertilizers,
      allSprays,
      allIrrigation,
      diseases,
      pests,
      seedBrands,
      cultivationGuide
    };
  }
}
