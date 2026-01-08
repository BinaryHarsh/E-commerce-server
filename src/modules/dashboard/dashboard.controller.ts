import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { DashboardService } from './dashboard.service';
import { sendSuccess } from '../../utils/response';

export class DashboardController {
  private dashboardService = new DashboardService();

  getSummary = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const summary = await this.dashboardService.getSummary();
      sendSuccess(res, 'Dashboard summary retrieved successfully', summary);
    } catch (error) {
      next(error);
    }
  };

  getCharts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
      const charts = await this.dashboardService.getCharts(days);
      sendSuccess(res, 'Dashboard charts retrieved successfully', charts);
    } catch (error) {
      next(error);
    }
  };
}
