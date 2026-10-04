#!/usr/bin/env node
/**
 * scripts/reset-demo-workspace.mjs
 *
 * INNVNTORY — MANUAL DEMO WORKSPACE RESET SCRIPT
 * Sahaya Technologies Pvt. Ltd.
 *
 * PURPOSE:
 *   Manually triggers the 2-hour demo reset logic from an administrative terminal
 *   for testing, verification, or ad-hoc baseline restoration.
 *
 * USAGE:
 *   npm run demo:reset
 *   -- or directly --
 *   node scripts/reset-demo-workspace.mjs
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// 1. Bootstrap environment from .env.local if present
function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx < 0) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // Rely on shell env
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || SUPABASE_URL === 'TBD') {
  console.error('[ABORT] NEXT_PUBLIC_SUPABASE_URL is not set.');
  process.exit(1);
}
if (!SERVICE_ROLE_KEY || SERVICE_ROLE_KEY === 'TBD') {
  console.error('[ABORT] SUPABASE_SERVICE_ROLE_KEY is not set. This script requires admin credentials.');
  process.exit(1);
}

const { createClient } = await import('@supabase/supabase-js');
const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log('[RESET] Initiating manual demo workspace reset...');

const DEMO_ORG_SLUG = 'innvntory-demo';

// System unit IDs
const UNIT_PCS = '00000000-0000-0000-0000-000000000101';
const UNIT_BOX = '00000000-0000-0000-0000-000000000102';
const UNIT_SET = '00000000-0000-0000-0000-000000000108';

const CANONICAL_CATEGORIES = [
  { name: 'Apparel', description: 'Clothing and garments including shirts, trousers, jeans, and hoodies.', hsn_code: '6109', gst_rate_percent: 12.00 },
  { name: 'Footwear', description: 'Shoes, sandals, boots, and sneakers for all occasions.', hsn_code: '6403', gst_rate_percent: 18.00 },
  { name: 'Accessories', description: 'Belts, bags, wallets, caps, and other fashion accessories.', hsn_code: '4205', gst_rate_percent: 18.00 },
  { name: 'Electronics', description: 'Computer peripherals, wireless devices, and office electronics.', hsn_code: '8471', gst_rate_percent: 18.00 },
  { name: 'Home & Office', description: 'Stationery, desk accessories, lamps, and home organisation products.', hsn_code: '3924', gst_rate_percent: 12.00 },
];

const CANONICAL_PRODUCTS = [
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

const { data: demoOrg, error: orgErr } = await adminClient
  .from('organizations')
  .select('id, name, slug')
  .eq('slug', DEMO_ORG_SLUG)
  .maybeSingle();

if (orgErr || !demoOrg) {
  console.error('[RESET ABORT] Demo organization not found:', orgErr?.message);
  process.exit(1);
}

const demoOrgId = demoOrg.id;
console.log(`  ✓ Verified demo organization: ${demoOrg.name} (${demoOrgId})`);

// 1. Categories
const { data: existingCategories } = await adminClient
  .from('categories')
  .select('id, name')
  .eq('organization_id', demoOrgId);

const categoryIdMap = {};
const canonicalCatNames = new Set(CANONICAL_CATEGORIES.map(c => c.name));
let prunedCats = 0;
let restoredCats = 0;

for (const existingCat of existingCategories || []) {
  if (!canonicalCatNames.has(existingCat.name)) {
    await adminClient.from('categories').delete().eq('id', existingCat.id).eq('organization_id', demoOrgId);
    prunedCats++;
  } else {
    categoryIdMap[existingCat.name] = existingCat.id;
  }
}

for (const cat of CANONICAL_CATEGORIES) {
  const existingId = categoryIdMap[cat.name];
  if (existingId) {
    await adminClient.from('categories').update({
      description: cat.description,
      hsn_code: cat.hsn_code,
      gst_rate_percent: cat.gst_rate_percent,
      status: 'active',
    }).eq('id', existingId).eq('organization_id', demoOrgId);
    restoredCats++;
  } else {
    const { data: newCat } = await adminClient.from('categories').insert({
      organization_id: demoOrgId,
      name: cat.name,
      description: cat.description,
      hsn_code: cat.hsn_code,
      gst_rate_percent: cat.gst_rate_percent,
      status: 'active',
    }).select('id').single();
    if (newCat) categoryIdMap[cat.name] = newCat.id;
    restoredCats++;
  }
}

// 2. Products
const { data: existingProducts } = await adminClient
  .from('products')
  .select('id, sku')
  .eq('organization_id', demoOrgId);

const canonicalSkus = new Set(CANONICAL_PRODUCTS.map(p => p.sku));
const existingProductSkuMap = {};
let prunedProds = 0;
let restoredProds = 0;

for (const existingProd of existingProducts || []) {
  if (!canonicalSkus.has(existingProd.sku)) {
    await adminClient.from('products').delete().eq('id', existingProd.id).eq('organization_id', demoOrgId);
    prunedProds++;
  } else {
    existingProductSkuMap[existingProd.sku] = existingProd.id;
  }
}

for (const prod of CANONICAL_PRODUCTS) {
  const catId = categoryIdMap[prod.category];
  const existingProdId = existingProductSkuMap[prod.sku];
  if (existingProdId) {
    await adminClient.from('products').update({
      name: prod.name,
      barcode: prod.barcode,
      description: prod.description,
      category_id: catId,
      unit_id: prod.unit_id,
      unit_code: prod.unit_code,
      cost_price: prod.cost_price,
      selling_price: prod.selling_price,
      status: 'active',
    }).eq('id', existingProdId).eq('organization_id', demoOrgId);
    restoredProds++;
  } else {
    await adminClient.from('products').insert({
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
    restoredProds++;
  }
}

console.log(`  ✓ Restored ${restoredCats} categories (${prunedCats} transient pruned)`);
console.log(`  ✓ Restored ${restoredProds} products (${prunedProds} transient pruned)`);
console.log('\n[RESET COMPLETE] Demo workspace is restored to canonical baseline.\n');
