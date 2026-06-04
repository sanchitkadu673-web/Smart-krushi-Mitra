import { Router } from 'express';
import { ProfileController } from '../controllers/ProfileController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get('/', requireAuth, ProfileController.getProfile);
router.put('/', requireAuth, ProfileController.updateProfile);

export default router;
