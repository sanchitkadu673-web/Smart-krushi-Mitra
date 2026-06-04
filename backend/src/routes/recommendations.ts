import { Router } from 'express';
import { RecommendationController } from '../controllers/RecommendationController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get('/:cropId', requireAuth, RecommendationController.getRecommendations);

export default router;
