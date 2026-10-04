import { z } from 'zod';

export const businessSetupSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters').max(100),
  industry: z.enum([
    'retail',
    'wholesale',
    'electronics',
    'apparel',
    'manufacturing',
    'fmcg',
    'other',
  ]),
  country: z.string().min(2).default('India'),
  currency: z.string().min(2).default('INR'),
});

export const inventorySetupSchema = z.object({
  warehouseName: z.string().min(2, 'Warehouse name must be at least 2 characters').max(100).default('Main Warehouse'),
  warehouseCity: z.string().min(2, 'City is required').max(100).default('Mumbai'),
  skuCountRange: z.enum(['1-50', '50-500', '500-5000', '5000+']),
  gstRegistered: z.boolean().default(true),
});

export const fullOnboardingSchema = z.object({
  business: businessSetupSchema,
  inventory: inventorySetupSchema,
});

export type BusinessSetupData = z.infer<typeof businessSetupSchema>;
export type InventorySetupData = z.infer<typeof inventorySetupSchema>;
export type FullOnboardingData = z.infer<typeof fullOnboardingSchema>;

export const DEMO_ONBOARDING_COOKIE = 'innvntory_demo_onboarding_completed';

export interface OnboardingStatus {
  isCompleted: boolean;
  completedAt: string | null;
  currentStep: number;
  draftData: Partial<FullOnboardingData>;
  isDemo: boolean;
  organizationName?: string;
}
