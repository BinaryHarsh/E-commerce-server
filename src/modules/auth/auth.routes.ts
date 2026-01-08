import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authMiddleware } from '../../middlewares/auth.middleware';
import {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from './auth.schemas';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.put('/profile', authMiddleware, validate(updateProfileSchema), authController.updateProfile);

export default router;
