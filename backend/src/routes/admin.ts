import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

// Protect all admin endpoints
router.use(requireAuth);
router.use(requireRole(['admin', 'super_admin']));

router.get('/stats', AdminController.getStats);

// Crop Master
router.get('/crops', AdminController.listCropMasters);
router.post('/crops', AdminController.createCropMaster);
router.put('/crops/:id', AdminController.updateCropMaster);
router.delete('/crops/:id', AdminController.deleteCropMaster);

// Stages
router.get('/stages', AdminController.listStages);
router.post('/stages', AdminController.createStage);
router.put('/stages/:id', AdminController.updateStage);
router.delete('/stages/:id', AdminController.deleteStage);

export default router;
