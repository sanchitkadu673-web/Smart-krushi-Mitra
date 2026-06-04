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
  diseases: any[];
  pests: any[];
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

    if (stages && stages.length > 0) {
      for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];
        if (daysSinceSowing >= stage.start_day && daysSinceSowing <= stage.end_day) {
          currentStage = {
            stageId: stage.id,
            stageName: stage.stage_name,
            startDay: stage.start_day,
            endDay: stage.end_day
          };
          if (i + 1 < stages.length) {
            nextStage = {
              stageName: stages[i + 1].stage_name,
              startDay: stages[i + 1].start_day
            };
          }
          break;
        }
      }

      // Fallback if days since sowing exceeds last stage
      if (!currentStage && daysSinceSowing > stages[stages.length - 1].end_day) {
        currentStage = {
          stageId: stages[stages.length - 1].id,
          stageName: stages[stages.length - 1].stage_name,
          startDay: stages[stages.length - 1].start_day,
          endDay: stages[stages.length - 1].end_day
        };
      }
      
      // Fallback if crop is newly sowed (before day 1)
      if (!currentStage && daysSinceSowing < stages[0].start_day) {
        currentStage = {
          stageId: stages[0].id,
          stageName: stages[0].stage_name,
          startDay: stages[0].start_day,
          endDay: stages[0].end_day
        };
      }
    }

    // 3. Fetch recommendations for current stage (or overall)
    let fertilizers: any[] = [];
    let sprays: any[] = [];
    let irrigation: any[] = [];

    if (currentStage) {
      const { data: fertData } = await supabaseAdmin
        .from('fertilizer_schedule')
        .select('*')
        .eq('crop_master_id', crop.crop_master_id)
        .eq('stage_id', currentStage.stageId);
      fertilizers = fertData || [];

      const { data: sprayData } = await supabaseAdmin
        .from('spray_schedule')
        .select('*')
        .eq('crop_master_id', crop.crop_master_id)
        .eq('stage_id', currentStage.stageId);
      sprays = sprayData || [];

      const { data: irrData } = await supabaseAdmin
        .from('irrigation_schedule')
        .select('*')
        .eq('crop_master_id', crop.crop_master_id)
        .eq('stage_id', currentStage.stageId);
      irrigation = irrData || [];
    }

    // 4. Fetch all Diseases & Pests associated with the crop master
    const { data: diseases } = await supabaseAdmin
      .from('diseases')
      .select('*')
      .eq('crop_master_id', crop.crop_master_id);

    const { data: pests } = await supabaseAdmin
      .from('pests')
      .select('*')
      .eq('crop_master_id', crop.crop_master_id);

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
      diseases: diseases || [],
      pests: pests || []
    };
  }
}
