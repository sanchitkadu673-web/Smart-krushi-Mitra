import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

// Protect all admin endpoints
router.use(requireAuth);
router.use(requireRole(['admin', 'super_admin']));

router.get('/stats', AdminController.getStats);
router.get('/farmers', AdminController.listFarmers);
router.get('/shops', AdminController.listShops);
router.post('/broadcast', AdminController.broadcastNotification);
router.delete('/farmers/:id', AdminController.deleteFarmer);
router.delete('/shops/:id', AdminController.deleteShop);
router.put('/shops/:id/approve', AdminController.toggleShopApproval);

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

// Diseases
router.get('/diseases', AdminController.listDiseases);
router.post('/diseases', AdminController.createDisease);
router.put('/diseases/:id', AdminController.updateDisease);
router.delete('/diseases/:id', AdminController.deleteDisease);

// Pests
router.get('/pests', AdminController.listPests);
router.post('/pests', AdminController.createPest);
router.put('/pests/:id', AdminController.updatePest);
router.delete('/pests/:id', AdminController.deletePest);

export default router;
