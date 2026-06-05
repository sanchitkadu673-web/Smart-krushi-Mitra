import { Router } from 'express';
import { CropController } from '../controllers/CropController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get('/masters', requireAuth, CropController.listCropMasters);
router.get('/', requireAuth, CropController.listCrops);
router.post('/', requireAuth, CropController.createCrop);
router.get('/:id', requireAuth, CropController.getCropDetails);
router.put('/:id', requireAuth, CropController.updateCrop);
router.delete('/:id', requireAuth, CropController.deleteCrop);

export default router;
