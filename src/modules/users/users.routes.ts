import { Router } from 'express';
import { UsersController } from './users.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireAdmin } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
  deleteUserSchema,
  getUsersSchema,
} from './users.schemas';

const router = Router();
const usersController = new UsersController();

router.get(
  '/',
  authMiddleware,
  requireAdmin,
  validate(getUsersSchema),
  usersController.getAllUsers
);

router.get(
  '/:id',
  authMiddleware,
  requireAdmin,
  validate(getUserSchema),
  usersController.getUserById
);

router.post(
  '/',
  authMiddleware,
  requireAdmin,
  validate(createUserSchema),
  usersController.createUser
);

router.put(
  '/:id',
  authMiddleware,
  requireAdmin,
  validate(updateUserSchema),
  usersController.updateUser
);

router.delete(
  '/:id',
  authMiddleware,
  requireAdmin,
  validate(deleteUserSchema),
  usersController.deleteUser
);

export default router;
