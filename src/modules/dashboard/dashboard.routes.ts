import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireAdmin } from '../../middlewares/role.middleware';

const router = Router();
const dashboardController = new DashboardController();

router.get('/summary', authMiddleware, requireAdmin, dashboardController.getSummary);
router.get('/charts', authMiddleware, requireAdmin, dashboardController.getCharts);

export default router;
