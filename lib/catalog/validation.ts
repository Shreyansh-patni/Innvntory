import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Category name cannot exceed 100 characters')
    .trim(),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional().nullable(),
  hsn_code: z.string().max(20, 'HSN code cannot exceed 20 characters').optional().nullable(),
  gst_rate_percent: z.coerce
    .number()
    .min(0, 'GST rate cannot be negative')
    .max(100, 'GST rate cannot exceed 100%')
    .default(18),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
});

export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(200, 'Product name cannot exceed 200 characters')
    .trim(),
  description: z.string().max(2000, 'Description cannot exceed 2000 characters').optional().nullable(),
  sku: z
    .string()
    .min(1, 'SKU is required')
    .max(50, 'SKU cannot exceed 50 characters')
    .regex(/^[A-Za-z0-9-_.]+$/, 'SKU may only contain letters, numbers, hyphens, underscores, and dots')
    .trim(),
  barcode: z
    .string()
    .max(100, 'Barcode cannot exceed 100 characters')
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
  category_id: z
    .string()
    .uuid('Invalid category selection')
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val : null)),
  unit_code: z.string().min(1, 'Unit of measurement is required').default('PCS'),
  cost_price: z.coerce.number().min(0, 'Cost price cannot be negative').default(0),
  selling_price: z.coerce.number().min(0, 'Selling price cannot be negative').default(0),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type ProductInput = z.infer<typeof productSchema>;
