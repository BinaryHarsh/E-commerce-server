import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { UserRole } from '../entities/User';
import { AppError } from './error.middleware';

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  if (req.user.role !== UserRole.ADMIN) {
    throw new AppError('Admin access required', 403);
  }

  next();
};
