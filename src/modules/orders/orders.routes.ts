import { Router } from 'express';
import { OrdersController } from './orders.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireAdmin } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createOrderSchema,
  getOrdersSchema,
  proceedOrderSchema,
  cancelOrderSchema,
} from './orders.schemas';

const router = Router();
const ordersController = new OrdersController();

// User route
router.post(
  '/',
  authMiddleware,
  validate(createOrderSchema),
  ordersController.createOrder
);

// Admin routes
router.get(
  '/',
  authMiddleware,
  requireAdmin,
  validate(getOrdersSchema),
  ordersController.getAllOrders
);

router.patch(
  '/:id/proceed',
  authMiddleware,
  requireAdmin,
  validate(proceedOrderSchema),
  ordersController.proceedOrder
);

router.patch(
  '/:id/cancel',
  authMiddleware,
  requireAdmin,
  validate(cancelOrderSchema),
  ordersController.cancelOrder
);

export default router;
