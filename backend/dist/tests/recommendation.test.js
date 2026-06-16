"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const RecommendationEngineService_1 = require("../services/RecommendationEngineService");
vitest_1.vi.mock('../config/supabase', () => {
    const createMockQuery = (data) => {
        const query = {
            eq: () => query,
            order: () => query,
            single: async () => ({ data, error: null }),
            then: (onfulfilled) => onfulfilled({ data, error: null })
        };
        return query;
    };
    return {
        supabaseAdmin: {
            from: (table) => {
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
(0, vitest_1.describe)('Recommendation Engine Service', () => {
    (0, vitest_1.it)('correctly maps crop stages based on days since sowing', async () => {
        // Override Date to a fixed date
        const mockToday = new Date('2026-06-04');
        vitest_1.vi.useFakeTimers();
        vitest_1.vi.setSystemTime(mockToday);
        const recommendations = await RecommendationEngineService_1.RecommendationEngineService.getRecommendations('crop-123');
        (0, vitest_1.expect)(recommendations.cropName).toBe('Cotton');
        (0, vitest_1.expect)(recommendations.daysSinceSowing).toBe(15);
        (0, vitest_1.expect)(recommendations.currentStage?.stageName).toBe('Germination');
        (0, vitest_1.expect)(recommendations.nextStage?.stageName).toBe('Vegetative');
        vitest_1.vi.useRealTimers();
    });
});
