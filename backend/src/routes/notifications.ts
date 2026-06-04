import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get('/', requireAuth, NotificationController.listNotifications);
router.put('/read', requireAuth, NotificationController.markAsRead);

export default router;
