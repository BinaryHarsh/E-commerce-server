import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt';
import { AppDataSource } from '../config/datasource';
import { User } from '../entities/User';
import { AppError } from './error.middleware';

export interface AuthRequest extends Request {
  user?: User;
  tokenPayload?: JWTPayload;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: payload.userId, isActive: true },
    });

    if (!user) {
      throw new AppError('User not found or inactive', 401);
    }

    req.user = user;
    req.tokenPayload = payload;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Invalid token', 401));
    }
  }
};
