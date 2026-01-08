import { Router } from 'express';
import { NotificationsController } from './notifications.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  getNotificationsSchema,
  markAsReadSchema,
} from './notifications.schemas';

const router = Router();
const notificationsController = new NotificationsController();

router.get(
  '/',
  authMiddleware,
  validate(getNotificationsSchema),
  notificationsController.getAllNotifications
);

router.patch(
  '/:id/read',
  authMiddleware,
  validate(markAsReadSchema),
  notificationsController.markAsRead
);

export default router;
