/**
 * lib/demo/reset.ts
 *
 * INNVNTORY — DEMO WORKSPACE RESET ENGINE
 * Sahaya Technologies Pvt. Ltd.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import {
  resetDemoWorkspace as executeReset,
  DEMO_ORG_SLUG,
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
} from './reset-engine.mjs';

export { DEMO_ORG_SLUG };
export const CANONICAL_CATEGORIES = DEMO_CATEGORIES;
export const CANONICAL_PRODUCTS = DEMO_PRODUCTS;

export interface ResetResult {
  success: boolean;
  organizationId?: string;
  organizationSlug: string;
  counts: {
    warehouses: number;
    categories: number;
    products: number;
    stockBalances: number;
    customers: number;
    suppliers: number;
    purchaseOrders: number;
    purchaseOrderItems: number;
    purchaseReceipts: number;
    purchasePayments: number;
    purchaseReturns: number;
    salesOrders: number;
    salesOrderItems: number;
    invoices: number;
    salesPayments: number;
    salesReturns: number;
    inventoryTransfers: number;
    inventoryAdjustments: number;
    inventoryMovements: number;
  };
  durationMs: number;
  error?: string;
}

export async function resetDemoWorkspace(
  supabaseAdmin: SupabaseClient
): Promise<ResetResult> {
  return executeReset(supabaseAdmin) as Promise<ResetResult>;
}
