import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import usersRoutes from '../modules/users/users.routes';
import productsRoutes from '../modules/products/products.routes';
import ordersRoutes from '../modules/orders/orders.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';
import notificationsRoutes from '../modules/notifications/notifications.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/products', productsRoutes);
router.use('/orders', ordersRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/notifications', notificationsRoutes);

export default router;
