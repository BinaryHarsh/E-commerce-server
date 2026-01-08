import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { ProductsController } from './products.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireAdmin } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { env } from '../../config/env';
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  deleteProductSchema,
  getProductsSchema,
  updateVisibilitySchema,
  updateStockSchema,
} from './products.schemas';

const router = Router();
const productsController = new ProductsController();

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, env.upload.dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: env.upload.maxFileSize },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Public routes
router.get('/', validate(getProductsSchema), productsController.getAllProducts);
router.get('/:id', validate(getProductSchema), productsController.getProductById);

// Admin routes
router.post(
  '/',
  authMiddleware,
  requireAdmin,
  validate(createProductSchema),
  productsController.createProduct
);

router.put(
  '/:id',
  authMiddleware,
  requireAdmin,
  validate(updateProductSchema),
  productsController.updateProduct
);

router.delete(
  '/:id',
  authMiddleware,
  requireAdmin,
  validate(deleteProductSchema),
  productsController.deleteProduct
);

router.patch(
  '/:id/visibility',
  authMiddleware,
  requireAdmin,
  validate(updateVisibilitySchema),
  productsController.updateVisibility
);

router.patch(
  '/:id/stock',
  authMiddleware,
  requireAdmin,
  validate(updateStockSchema),
  productsController.updateStock
);

router.post(
  '/:id/upload',
  authMiddleware,
  requireAdmin,
  upload.single('image'),
  productsController.uploadImage
);

export default router;
