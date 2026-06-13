import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get('/', requireAuth, NotificationController.listNotifications);
router.put('/read', requireAuth, NotificationController.markAsRead);
router.delete('/:id', requireAuth, NotificationController.deleteNotification);

export default router;
