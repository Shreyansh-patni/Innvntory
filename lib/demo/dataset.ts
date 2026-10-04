/**
 * lib/demo/dataset.ts
 *
 * INNVNTORY — COMPLETE CANONICAL BUSINESS DEMO DATASET
 * Sahaya Technologies Pvt. Ltd.
 *
 * SPECIFICATION:
 *   - 3 Warehouses (Mumbai Central Hub, Pune Fulfillment, Bangalore Regional)
 *   - 8 Product Categories (GST rates: 12% & 18%)
 *   - 50 Products with realistic SKUs, barcodes, cost and selling prices (INR)
 *   - 20 Customers across Indian commercial hubs
 *   - 10 Suppliers with realistic payment terms and GSTINs
 *   - 50 Sales Orders with line items, GST invoices, payments, and returns
 *   - 25 Purchase Orders with line items, receipts, payments, and supplier returns
 *   - Multi-warehouse stock balances, transfers, adjustments, and movement ledger
 */

export const UNIT_PCS = '00000000-0000-0000-0000-000000000101';
export const UNIT_BOX = '00000000-0000-0000-0000-000000000102';
export const UNIT_SET = '00000000-0000-0000-0000-000000000108';

export interface DemoWarehouse {
  code: string;
  name: string;
  city: string;
  state: string;
  is_default: boolean;
}

export interface DemoCategory {
  name: string;
  description: string;
  hsn_code: string;
  gst_rate_percent: number;
}

export interface DemoProduct {
  name: string;
  sku: string;
  barcode: string;
  category: string;
  unit_id: string;
  unit_code: string;
  cost_price: number;
  selling_price: number;
  description: string;
  stock_mumbai: number;
  stock_pune: number;
  stock_bangalore: number;
  reorder_level: number;
}

export interface DemoCustomer {
  name: string;
  company_name: string;
  email: string;
  phone: string;
  gstin: string;
  city: string;
  state: string;
  credit_limit: number;
}

export interface DemoSupplier {
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  gstin: string;
  city: string;
  state: string;
  payment_terms: string;
}

// ---------------------------------------------------------------------------
// 1. WAREHOUSES
// ---------------------------------------------------------------------------
export const DEMO_WAREHOUSES: DemoWarehouse[] = [
  { code: 'WH-MUM', name: 'Central Logistics Hub', city: 'Mumbai', state: 'Maharashtra', is_default: true },
  { code: 'WH-PUN', name: 'Pune Fulfillment Center', city: 'Pune', state: 'Maharashtra', is_default: false },
  { code: 'WH-BLR', name: 'Bangalore Regional Depot', city: 'Bangalore', state: 'Karnataka', is_default: false },
];

// ---------------------------------------------------------------------------
// 2. CATEGORIES (8 Categories)
// ---------------------------------------------------------------------------
export const DEMO_CATEGORIES: DemoCategory[] = [
  { name: 'Apparel', description: 'Clothing and garments including shirts, trousers, jeans, and hoodies.', hsn_code: '6109', gst_rate_percent: 12.00 },
  { name: 'Footwear', description: 'Shoes, sandals, boots, and sneakers for all occasions.', hsn_code: '6403', gst_rate_percent: 18.00 },
  { name: 'Fashion Accessories', description: 'Belts, bags, wallets, caps, and fashion accessories.', hsn_code: '4205', gst_rate_percent: 18.00 },
  { name: 'Consumer Electronics', description: 'Computer peripherals, wireless devices, and office gadgets.', hsn_code: '8471', gst_rate_percent: 18.00 },
  { name: 'Office Furniture & Decor', description: 'Ergonomic cushions, desk risers, and workplace accessories.', hsn_code: '9403', gst_rate_percent: 18.00 },
  { name: 'Stationery & Paper', description: 'Hardbound notebooks, executive planners, and paper supplies.', hsn_code: '4820', gst_rate_percent: 12.00 },
  { name: 'Storage & Organisation', description: 'Cable boxes, storage crates, and document organisers.', hsn_code: '3924', gst_rate_percent: 18.00 },
  { name: 'Lighting & Electricals', description: 'LED desk lamps, monitor light bars, and power strips.', hsn_code: '9405', gst_rate_percent: 18.00 },
];

// ---------------------------------------------------------------------------
// 3. PRODUCTS (50 Products)
// ---------------------------------------------------------------------------
export const DEMO_PRODUCTS: DemoProduct[] = [
  // Apparel (12 products)
  { name: 'Classic Cotton T-Shirt', sku: 'CCT-1001', barcode: '8901234100001', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 180, selling_price: 499, description: 'Premium 180GSM cotton crew-neck T-shirt in solid colours.', stock_mumbai: 120, stock_pune: 60, stock_bangalore: 45, reorder_level: 30 },
  { name: 'Oxford Casual Button-Down Shirt', sku: 'OCS-3021', barcode: '8901234300021', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 340, selling_price: 999, description: 'Lightweight oxford weave casual shirt for smart styling.', stock_mumbai: 85, stock_pune: 40, stock_bangalore: 35, reorder_level: 25 },
  { name: 'Slim Fit Denim Jeans', sku: 'SFD-2048', barcode: '8901234200048', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 520, selling_price: 1499, description: 'Stretch denim slim-fit jeans with 5-pocket design.', stock_mumbai: 65, stock_pune: 30, stock_bangalore: 25, reorder_level: 20 },
  { name: 'Regular Fit Chinos', sku: 'RFC-2051', barcode: '8901234200051', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 390, selling_price: 1199, description: 'Classic cotton-blend wrinkle-resistant chinos.', stock_mumbai: 50, stock_pune: 25, stock_bangalore: 20, reorder_level: 20 },
  { name: 'Lightweight Pullover Hoodie', sku: 'LPH-1085', barcode: '8901234100085', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 420, selling_price: 1299, description: 'Brushed fleece pullover hoodie with kangaroo pocket.', stock_mumbai: 45, stock_pune: 20, stock_bangalore: 15, reorder_level: 15 },
  { name: 'Formal Trouser — Charcoal', sku: 'FTC-2062', barcode: '8901234200062', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 580, selling_price: 1699, description: 'Poly-viscose formal trousers with regular fit.', stock_mumbai: 40, stock_pune: 18, stock_bangalore: 12, reorder_level: 15 },
  { name: 'Linen Casual Shirt', sku: 'LCS-3035', barcode: '8901234300035', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 460, selling_price: 1399, description: 'Pure breathable linen shirt with spread collar.', stock_mumbai: 35, stock_pune: 15, stock_bangalore: 10, reorder_level: 15 },
  { name: 'Relaxed Fit Jogger', sku: 'RFJ-1092', barcode: '8901234100092', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 280, selling_price: 799, description: 'Cotton jogger pants with elastic waistband.', stock_mumbai: 70, stock_pune: 35, stock_bangalore: 30, reorder_level: 25 },
  { name: 'Polo Neck T-Shirt', sku: 'PNT-1007', barcode: '8901234100007', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 220, selling_price: 649, description: 'Pique cotton polo with 2-button placket.', stock_mumbai: 95, stock_pune: 45, stock_bangalore: 40, reorder_level: 30 },
  { name: 'Quilted Winter Jacket', sku: 'QWJ-4011', barcode: '8901234400011', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 890, selling_price: 2499, description: 'Lightweight quilted jacket with mock collar.', stock_mumbai: 20, stock_pune: 8, stock_bangalore: 5, reorder_level: 10 },
  { name: 'Cotton Crew Sweatshirt', sku: 'CCS-1099', barcode: '8901234100099', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 360, selling_price: 1099, description: 'French terry crewneck sweatshirt in heather grey.', stock_mumbai: 55, stock_pune: 25, stock_bangalore: 20, reorder_level: 20 },
  { name: 'Linen Blend Short Kurta', sku: 'LSK-3042', barcode: '8901234300042', category: 'Apparel', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 310, selling_price: 899, description: 'Modern mandarin collar short kurta for festive casuals.', stock_mumbai: 45, stock_pune: 22, stock_bangalore: 18, reorder_level: 15 },

  // Footwear (8 products)
  { name: 'Canvas Low-Top Sneakers', sku: 'CVS-5018', barcode: '8901234500018', category: 'Footwear', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 350, selling_price: 999, description: 'Classic canvas vulcanised sneakers with rubber sole.', stock_mumbai: 60, stock_pune: 30, stock_bangalore: 25, reorder_level: 20 },
  { name: 'Leather Oxford Formal Shoes', sku: 'LOF-5032', barcode: '8901234500032', category: 'Footwear', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 780, selling_price: 2299, description: 'Genuine leather Oxford shoes with Goodyear welt.', stock_mumbai: 25, stock_pune: 12, stock_bangalore: 10, reorder_level: 10 },
  { name: 'Lightweight Running Shoes', sku: 'LRS-5047', barcode: '8901234500047', category: 'Footwear', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 620, selling_price: 1799, description: 'Mesh upper running shoes with cushioned midsole.', stock_mumbai: 40, stock_pune: 20, stock_bangalore: 15, reorder_level: 15 },
  { name: 'Casual Slip-On Loafers', sku: 'CSL-5061', barcode: '8901234500061', category: 'Footwear', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 440, selling_price: 1299, description: 'Suede finish slip-on loafers with elastic gussets.', stock_mumbai: 35, stock_pune: 15, stock_bangalore: 12, reorder_level: 12 },
  { name: 'Ankle Length Sports Socks (Pack of 3)', sku: 'ASS-5073', barcode: '8901234500073', category: 'Footwear', unit_id: UNIT_SET, unit_code: 'SET', cost_price: 75, selling_price: 199, description: 'Moisture wicking cotton blend ankle socks 3-pack.', stock_mumbai: 150, stock_pune: 80, stock_bangalore: 60, reorder_level: 40 },
  { name: 'Leather Chelsea Boots', sku: 'LCB-5085', barcode: '8901234500085', category: 'Footwear', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 950, selling_price: 2799, description: 'Handcrafted leather Chelsea boots with pull tab.', stock_mumbai: 18, stock_pune: 8, stock_bangalore: 6, reorder_level: 8 },
  { name: 'Comfort Strap Leather Sandals', sku: 'CSL-5092', barcode: '8901234500092', category: 'Footwear', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 290, selling_price: 849, description: 'Ergonomic dual-strap leather sandals with EVA sole.', stock_mumbai: 50, stock_pune: 25, stock_bangalore: 20, reorder_level: 15 },
  { name: 'Everyday Cushioned Sliders', sku: 'ECS-5099', barcode: '8901234500099', category: 'Footwear', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 140, selling_price: 399, description: 'Waterproof moulded EVA sliders for indoor/outdoor wear.', stock_mumbai: 80, stock_pune: 40, stock_bangalore: 35, reorder_level: 25 },

  // Fashion Accessories (8 products)
  { name: 'Leather Reversible Casual Belt', sku: 'LCB-4102', barcode: '8901234401020', category: 'Fashion Accessories', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 290, selling_price: 799, description: 'Genuine leather reversible belt black/tan.', stock_mumbai: 75, stock_pune: 35, stock_bangalore: 30, reorder_level: 20 },
  { name: 'Canvas Laptop Backpack 30L', sku: 'CLB-4115', barcode: '8901234401150', category: 'Fashion Accessories', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 680, selling_price: 1999, description: 'Water-resistant canvas backpack with 15-inch laptop pocket.', stock_mumbai: 30, stock_pune: 15, stock_bangalore: 12, reorder_level: 10 },
  { name: 'Classic Bi-fold Wallet', sku: 'CBW-4128', barcode: '8901234401280', category: 'Fashion Accessories', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 180, selling_price: 499, description: 'Genuine leather slim bi-fold wallet with 6 card slots.', stock_mumbai: 90, stock_pune: 45, stock_bangalore: 40, reorder_level: 25 },
  { name: 'Structured Sports Cap', sku: 'SSC-4141', barcode: '8901234401410', category: 'Fashion Accessories', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 120, selling_price: 349, description: 'Six-panel structured cap with adjustable strap.', stock_mumbai: 65, stock_pune: 30, stock_bangalore: 25, reorder_level: 20 },
  { name: 'Sunglasses — Aviator Frame', sku: 'SAF-4154', barcode: '8901234401540', category: 'Fashion Accessories', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 320, selling_price: 899, description: 'UV400 metal frame polarised aviator sunglasses.', stock_mumbai: 45, stock_pune: 20, stock_bangalore: 18, reorder_level: 15 },
  { name: 'Cotton Canvas Tote Bag', sku: 'CCT-4167', barcode: '8901234401670', category: 'Fashion Accessories', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 90, selling_price: 249, description: 'Natural cotton canvas heavy duty shopping tote bag.', stock_mumbai: 110, stock_pune: 50, stock_bangalore: 45, reorder_level: 30 },
  { name: 'RFID Blocking Slim Cardholder', sku: 'RSC-4180', barcode: '8901234401800', category: 'Fashion Accessories', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 140, selling_price: 399, description: 'Vegan leather RFID blocking cardholder with pull tab.', stock_mumbai: 85, stock_pune: 40, stock_bangalore: 35, reorder_level: 25 },
  { name: 'Weekend Travel Duffle Bag 40L', sku: 'WTD-4195', barcode: '8901234401950', category: 'Fashion Accessories', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 720, selling_price: 2199, description: 'Heavy canvas weekender duffle with shoe compartment.', stock_mumbai: 22, stock_pune: 10, stock_bangalore: 8, reorder_level: 8 },

  // Consumer Electronics (8 products)
  { name: 'Wireless Optical Mouse', sku: 'WOM-6201', barcode: '8901234602010', category: 'Consumer Electronics', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 380, selling_price: 999, description: '2.4GHz wireless optical mouse 1600 DPI.', stock_mumbai: 70, stock_pune: 35, stock_bangalore: 30, reorder_level: 20 },
  { name: '7-in-1 USB-C Multiport Hub', sku: 'UCH-6215', barcode: '8901234602150', category: 'Consumer Electronics', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 620, selling_price: 1699, description: '4K HDMI, 2x USB 3.0, SD card reader, 100W PD.', stock_mumbai: 40, stock_pune: 20, stock_bangalore: 15, reorder_level: 15 },
  { name: 'Compact Bluetooth Keyboard', sku: 'CBK-6229', barcode: '8901234602290', category: 'Consumer Electronics', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 780, selling_price: 2199, description: 'Multi-device scissor-switch Bluetooth keyboard.', stock_mumbai: 30, stock_pune: 15, stock_bangalore: 12, reorder_level: 10 },
  { name: 'Laptop Stand — Adjustable Aluminium', sku: 'LSA-6243', barcode: '8901234602430', category: 'Consumer Electronics', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 440, selling_price: 1299, description: 'Foldable ergonomic laptop stand with 6 elevation angles.', stock_mumbai: 50, stock_pune: 25, stock_bangalore: 20, reorder_level: 15 },
  { name: 'USB-C Charging Cable 1.5m (Pack of 2)', sku: 'UCC-6257', barcode: '8901234602570', category: 'Consumer Electronics', unit_id: UNIT_SET, unit_code: 'SET', cost_price: 120, selling_price: 349, description: '100W braided nylon fast charging USB-C cable 2-pack.', stock_mumbai: 120, stock_pune: 60, stock_bangalore: 50, reorder_level: 30 },
  { name: '15W Fast Wireless Charging Pad', sku: 'WCP-6265', barcode: '8901234602650', category: 'Consumer Electronics', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 280, selling_price: 799, description: 'Qi-certified ultra-slim fast wireless charger with LED ring.', stock_mumbai: 45, stock_pune: 22, stock_bangalore: 18, reorder_level: 15 },
  { name: 'True Wireless Earbuds with ANC', sku: 'TWE-6278', barcode: '8901234602780', category: 'Consumer Electronics', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 1100, selling_price: 2999, description: 'Bluetooth 5.3 earbuds with 30dB active noise cancellation.', stock_mumbai: 28, stock_pune: 12, stock_bangalore: 10, reorder_level: 10 },
  { name: '1080p Full HD USB Webcam', sku: 'FHW-6291', barcode: '8901234602910', category: 'Consumer Electronics', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 650, selling_price: 1799, description: 'Plug-and-play webcam with dual noise-reduction microphones.', stock_mumbai: 35, stock_pune: 15, stock_bangalore: 12, reorder_level: 12 },

  // Office Furniture & Decor (5 products)
  { name: 'Bamboo Multi-Slot Desk Organiser', sku: 'BDO-7301', barcode: '8901234703010', category: 'Office Furniture & Decor', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 280, selling_price: 799, description: 'Eco-friendly natural bamboo desk organiser.', stock_mumbai: 50, stock_pune: 25, stock_bangalore: 20, reorder_level: 15 },
  { name: 'Mesh Back Ergonomic Chair Cushion', sku: 'MEC-7343', barcode: '8901234703430', category: 'Office Furniture & Decor', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 320, selling_price: 899, description: 'Breathable lumbar support cushion for office chairs.', stock_mumbai: 40, stock_pune: 20, stock_bangalore: 15, reorder_level: 15 },
  { name: 'Aluminium Dual Monitor Riser', sku: 'DMR-7355', barcode: '8901234703550', category: 'Office Furniture & Decor', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 850, selling_price: 2499, description: 'Heavy-duty monitor stand riser with keyboard storage.', stock_mumbai: 18, stock_pune: 8, stock_bangalore: 6, reorder_level: 8 },
  { name: 'Under-Desk Ergonomic Footrest', sku: 'UDF-7368', barcode: '8901234703680', category: 'Office Furniture & Decor', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 420, selling_price: 1199, description: 'Adjustable angle footrest with textured massage rollers.', stock_mumbai: 25, stock_pune: 12, stock_bangalore: 10, reorder_level: 10 },
  { name: 'Magnetic Dry-Erase Whiteboard 3x2 ft', sku: 'MEW-7382', barcode: '8901234703820', category: 'Office Furniture & Decor', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 550, selling_price: 1599, description: 'Scratch-resistant aluminium frame magnetic whiteboard.', stock_mumbai: 30, stock_pune: 15, stock_bangalore: 10, reorder_level: 10 },

  // Stationery & Paper (3 products)
  { name: 'A5 Hardbound Notebook (Pack of 2)', sku: 'AHN-7315', barcode: '8901234703150', category: 'Stationery & Paper', unit_id: UNIT_SET, unit_code: 'SET', cost_price: 95, selling_price: 299, description: '192-page dot grid notebooks with bookmark ribbon.', stock_mumbai: 140, stock_pune: 70, stock_bangalore: 55, reorder_level: 35 },
  { name: 'Executive Daily Planner 2026', sku: 'EDP-7325', barcode: '8901234703250', category: 'Stationery & Paper', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 180, selling_price: 549, description: 'Faux leather dated executive daily planner with pen holder.', stock_mumbai: 65, stock_pune: 30, stock_bangalore: 25, reorder_level: 20 },
  { name: 'Neon Self-Adhesive Sticky Notes (6-Pack)', sku: 'SSN-7338', barcode: '8901234703380', category: 'Stationery & Paper', unit_id: UNIT_SET, unit_code: 'SET', cost_price: 60, selling_price: 179, description: '100 sheets per pad 3x3 inch assorted neon colours.', stock_mumbai: 200, stock_pune: 100, stock_bangalore: 80, reorder_level: 50 },

  // Storage & Organisation (3 products)
  { name: 'Cable Management Box with Lid', sku: 'CMB-7371', barcode: '8901234703710', category: 'Storage & Organisation', unit_id: UNIT_BOX, unit_code: 'BOX', cost_price: 220, selling_price: 649, description: 'Flame retardant ABS cable organiser with surge protector slot.', stock_mumbai: 60, stock_pune: 30, stock_bangalore: 25, reorder_level: 20 },
  { name: 'Stackable Foldable Storage Crates (Pack of 2)', sku: 'SFC-7388', barcode: '8901234703880', category: 'Storage & Organisation', unit_id: UNIT_SET, unit_code: 'SET', cost_price: 340, selling_price: 999, description: 'Heavy duty collapsible plastic storage crates 32L.', stock_mumbai: 45, stock_pune: 20, stock_bangalore: 18, reorder_level: 15 },
  { name: 'A4 Document Expanding File Folder', sku: 'EFF-7395', barcode: '8901234703950', category: 'Storage & Organisation', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 110, selling_price: 329, description: '12-pocket expanding accordion file organiser with index tabs.', stock_mumbai: 80, stock_pune: 40, stock_bangalore: 35, reorder_level: 25 },

  // Lighting & Electricals (3 products)
  { name: 'LED Desk Lamp with Touch Dimmer', sku: 'LDL-7329', barcode: '8901234703290', category: 'Lighting & Electricals', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 480, selling_price: 1399, description: '10W eye-care LED lamp with 3 colour modes and USB output.', stock_mumbai: 40, stock_pune: 20, stock_bangalore: 15, reorder_level: 15 },
  { name: 'Computer Monitor Light Bar', sku: 'MLB-7348', barcode: '8901234703480', category: 'Lighting & Electricals', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 620, selling_price: 1899, description: 'Screenbar e-reading LED lamp with auto-dimming sensor.', stock_mumbai: 25, stock_pune: 12, stock_bangalore: 10, reorder_level: 10 },
  { name: 'Smart Power Strip with 4 Outlets & 4 USB', sku: 'SPS-7362', barcode: '8901234703620', category: 'Lighting & Electricals', unit_id: UNIT_PCS, unit_code: 'PCS', cost_price: 450, selling_price: 1299, description: 'Surge protected extension board with master switch and 20W PD.', stock_mumbai: 55, stock_pune: 25, stock_bangalore: 20, reorder_level: 18 },
];

// ---------------------------------------------------------------------------
// 4. CUSTOMERS (20 Customers)
// ---------------------------------------------------------------------------
export const DEMO_CUSTOMERS: DemoCustomer[] = [
  { name: 'Nexus Retail Stores Pvt Ltd', company_name: 'Nexus Retail Network', email: 'procurement@nexusretail.co.in', phone: '+91 98201 44521', gstin: '27AABCN8821K1ZM', city: 'Mumbai', state: 'Maharashtra', credit_limit: 500000 },
  { name: 'Apex Lifestyle Apparels', company_name: 'Apex Group', email: 'orders@apexlifestyle.in', phone: '+91 98112 55342', gstin: '07AAACA4491Q1ZN', city: 'New Delhi', state: 'Delhi', credit_limit: 400000 },
  { name: 'Urban Threads Boutiques', company_name: 'Urban Threads Retail', email: 'buyer@urbanthreads.com', phone: '+91 98450 11983', gstin: '29AABCU3312L1ZO', city: 'Bangalore', state: 'Karnataka', credit_limit: 300000 },
  { name: 'Horizon Departmental Stores', company_name: 'Horizon Retailers', email: 'purchase@horizonstores.in', phone: '+91 98310 99874', gstin: '19AAACH6654M1ZP', city: 'Kolkata', state: 'West Bengal', credit_limit: 450000 },
  { name: 'Metro Mart Superstores', company_name: 'Metro Wholesale Ltd', email: 'vendor@metromart.co.in', phone: '+91 98401 77651', gstin: '33AABCM9941P1ZQ', city: 'Chennai', state: 'Tamil Nadu', credit_limit: 600000 },
  { name: 'Silverline Office Solutions', company_name: 'Silverline Supplies', email: 'accounts@silverlineoffice.in', phone: '+91 97241 88321', gstin: '24AABCS5521R1ZR', city: 'Ahmedabad', state: 'Gujarat', credit_limit: 250000 },
  { name: 'Deccan Commercial Traders', company_name: 'Deccan Corp', email: 'supply@deccantraders.com', phone: '+91 98490 66210', gstin: '36AABCD7714S1ZS', city: 'Hyderabad', state: 'Telangana', credit_limit: 350000 },
  { name: 'Pinnacle Gadgets & Accessories', company_name: 'Pinnacle E-Retail', email: 'ops@pinnaclegadgets.in', phone: '+91 98290 33451', gstin: '08AABCP2219T1ZT', city: 'Jaipur', state: 'Rajasthan', credit_limit: 200000 },
  { name: 'Prime Value Mart', company_name: 'Prime Retail Holdings', email: 'orders@primevaluemart.com', phone: '+91 94250 88712', gstin: '23AABCP1145U1ZU', city: 'Indore', state: 'Madhya Pradesh', credit_limit: 300000 },
  { name: 'Zenith Tech & Lifestyle Store', company_name: 'Zenith Ventures', email: 'procure@zenithlifestyle.in', phone: '+91 98220 55190', gstin: '27AABCZ3398V1ZV', city: 'Pune', state: 'Maharashtra', credit_limit: 400000 },
  { name: 'Vibrant Gujarat Emporium', company_name: 'Vibrant Retail Ltd', email: 'contact@vibrantgujarat.co.in', phone: '+91 98791 44102', gstin: '24AABCV8812W1ZW', city: 'Surat', state: 'Gujarat', credit_limit: 350000 },
  { name: 'Regal Clothiers & Outfitters', company_name: 'Regal Fashions', email: 'orders@regalclothiers.in', phone: '+91 98140 22391', gstin: '03AABCR6610X1ZX', city: 'Ludhiana', state: 'Punjab', credit_limit: 250000 },
  { name: 'Coastline Mercantile Co.', company_name: 'Coastline Logistics', email: 'trade@coastlinemerc.com', phone: '+91 98470 99182', gstin: '32AABCC4490Y1ZY', city: 'Kochi', state: 'Kerala', credit_limit: 300000 },
  { name: 'Capital Office Depot', company_name: 'Capital Supplies Pvt Ltd', email: 'accounts@capitaldepot.in', phone: '+91 98100 77312', gstin: '07AABCC1120Z1ZZ', city: 'New Delhi', state: 'Delhi', credit_limit: 500000 },
  { name: 'Greenfield Retail & Wholesale', company_name: 'Greenfield Mart', email: 'buyer@greenfieldmart.in', phone: '+91 94370 88219', gstin: '21AABCG7730A1ZA', city: 'Bhubaneswar', state: 'Odisha', credit_limit: 200000 },
  { name: 'Sapphire Commerce Hub', company_name: 'Sapphire Enterprise', email: 'ops@sapphirehub.com', phone: '+91 98901 33410', gstin: '27AABCS9912B1ZB', city: 'Nagpur', state: 'Maharashtra', credit_limit: 350000 },
  { name: 'Golden Triangle Traders', company_name: 'GT Trading Co', email: 'info@gttraders.co.in', phone: '+91 94140 55671', gstin: '08AABCG4412C1ZC', city: 'Udaipur', state: 'Rajasthan', credit_limit: 200000 },
  { name: 'Southern Star Departmental', company_name: 'Southern Star Retail', email: 'store@southernstar.in', phone: '+91 98840 11293', gstin: '33AABCS2219D1ZD', city: 'Coimbatore', state: 'Tamil Nadu', credit_limit: 300000 },
  { name: 'Malabar Consumer Stores', company_name: 'Malabar Retail Ltd', email: 'procure@malabarstores.com', phone: '+91 94470 88120', gstin: '32AABCM5510E1ZE', city: 'Calicut', state: 'Kerala', credit_limit: 250000 },
  { name: 'Shivalik General Mercantile', company_name: 'Shivalik Traders', email: 'orders@shivaliktrade.in', phone: '+91 98160 44321', gstin: '02AABCS8819F1ZF', city: 'Chandigarh', state: 'Chandigarh', credit_limit: 200000 },
];

// ---------------------------------------------------------------------------
// 5. SUPPLIERS (10 Suppliers)
// ---------------------------------------------------------------------------
export const DEMO_SUPPLIERS: DemoSupplier[] = [
  { name: 'Arvind Textile Mills Ltd', contact_person: 'Rajesh Shah', email: 'b2b@arvindtextiles.co.in', phone: '+91 79 2658 4400', gstin: '24AAACA1190K1ZP', city: 'Ahmedabad', state: 'Gujarat', payment_terms: 'Net 30 Days' },
  { name: 'Relaxo Footwear Components Pvt Ltd', contact_person: 'Amit Verma', email: 'institutional@relaxofoot.in', phone: '+91 11 4560 7700', gstin: '07AAACR4412M1ZQ', city: 'Bahadurgarh', state: 'Haryana', payment_terms: 'Net 45 Days' },
  { name: 'Zen Leather Goods Industries', contact_person: 'Khurram Siddiqui', email: 'export@zenleather.com', phone: '+91 512 239 8810', gstin: '09AAACZ7719P1ZR', city: 'Kanpur', state: 'Uttar Pradesh', payment_terms: 'Net 30 Days' },
  { name: 'SmartTech Peripherals India Ltd', contact_person: 'Nagaraj Swamy', email: 'enterprise@smarttechindia.in', phone: '+91 80 4120 9900', gstin: '29AAACS2290R1ZS', city: 'Bangalore', state: 'Karnataka', payment_terms: 'Net 15 Days' },
  { name: 'Nilkamal Storage & Organisers', contact_person: 'Sanjay Parekh', email: 'commercial@nilkamalstorage.com', phone: '+91 22 2857 6600', gstin: '27AAACN5519T1ZT', city: 'Mumbai', state: 'Maharashtra', payment_terms: 'Net 30 Days' },
  { name: 'ITC Paperboards & Specialty Papers', contact_person: 'Venkatesh Rao', email: 'orders@itcpaper.co.in', phone: '+91 40 2784 5500', gstin: '36AAACI8812V1ZU', city: 'Secunderabad', state: 'Telangana', payment_terms: 'Net 30 Days' },
  { name: 'Syska LED Solutions India', contact_person: 'Deepak Jha', email: 'b2b@syskaled.in', phone: '+91 20 6644 3300', gstin: '27AAACS9914W1ZV', city: 'Pune', state: 'Maharashtra', payment_terms: 'Net 30 Days' },
  { name: 'Supreme Polymers & Packaging', contact_person: 'Harish Mehta', email: 'sales@supremepack.co.in', phone: '+91 261 245 1190', gstin: '24AAACS3391X1ZW', city: 'Surat', state: 'Gujarat', payment_terms: 'Net 15 Days' },
  { name: 'Godrej Workspace Solutions', contact_person: 'Vikram Godrej', email: 'workspace@godrej.com', phone: '+91 22 6796 5500', gstin: '27AAACG1120Y1ZX', city: 'Mumbai', state: 'Maharashtra', payment_terms: 'Net 45 Days' },
  { name: 'Portronics Digital India Pvt Ltd', contact_person: 'Jaspreet Singh', email: 'institutional@portronics.in', phone: '+91 11 4100 8820', gstin: '07AAACP6619Z1ZY', city: 'New Delhi', state: 'Delhi', payment_terms: 'Net 30 Days' },
];
