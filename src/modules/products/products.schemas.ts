import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    purchasePrice: z.number().positive('Purchase price must be positive'),
    salePrice: z.number().positive('Sale price must be positive'),
    stock: z.number().int().min(0, 'Stock must be non-negative'),
    isVisible: z.boolean().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    purchasePrice: z.number().positive('Purchase price must be positive').optional(),
    salePrice: z.number().positive('Sale price must be positive').optional(),
    stock: z.number().int().min(0, 'Stock must be non-negative').optional(),
    isVisible: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
});

export const getProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
});

export const deleteProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
});

export const getProductsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    search: z.string().optional(),
  }),
});

export const updateVisibilitySchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
  body: z.object({
    isVisible: z.boolean(),
  }),
});

export const updateStockSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
  body: z.object({
    stock: z.number().int().min(0, 'Stock must be non-negative'),
  }),
});
