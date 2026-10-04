/**
 * lib/demo/reset.ts
 *
 * INNVNTORY — DEMO WORKSPACE RESET ENGINE
 * Sahaya Technologies Pvt. Ltd.
 *
 * PURPOSE:
 *   Deterministically resets the isolated "Innvntory Demo Workspace" (slug: innvntory-demo)
 *   to its canonical original baseline every 2 hours.
 *
 * SAFETY GUARDS:
 *   1. Explicitly scoped ONLY to organization slug 'innvntory-demo'.
 *   2. Fails closed if the demo organization cannot be verified.
 *   3. Never touches non-demo organizations, customers, or external records.
 *   4. Preserves the demo auth user, organization row, membership, and role.
 *   5. Idempotent and deterministic — multiple executions result in the exact same state.
 *   6. Never logs or returns secrets, passwords, or credentials.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { DEMO_ORG_SLUG } from './config';

export const VIEWER_ROLE_ID = '00000000-0000-0000-0000-000000000007';

export const UNIT_PCS = '00000000-0000-0000-0000-000000000101';
export const UNIT_BOX = '00000000-0000-0000-0000-000000000102';
export const UNIT_SET = '00000000-0000-0000-0000-000000000108';

export interface CanonicalCategory {
  name: string;
  description: string;
  hsn_code: string;
  gst_rate_percent: number;
}

export interface CanonicalProduct {
  name: string;
  sku: string;
  barcode: string;
  category: string;
  unit_id: string;
  unit_code: string;
  cost_price: number;
  selling_price: number;
  description: string;
}

export const CANONICAL_CATEGORIES: CanonicalCategory[] = [
  {
    name: 'Apparel',
    description: 'Clothing and garments including shirts, trousers, jeans, and hoodies.',
    hsn_code: '6109',
    gst_rate_percent: 12.00,
  },
  {
    name: 'Footwear',
    description: 'Shoes, sandals, boots, and sneakers for all occasions.',
    hsn_code: '6403',
    gst_rate_percent: 18.00,
  },
  {
    name: 'Accessories',
    description: 'Belts, bags, wallets, caps, and other fashion accessories.',
    hsn_code: '4205',
    gst_rate_percent: 18.00,
  },
  {
    name: 'Electronics',
    description: 'Computer peripherals, wireless devices, and office electronics.',
    hsn_code: '8471',
    gst_rate_percent: 18.00,
  },
  {
    name: 'Home & Office',
    description: 'Stationery, desk accessories, lamps, and home organisation products.',
    hsn_code: '3924',
    gst_rate_percent: 12.00,
  },
];

export const CANONICAL_PRODUCTS: CanonicalProduct[] = [
  // Apparel (10 products)
  { name: 'Classic Cotton T-Shirt', sku: 'CCT-1001', barcode: '8901234100001', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 180.00, selling_price: 499.00, description: 'Premium 180GSM cotton crew-neck T-shirt, available in multiple colours and sizes.' },
  { name: 'Oxford Casual Button-Down Shirt', sku: 'OCS-3021', barcode: '8901234300021', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 340.00, selling_price: 999.00, description: 'Lightweight oxford weave casual shirt, perfect for smart-casual styling.' },
  { name: 'Slim Fit Denim Jeans', sku: 'SFD-2048', barcode: '8901234200048', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 520.00, selling_price: 1499.00, description: 'Stretch denim slim-fit jeans with five-pocket design and comfort waistband.' },
  { name: 'Regular Fit Chinos', sku: 'RFC-2051', barcode: '8901234200051', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 390.00, selling_price: 1199.00, description: 'Classic cotton-blend chinos with straight leg, wrinkle-resistant finish.' },
  { name: 'Lightweight Pullover Hoodie', sku: 'LPH-1085', barcode: '8901234100085', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 420.00, selling_price: 1299.00, description: 'Brushed fleece pullover hoodie with kangaroo pocket and adjustable drawstring.' },
  { name: 'Formal Trouser — Charcoal', sku: 'FTC-2062', barcode: '8901234200062', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 580.00, selling_price: 1699.00, description: 'Poly-viscose formal trousers with regular fit, ideal for business and office wear.' },
  { name: 'Linen Casual Shirt', sku: 'LCS-3035', barcode: '8901234300035', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 460.00, selling_price: 1399.00, description: 'Breathable pure linen shirt with spread collar, ideal for summer styling.' },
  { name: 'Relaxed Fit Jogger', sku: 'RFJ-1092', barcode: '8901234100092', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 280.00, selling_price: 799.00, description: 'Cotton-blend jogger pants with elastic waistband and tapered cuffs.' },
  { name: 'Polo Neck T-Shirt', sku: 'PNT-1007', barcode: '8901234100007', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 220.00, selling_price: 649.00, description: 'Pique cotton polo with two-button placket, available in solid colours.' },
  { name: 'Quilted Winter Jacket', sku: 'QWJ-4011', barcode: '8901234400011', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 890.00, selling_price: 2499.00, description: 'Lightweight quilted jacket with mock neck collar and two front pockets.' },

  // Footwear (5 products)
  { name: 'Canvas Low-Top Sneakers', sku: 'CVS-5018', barcode: '8901234500018', category: 'Footwear', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 350.00, selling_price: 999.00, description: 'Classic canvas vulcanised sneakers with rubber sole and lace-up closure.' },
  { name: 'Leather Oxford Formal Shoes', sku: 'LOF-5032', barcode: '8901234500032', category: 'Footwear', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 780.00, selling_price: 2299.00, description: 'Genuine leather Oxford shoes with Goodyear welt construction.' },
  { name: 'Lightweight Running Shoes', sku: 'LRS-5047', barcode: '8901234500047', category: 'Footwear', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 620.00, selling_price: 1799.00, description: 'Mesh upper running shoes with cushioned midsole and non-slip outsole.' },
  { name: 'Casual Slip-On Loafers', sku: 'CSL-5061', barcode: '8901234500061', category: 'Footwear', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 440.00, selling_price: 1299.00, description: 'Suede-finish slip-on loafers with elastic gussets for easy on-off wear.' },
  { name: 'Ankle Length Sports Socks (Pack of 3)', sku: 'ASS-5073', barcode: '8901234500073', category: 'Footwear', unit_id: UNIT_SET, unit_code: 'SET', cost_price: 75.00, selling_price: 199.00, description: 'Moisture-wicking cotton-blend ankle socks, pack of 3 pairs.' },

  // Accessories (7 products)
  { name: 'Leather Reversible Casual Belt', sku: 'LCB-4102', barcode: '8901234401020', category: 'Accessories', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 290.00, selling_price: 799.00, description: 'Genuine leather reversible belt — black/tan — with single prong buckle.' },
  { name: 'Canvas Laptop Backpack 30L', sku: 'CLB-4115', barcode: '8901234401150', category: 'Accessories', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 680.00, selling_price: 1999.00, description: 'Water-resistant canvas backpack with padded 15-inch laptop compartment.' },
  { name: 'Classic Bi-fold Wallet', sku: 'CBW-4128', barcode: '8901234401280', category: 'Accessories', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 180.00, selling_price: 499.00, description: 'Slim genuine leather bi-fold wallet with 6-card slots and cash compartment.' },
  { name: 'Structured Sports Cap', sku: 'SSC-4141', barcode: '8901234401410', category: 'Accessories', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 120.00, selling_price: 349.00, description: 'Six-panel structured cap with embroidered logo and adjustable strap.' },
  { name: 'Sunglasses — Aviator Frame', sku: 'SAF-4154', barcode: '8901234401540', category: 'Accessories', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 320.00, selling_price: 899.00, description: 'UV400 protection metal-frame aviator sunglasses with polarised lenses.' },
  { name: 'Cotton Canvas Tote Bag', sku: 'CCT-4167', barcode: '8901234401670', category: 'Accessories', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 90.00, selling_price: 249.00, description: 'Natural cotton canvas open-top tote bag with reinforced handles.' },
  { name: 'RFID Blocking Slim Cardholder', sku: 'RSC-4180', barcode: '8901234401800', category: 'Accessories', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 140.00, selling_price: 399.00, description: 'Compact RFID-blocking cardholder in vegan leather with pull-tab access.' },

  // Electronics (5 products)
  { name: 'Wireless Optical Mouse', sku: 'WOM-6201', barcode: '8901234602010', category: 'Electronics', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 380.00, selling_price: 999.00, description: '2.4GHz wireless mouse with 1600 DPI optical sensor and USB receiver.' },
  { name: '7-in-1 USB-C Hub', sku: 'UCH-6215', barcode: '8901234602150', category: 'Electronics', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 620.00, selling_price: 1699.00, description: 'USB-C multiport adapter: 4K HDMI, 2x USB-A, SD/MicroSD, 100W PD pass-through.' },
  { name: 'Compact Bluetooth Keyboard', sku: 'CBK-6229', barcode: '8901234602290', category: 'Electronics', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 780.00, selling_price: 2199.00, description: 'Slim scissor-switch Bluetooth keyboard, pairs up to 3 devices simultaneously.' },
  { name: 'Laptop Stand — Adjustable Aluminium', sku: 'LSA-6243', barcode: '8901234602430', category: 'Electronics', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 440.00, selling_price: 1299.00, description: 'Foldable aluminium laptop stand with 6 adjustable height levels, fits 10–17 inch.' },
  { name: 'USB-C Charging Cable 1.5m (Pack of 2)', sku: 'UCC-6257', barcode: '8901234602570', category: 'Electronics', unit_id: UNIT_SET, unit_code: 'SET', cost_price: 120.00, selling_price: 349.00, description: '100W braided nylon USB-C to USB-C cable, pack of 2, 1.5m length.' },

  // Home & Office (6 products)
  { name: 'Bamboo Desk Organiser', sku: 'BDO-7301', barcode: '8901234703010', category: 'Home & Office', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 280.00, selling_price: 799.00, description: 'Multi-compartment bamboo desk organiser with pen holder and card slots.' },
  { name: 'A5 Hardbound Notebook (Pack of 2)', sku: 'AHN-7315', barcode: '8901234703150', category: 'Home & Office', unit_id: UNIT_SET, unit_code: 'SET', cost_price: 95.00, selling_price: 299.00, description: 'Dot-grid A5 hardbound notebooks with 192 pages each, pack of 2.' },
  { name: 'LED Desk Lamp — Touch Dimmer', sku: 'LDL-7329', barcode: '8901234703290', category: 'Home & Office', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 480.00, selling_price: 1399.00, description: '10W LED desk lamp with touch dimmer, 3 colour temperatures, USB charging port.' },
  { name: 'Mesh Back Ergonomic Chair Cushion', sku: 'MEC-7343', barcode: '8901234703430', category: 'Home & Office', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 320.00, selling_price: 899.00, description: 'Breathable mesh lumbar support cushion for office chairs, non-slip base.' },
  { name: 'Whiteboard Markers Set (12pc)', sku: 'WMS-7357', barcode: '8901234703570', category: 'Home & Office', unit_id: UNIT_SET, unit_code: 'SET', cost_price: 85.00, selling_price: 249.00, description: 'Chisel-tip dry-erase whiteboard markers in 6 assorted colours, set of 12.' },
  { name: 'Cable Management Box', sku: 'CMB-7371', barcode: '8901234703710', category: 'Home & Office', unit_id: UNIT_BOX, unit_code: 'BOX', cost_price: 220.00, selling_price: 649.00, description: 'Ventilated ABS cable management box with 3-outlet power strip holder, lid included.' },
];

export interface ResetResult {
  success: boolean;
  organizationId?: string;
  organizationSlug: string;
  restoredCategories: number;
  prunedCategories: number;
  restoredProducts: number;
  prunedProducts: number;
  durationMs: number;
  error?: string;
}

/**
 * Resets the demo workspace to canonical baseline state.
 * Requires an admin/service-role Supabase client.
 */
export async function resetDemoWorkspace(
  supabaseAdmin: SupabaseClient
): Promise<ResetResult> {
  const startTime = Date.now();

  try {
    // 1. Explicitly verify the dedicated demo organization exists
    const { data: demoOrg, error: orgErr } = await supabaseAdmin
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', DEMO_ORG_SLUG)
      .maybeSingle();

    if (orgErr || !demoOrg) {
      const errMsg = `Demo organization '${DEMO_ORG_SLUG}' not found or unreachable: ${orgErr?.message ?? 'missing'}`;
      console.error(`[DEMO_RESET_ERROR] ${errMsg}`);
      return {
        success: false,
        organizationSlug: DEMO_ORG_SLUG,
        restoredCategories: 0,
        prunedCategories: 0,
        restoredProducts: 0,
        prunedProducts: 0,
        durationMs: Date.now() - startTime,
        error: errMsg,
      };
    }

    const demoOrgId = demoOrg.id;

    // 2. Fetch existing categories in the demo org
    const { data: existingCategories, error: catFetchErr } = await supabaseAdmin
      .from('categories')
      .select('id, name')
      .eq('organization_id', demoOrgId);

    if (catFetchErr) {
      throw new Error(`Failed to fetch demo categories: ${catFetchErr.message}`);
    }

    const categoryIdMap: Record<string, string> = {};
    const canonicalCatNames = new Set(CANONICAL_CATEGORIES.map((c) => c.name));
    let prunedCategories = 0;
    let restoredCategories = 0;

    // Prune non-canonical categories
    for (const existingCat of existingCategories ?? []) {
      if (!canonicalCatNames.has(existingCat.name)) {
        await supabaseAdmin
          .from('categories')
          .delete()
          .eq('id', existingCat.id)
          .eq('organization_id', demoOrgId);
        prunedCategories++;
      } else {
        categoryIdMap[existingCat.name] = existingCat.id;
      }
    }

    // Ensure / Upsert canonical categories
    for (const cat of CANONICAL_CATEGORIES) {
      const existingId = categoryIdMap[cat.name];
      if (existingId) {
        // Update to canonical properties
        await supabaseAdmin
          .from('categories')
          .update({
            description: cat.description,
            hsn_code: cat.hsn_code,
            gst_rate_percent: cat.gst_rate_percent,
            status: 'active',
          })
          .eq('id', existingId)
          .eq('organization_id', demoOrgId);
        restoredCategories++;
      } else {
        // Insert missing canonical category
        const { data: newCat, error: insertCatErr } = await supabaseAdmin
          .from('categories')
          .insert({
            organization_id: demoOrgId,
            name: cat.name,
            description: cat.description,
            hsn_code: cat.hsn_code,
            gst_rate_percent: cat.gst_rate_percent,
            status: 'active',
          })
          .select('id')
          .single();

        if (insertCatErr || !newCat) {
          throw new Error(`Failed to restore category "${cat.name}": ${insertCatErr?.message}`);
        }
        categoryIdMap[cat.name] = newCat.id;
        restoredCategories++;
      }
    }

    // 3. Fetch existing products in the demo org
    const { data: existingProducts, error: prodFetchErr } = await supabaseAdmin
      .from('products')
      .select('id, sku')
      .eq('organization_id', demoOrgId);

    if (prodFetchErr) {
      throw new Error(`Failed to fetch demo products: ${prodFetchErr.message}`);
    }

    const canonicalSkus = new Set(CANONICAL_PRODUCTS.map((p) => p.sku));
    const existingProductSkuMap: Record<string, string> = {};
    let prunedProducts = 0;
    let restoredProducts = 0;

    // Prune non-canonical products
    for (const existingProd of existingProducts ?? []) {
      if (!canonicalSkus.has(existingProd.sku)) {
        await supabaseAdmin
          .from('products')
          .delete()
          .eq('id', existingProd.id)
          .eq('organization_id', demoOrgId);
        prunedProducts++;
      } else {
        existingProductSkuMap[existingProd.sku] = existingProd.id;
      }
    }

    // Ensure / Upsert canonical products
    for (const prod of CANONICAL_PRODUCTS) {
      const catId = categoryIdMap[prod.category];
      if (!catId) {
        throw new Error(`Missing category ID mapping for "${prod.category}"`);
      }

      const existingProdId = existingProductSkuMap[prod.sku];
      if (existingProdId) {
        // Reset properties to canonical baseline
        await supabaseAdmin
          .from('products')
          .update({
            name: prod.name,
            barcode: prod.barcode,
            description: prod.description,
            category_id: catId,
            unit_id: prod.unit_id,
            unit_code: prod.unit_code,
            cost_price: prod.cost_price,
            selling_price: prod.selling_price,
            status: 'active',
          })
          .eq('id', existingProdId)
          .eq('organization_id', demoOrgId);
        restoredProducts++;
      } else {
        // Insert missing canonical product
        const { error: insertProdErr } = await supabaseAdmin
          .from('products')
          .insert({
            organization_id: demoOrgId,
            name: prod.name,
            sku: prod.sku,
            barcode: prod.barcode,
            description: prod.description,
            category_id: catId,
            unit_id: prod.unit_id,
            unit_code: prod.unit_code,
            cost_price: prod.cost_price,
            selling_price: prod.selling_price,
            status: 'active',
          });

        if (insertProdErr) {
          throw new Error(`Failed to restore product "${prod.sku}": ${insertProdErr.message}`);
        }
        restoredProducts++;
      }
    }

    const durationMs = Date.now() - startTime;
    console.log(
      `[DEMO_RESET_SUCCESS] Demo Workspace (${demoOrgId}) reset in ${durationMs}ms: ` +
        `Categories(restored=${restoredCategories}, pruned=${prunedCategories}), ` +
        `Products(restored=${restoredProducts}, pruned=${prunedProducts})`
    );

    return {
      success: true,
      organizationId: demoOrgId,
      organizationSlug: DEMO_ORG_SLUG,
      restoredCategories,
      prunedCategories,
      restoredProducts,
      prunedProducts,
      durationMs,
    };
  } catch (err: unknown) {
    const durationMs = Date.now() - startTime;
    const errorMsg = err instanceof Error ? err.message : 'Unknown reset failure';
    console.error(`[DEMO_RESET_ERROR] Reset failed after ${durationMs}ms:`, errorMsg);
    return {
      success: false,
      organizationSlug: DEMO_ORG_SLUG,
      restoredCategories: 0,
      prunedCategories: 0,
      restoredProducts: 0,
      prunedProducts: 0,
      durationMs,
      error: errorMsg,
    };
  }
}
