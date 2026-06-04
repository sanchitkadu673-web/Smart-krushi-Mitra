import { describe, it, expect, vi } from 'vitest';
import { RecommendationEngineService } from '../services/RecommendationEngineService';

vi.mock('../config/supabase', () => {
  const createMockQuery = (data: any) => {
    const query: any = {
      eq: () => query,
      order: () => query,
      single: async () => ({ data, error: null }),
      then: (onfulfilled: any) => onfulfilled({ data, error: null })
    };
    return query;
  };

  return {
    supabaseAdmin: {
      from: (table: string) => {
        return {
          select: () => {
            if (table === 'crops') {
              return createMockQuery({
                id: 'crop-123',
                sowing_date: '2026-05-20',
                crop_master_id: 'master-123',
                crop_master: {
                  name: 'Cotton',
                  duration_days: 150
                }
              });
            }
            if (table === 'crop_stages') {
              return createMockQuery([
                { id: 'stage-1', stage_name: 'Germination', start_day: 1, end_day: 15 },
                { id: 'stage-2', stage_name: 'Vegetative', start_day: 16, end_day: 45 }
              ]);
            }
            return createMockQuery([]);
          }
        };
      }
    }
  };
});

describe('Recommendation Engine Service', () => {
  it('correctly maps crop stages based on days since sowing', async () => {
    // Override Date to a fixed date
    const mockToday = new Date('2026-06-04');
    vi.useFakeTimers();
    vi.setSystemTime(mockToday);

    const recommendations = await RecommendationEngineService.getRecommendations('crop-123');
    
    expect(recommendations.cropName).toBe('Cotton');
    expect(recommendations.daysSinceSowing).toBe(15);
    expect(recommendations.currentStage?.stageName).toBe('Germination');
    expect(recommendations.nextStage?.stageName).toBe('Vegetative');

    vi.useRealTimers();
  });
});
