/**
 * lib/demo/reset-engine.mjs
 *
 * INNVNTORY — CANONICAL DEMO WORKSPACE RESET ENGINE
 * Sahaya Technologies Pvt. Ltd.
 *
 * Single Source of Truth for the complete demo business dataset restoration.
 */

export const DEMO_ORG_SLUG = 'innvntory-demo';
export const DEMO_ORG_NAME = 'Innvntory Demo Workspace';

export const VIEWER_ROLE_ID = '00000000-0000-0000-0000-000000000007';

export const UNIT_PCS = '00000000-0000-0000-0000-000000000101';
export const UNIT_BOX = '00000000-0000-0000-0000-000000000102';
export const UNIT_SET = '00000000-0000-0000-0000-000000000108';

export const DEMO_WAREHOUSES = [
  { code: 'WH-MUM', name: 'Central Logistics Hub', city: 'Mumbai', state: 'Maharashtra', is_default: true },
  { code: 'WH-PUN', name: 'Pune Fulfillment Center', city: 'Pune', state: 'Maharashtra', is_default: false },
  { code: 'WH-BLR', name: 'Bangalore Regional Depot', city: 'Bangalore', state: 'Karnataka', is_default: false },
];

export const DEMO_CATEGORIES = [
  { name: 'Apparel', description: 'Clothing and garments including shirts, trousers, jeans, and hoodies.', hsn_code: '6109', gst_rate_percent: 12.00 },
  { name: 'Footwear', description: 'Shoes, sandals, boots, and sneakers for all occasions.', hsn_code: '6403', gst_rate_percent: 18.00 },
  { name: 'Fashion Accessories', description: 'Belts, bags, wallets, caps, and fashion accessories.', hsn_code: '4205', gst_rate_percent: 18.00 },
  { name: 'Consumer Electronics', description: 'Computer peripherals, wireless devices, and office gadgets.', hsn_code: '8471', gst_rate_percent: 18.00 },
  { name: 'Office Furniture & Decor', description: 'Ergonomic cushions, desk risers, and workplace accessories.', hsn_code: '9403', gst_rate_percent: 18.00 },
  { name: 'Stationery & Paper', description: 'Hardbound notebooks, executive planners, and paper supplies.', hsn_code: '4820', gst_rate_percent: 12.00 },
  { name: 'Storage & Organisation', description: 'Cable boxes, storage crates, and document organisers.', hsn_code: '3924', gst_rate_percent: 18.00 },
  { name: 'Lighting & Electricals', description: 'LED desk lamps, monitor light bars, and power strips.', hsn_code: '9405', gst_rate_percent: 18.00 },
];

export const DEMO_PRODUCTS = [
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

export const DEMO_CUSTOMERS = [
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

export const DEMO_SUPPLIERS = [
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

export async function resetDemoWorkspace(supabaseAdmin) {
  const startTime = Date.now();
  const counts = {
    warehouses: 0,
    categories: 0,
    products: 0,
    stockBalances: 0,
    customers: 0,
    suppliers: 0,
    purchaseOrders: 0,
    purchaseOrderItems: 0,
    purchaseReceipts: 0,
    purchasePayments: 0,
    purchaseReturns: 0,
    salesOrders: 0,
    salesOrderItems: 0,
    invoices: 0,
    salesPayments: 0,
    salesReturns: 0,
    inventoryTransfers: 0,
    inventoryAdjustments: 0,
    inventoryMovements: 0,
  };

  try {
    const { data: demoOrg, error: orgErr } = await supabaseAdmin
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', DEMO_ORG_SLUG)
      .maybeSingle();

    if (orgErr || !demoOrg) {
      throw new Error(`Demo organization '${DEMO_ORG_SLUG}' not found: ${orgErr?.message ?? 'missing'}`);
    }

    const orgId = demoOrg.id;

    // Prune existing records in reverse dependency order
    const tablesToClean = [
      'inventory_movements',
      'inventory_adjustments',
      'inventory_transfers',
      'sales_returns',
      'sales_payments',
      'invoices',
      'sales_order_items',
      'sales_orders',
      'purchase_returns',
      'purchase_payments',
      'purchase_receipts',
      'purchase_order_items',
      'purchase_orders',
      'stock_balances',
      'products',
      'categories',
      'suppliers',
      'customers',
      'warehouses',
    ];

    for (const table of tablesToClean) {
      await supabaseAdmin.from(table).delete().eq('organization_id', orgId);
    }

    // 1. Warehouses
    const { data: insertedWarehouses, error: whErr } = await supabaseAdmin
      .from('warehouses')
      .insert(DEMO_WAREHOUSES.map(w => ({ ...w, organization_id: orgId, status: 'active' })))
      .select('id, code, name');

    if (whErr) throw whErr;
    counts.warehouses = insertedWarehouses.length;
    const whMap = new Map(insertedWarehouses.map(w => [w.code, w.id]));
    const mumWhId = whMap.get('WH-MUM');
    const punWhId = whMap.get('WH-PUN');
    const blrWhId = whMap.get('WH-BLR');
    const whIds = [mumWhId, punWhId, blrWhId];

    // 2. Categories
    const { data: insertedCategories, error: catErr } = await supabaseAdmin
      .from('categories')
      .insert(DEMO_CATEGORIES.map(c => ({ ...c, organization_id: orgId })))
      .select('id, name, gst_rate_percent');

    if (catErr) throw catErr;
    counts.categories = insertedCategories.length;
    const catMap = new Map(insertedCategories.map(c => [c.name, c]));

    // 3. Products
    const { data: insertedProducts, error: prodErr } = await supabaseAdmin
      .from('products')
      .insert(DEMO_PRODUCTS.map(p => ({
        organization_id: orgId,
        name: p.name,
        sku: p.sku,
        barcode: p.barcode,
        category_id: catMap.get(p.category)?.id || null,
        unit_id: p.unit_id,
        cost_price: p.cost_price,
        selling_price: p.selling_price,
        description: p.description,
        status: 'active',
      })))
      .select('id, sku, name, cost_price, selling_price');

    if (prodErr) throw prodErr;
    counts.products = insertedProducts.length;
    const prodMap = new Map(insertedProducts.map(p => [p.sku, p]));
    const prodList = insertedProducts;

    // 4. Stock Balances
    const stockBalanceRows = [];
    for (const p of DEMO_PRODUCTS) {
      const dbProd = prodMap.get(p.sku);
      if (!dbProd) continue;
      stockBalanceRows.push(
        { organization_id: orgId, product_id: dbProd.id, warehouse_id: mumWhId, quantity: p.stock_mumbai, reorder_level: p.reorder_level, reserved_quantity: Math.floor(p.stock_mumbai * 0.1) },
        { organization_id: orgId, product_id: dbProd.id, warehouse_id: punWhId, quantity: p.stock_pune, reorder_level: Math.floor(p.reorder_level * 0.6), reserved_quantity: Math.floor(p.stock_pune * 0.08) },
        { organization_id: orgId, product_id: dbProd.id, warehouse_id: blrWhId, quantity: p.stock_bangalore, reorder_level: Math.floor(p.reorder_level * 0.5), reserved_quantity: Math.floor(p.stock_bangalore * 0.05) }
      );
    }
    await supabaseAdmin.from('stock_balances').insert(stockBalanceRows);
    counts.stockBalances = stockBalanceRows.length;

    // 5. Customers
    const { data: insertedCustomers, error: custErr } = await supabaseAdmin
      .from('customers')
      .insert(DEMO_CUSTOMERS.map(c => ({ ...c, organization_id: orgId, outstanding_balance: 0, status: 'active' })))
      .select('id, name');

    if (custErr) throw custErr;
    counts.customers = insertedCustomers.length;

    // 6. Suppliers
    const { data: insertedSuppliers, error: suppErr } = await supabaseAdmin
      .from('suppliers')
      .insert(DEMO_SUPPLIERS.map(s => ({ ...s, organization_id: orgId, status: 'active' })))
      .select('id, name');

    if (suppErr) throw suppErr;
    counts.suppliers = insertedSuppliers.length;

    const now = new Date('2026-10-04T12:00:00Z').getTime();
    const dayMs = 24 * 60 * 60 * 1000;

    // 7. Purchase Orders (25 POs)
    const poList = [];
    for (let i = 1; i <= 25; i++) {
      const poNum = `PO-2026-${String(1000 + i).slice(1)}`;
      const supp = insertedSuppliers[(i - 1) % insertedSuppliers.length];
      const whId = whIds[(i - 1) % whIds.length];
      const daysAgo = 88 - Math.floor((i * 85) / 25);
      const orderDate = new Date(now - daysAgo * dayMs).toISOString().split('T')[0];
      const status = i <= 20 ? 'received' : i <= 23 ? 'partially_received' : 'sent';

      poList.push({
        organization_id: orgId,
        po_number: poNum,
        supplier_id: supp.id,
        warehouse_id: whId,
        status,
        subtotal: 0,
        tax_amount: 0,
        total_amount: 0,
        order_date: orderDate,
        expected_delivery: new Date(now - (daysAgo - 5) * dayMs).toISOString().split('T')[0],
      });
    }

    const { data: insertedPOs, error: poErr } = await supabaseAdmin
      .from('purchase_orders')
      .insert(poList)
      .select('id, po_number, supplier_id, warehouse_id, status, order_date');

    if (poErr) throw poErr;
    counts.purchaseOrders = insertedPOs.length;

    const poItemRows = [];
    const poUpdates = [];
    const receiptRows = [];
    const purchPaymentRows = [];
    const purchReturnRows = [];
    const movementRows = [];

    insertedPOs.forEach((po, idx) => {
      let subtotal = 0;
      let taxTotal = 0;
      const itemCount = 2 + (idx % 3);

      for (let j = 0; j < itemCount; j++) {
        const prod = prodList[(idx * 2 + j) % prodList.length];
        const qty = 20 + ((idx * 5 + j * 7) % 50);
        const unitCost = Number(prod.cost_price);
        const taxRate = 18.0;
        const lineSubtotal = qty * unitCost;
        const lineTax = (lineSubtotal * taxRate) / 100;
        const lineTotal = lineSubtotal + lineTax;

        subtotal += lineSubtotal;
        taxTotal += lineTax;

        poItemRows.push({
          organization_id: orgId,
          purchase_order_id: po.id,
          product_id: prod.id,
          quantity: qty,
          unit_price: unitCost,
          tax_rate: taxRate,
          tax_amount: lineTax,
          total_amount: lineTotal,
          received_quantity: po.status === 'received' ? qty : po.status === 'partially_received' ? Math.floor(qty * 0.5) : 0,
        });

        if (po.status === 'received' || po.status === 'partially_received') {
          const recQty = po.status === 'received' ? qty : Math.floor(qty * 0.5);
          movementRows.push({
            organization_id: orgId,
            product_id: prod.id,
            warehouse_id: po.warehouse_id,
            movement_type: 'purchase_receipt',
            quantity: recQty,
            unit_cost: unitCost,
            reference_number: po.po_number,
            notes: `Purchase Receipt for ${po.po_number}`,
            created_at: new Date(new Date(po.order_date).getTime() + 3 * dayMs).toISOString(),
          });
        }
      }

      poUpdates.push({ id: po.id, subtotal, tax_amount: taxTotal, total_amount: subtotal + taxTotal });

      if (po.status === 'received' || po.status === 'partially_received') {
        receiptRows.push({
          organization_id: orgId,
          receipt_number: `GRN-2026-${String(1000 + idx + 1).slice(1)}`,
          purchase_order_id: po.id,
          supplier_id: po.supplier_id,
          warehouse_id: po.warehouse_id,
          status: 'verified',
          receipt_date: new Date(new Date(po.order_date).getTime() + 3 * dayMs).toISOString(),
          notes: `Goods received against ${po.po_number}`,
        });
      }

      if (idx < 20) {
        purchPaymentRows.push({
          organization_id: orgId,
          payment_number: `PPAY-2026-${String(1000 + idx + 1).slice(1)}`,
          purchase_order_id: po.id,
          supplier_id: po.supplier_id,
          amount: subtotal + taxTotal,
          payment_method: 'neft',
          status: 'completed',
          payment_date: new Date(new Date(po.order_date).getTime() + 10 * dayMs).toISOString(),
          reference_number: `NEFT-SUPP-${100000 + idx}`,
        });
      }

      if (idx === 3 || idx === 8 || idx === 14 || idx === 19) {
        const retProd = prodList[(idx * 2) % prodList.length];
        purchReturnRows.push({
          organization_id: orgId,
          return_number: `PRET-2026-00${purchReturnRows.length + 1}`,
          purchase_order_id: po.id,
          supplier_id: po.supplier_id,
          warehouse_id: po.warehouse_id,
          product_id: retProd.id,
          quantity: 4,
          reason: 'Defective batch returned to supplier',
          status: 'completed',
          created_at: new Date(new Date(po.order_date).getTime() + 7 * dayMs).toISOString(),
        });

        movementRows.push({
          organization_id: orgId,
          product_id: retProd.id,
          warehouse_id: po.warehouse_id,
          movement_type: 'purchase_return',
          quantity: -4,
          unit_cost: Number(retProd.cost_price),
          reference_number: `PRET-2026-00${purchReturnRows.length}`,
          notes: 'Returned damaged items to supplier',
          created_at: new Date(new Date(po.order_date).getTime() + 7 * dayMs).toISOString(),
        });
      }
    });

    await supabaseAdmin.from('purchase_order_items').insert(poItemRows);
    counts.purchaseOrderItems = poItemRows.length;

    for (const u of poUpdates) {
      await supabaseAdmin.from('purchase_orders').update({
        subtotal: u.subtotal,
        tax_amount: u.tax_amount,
        total_amount: u.total_amount,
      }).eq('id', u.id);
    }

    await supabaseAdmin.from('purchase_receipts').insert(receiptRows);
    counts.purchaseReceipts = receiptRows.length;

    await supabaseAdmin.from('purchase_payments').insert(purchPaymentRows);
    counts.purchasePayments = purchPaymentRows.length;

    await supabaseAdmin.from('purchase_returns').insert(purchReturnRows);
    counts.purchaseReturns = purchReturnRows.length;

    // 8. Sales Orders (50 SOs)
    const soList = [];
    for (let i = 1; i <= 50; i++) {
      const soNum = `SO-2026-${String(2000 + i).slice(1)}`;
      const cust = insertedCustomers[(i - 1) % insertedCustomers.length];
      const whId = whIds[(i - 1) % whIds.length];
      const daysAgo = 89 - Math.floor((i * 88) / 50);
      const orderDate = new Date(now - daysAgo * dayMs).toISOString().split('T')[0];
      const status = i <= 42 ? 'completed' : i <= 46 ? 'processing' : i <= 48 ? 'confirmed' : 'cancelled';

      soList.push({
        organization_id: orgId,
        order_number: soNum,
        customer_id: cust.id,
        warehouse_id: whId,
        status,
        subtotal: 0,
        tax_amount: 0,
        total_amount: 0,
        order_date: orderDate,
      });
    }

    const { data: insertedSOs, error: soErr } = await supabaseAdmin
      .from('sales_orders')
      .insert(soList)
      .select('id, order_number, customer_id, warehouse_id, status, order_date');

    if (soErr) throw soErr;
    counts.salesOrders = insertedSOs.length;

    const soItemRows = [];
    const soUpdates = [];
    const invoiceRows = [];

    insertedSOs.forEach((so, idx) => {
      let subtotal = 0;
      let taxTotal = 0;
      const itemCount = 2 + (idx % 3);

      for (let j = 0; j < itemCount; j++) {
        const prod = prodList[(idx * 3 + j) % prodList.length];
        const qty = 2 + ((idx * 3 + j * 2) % 15);
        const unitPrice = Number(prod.selling_price);
        const taxRate = 18.0;
        const lineSubtotal = qty * unitPrice;
        const lineTax = (lineSubtotal * taxRate) / 100;
        const lineTotal = lineSubtotal + lineTax;

        subtotal += lineSubtotal;
        taxTotal += lineTax;

        soItemRows.push({
          organization_id: orgId,
          sales_order_id: so.id,
          product_id: prod.id,
          quantity: qty,
          unit_price: unitPrice,
          tax_rate: taxRate,
          tax_amount: lineTax,
          total_amount: lineTotal,
        });

        if (so.status === 'completed' || so.status === 'processing') {
          movementRows.push({
            organization_id: orgId,
            product_id: prod.id,
            warehouse_id: so.warehouse_id,
            movement_type: 'sales_dispatch',
            quantity: -qty,
            unit_cost: Number(prod.cost_price),
            reference_number: so.order_number,
            notes: `Dispatch for order ${so.order_number}`,
            created_at: new Date(new Date(so.order_date).getTime() + 1 * dayMs).toISOString(),
          });
        }
      }

      soUpdates.push({ id: so.id, subtotal, tax_amount: taxTotal, total_amount: subtotal + taxTotal });

      const invNum = `INV-2026-${String(3000 + idx + 1).slice(1)}`;
      const invStatus =
        so.status === 'cancelled'
          ? 'cancelled'
          : idx < 38
          ? 'paid'
          : idx < 44
          ? 'partially_paid'
          : idx < 48
          ? 'issued'
          : 'overdue';

      const totalAmt = subtotal + taxTotal;
      const paidAmt =
        invStatus === 'paid' ? totalAmt : invStatus === 'partially_paid' ? Math.floor(totalAmt * 0.5) : 0;

      invoiceRows.push({
        organization_id: orgId,
        invoice_number: invNum,
        sales_order_id: so.id,
        customer_id: so.customer_id,
        status: invStatus,
        subtotal,
        tax_amount: taxTotal,
        total_amount: totalAmt,
        paid_amount: paidAmt,
        issue_date: so.order_date,
        due_date: new Date(new Date(so.order_date).getTime() + 30 * dayMs).toISOString().split('T')[0],
      });
    });

    await supabaseAdmin.from('sales_order_items').insert(soItemRows);
    counts.salesOrderItems = soItemRows.length;

    for (const u of soUpdates) {
      await supabaseAdmin.from('sales_orders').update({
        subtotal: u.subtotal,
        tax_amount: u.tax_amount,
        total_amount: u.total_amount,
      }).eq('id', u.id);
    }

    const { data: insertedInvoices, error: invErr } = await supabaseAdmin
      .from('invoices')
      .insert(invoiceRows)
      .select('id, invoice_number, sales_order_id, customer_id, status, paid_amount, issue_date');

    if (invErr) throw invErr;
    counts.invoices = insertedInvoices.length;

    // Sales Payments
    const salesPaymentRows = [];
    insertedInvoices.forEach((inv, idx) => {
      if (inv.paid_amount > 0) {
        salesPaymentRows.push({
          organization_id: orgId,
          payment_number: `SPAY-2026-${String(4000 + salesPaymentRows.length + 1).slice(1)}`,
          invoice_id: inv.id,
          customer_id: inv.customer_id,
          amount: inv.paid_amount,
          payment_method: idx % 3 === 0 ? 'upi' : idx % 3 === 1 ? 'neft' : 'bank_transfer',
          status: 'completed',
          payment_date: new Date(new Date(inv.issue_date).getTime() + 5 * dayMs).toISOString(),
          reference_number: `UTR-${202600 + idx}`,
        });
      }
    });

    await supabaseAdmin.from('sales_payments').insert(salesPaymentRows);
    counts.salesPayments = salesPaymentRows.length;

    // Sales Returns
    const salesReturnRows = [];
    for (let r = 1; r <= 5; r++) {
      const so = insertedSOs[r * 5];
      const prod = prodList[r * 3];
      const refundAmt = Number(prod.selling_price) * 1.18 * 2;

      salesReturnRows.push({
        organization_id: orgId,
        return_number: `SRET-2026-00${r}`,
        sales_order_id: so.id,
        customer_id: so.customer_id,
        warehouse_id: so.warehouse_id,
        product_id: prod.id,
        quantity: 2,
        refund_amount: refundAmt,
        reason: r % 2 === 0 ? 'Customer size exchange' : 'Minor transit packaging damage',
        status: 'completed',
        created_at: new Date(new Date(so.order_date).getTime() + 6 * dayMs).toISOString(),
      });

      movementRows.push({
        organization_id: orgId,
        product_id: prod.id,
        warehouse_id: so.warehouse_id,
        movement_type: 'sales_return',
        quantity: 2,
        unit_cost: Number(prod.cost_price),
        reference_number: `SRET-2026-00${r}`,
        notes: 'Restocked from customer return',
        created_at: new Date(new Date(so.order_date).getTime() + 6 * dayMs).toISOString(),
      });
    }

    await supabaseAdmin.from('sales_returns').insert(salesReturnRows);
    counts.salesReturns = salesReturnRows.length;

    // 9. Inventory Transfers (10)
    const transferRows = [];
    for (let t = 1; t <= 10; t++) {
      const srcWh = t % 2 === 0 ? mumWhId : punWhId;
      const dstWh = t % 2 === 0 ? blrWhId : mumWhId;
      const transferNum = `TR-2026-${String(6000 + t).slice(1)}`;
      const status = t <= 8 ? 'completed' : 'in_transit';
      const itemsCount = 15 + t * 5;
      const daysAgo = 70 - t * 6;

      transferRows.push({
        organization_id: orgId,
        transfer_number: transferNum,
        source_warehouse_id: srcWh,
        destination_warehouse_id: dstWh,
        status,
        total_items: itemsCount,
        notes: 'Stock rebalance transfer between regional logistics centers',
        created_at: new Date(now - daysAgo * dayMs).toISOString(),
      });

      if (status === 'completed') {
        const prod = prodList[(t * 4) % prodList.length];
        movementRows.push(
          {
            organization_id: orgId,
            product_id: prod.id,
            warehouse_id: srcWh,
            movement_type: 'transfer_out',
            quantity: -itemsCount,
            unit_cost: Number(prod.cost_price),
            reference_number: transferNum,
            notes: 'Transfer out to destination depot',
            created_at: new Date(now - daysAgo * dayMs).toISOString(),
          },
          {
            organization_id: orgId,
            product_id: prod.id,
            warehouse_id: dstWh,
            movement_type: 'transfer_in',
            quantity: itemsCount,
            unit_cost: Number(prod.cost_price),
            reference_number: transferNum,
            notes: 'Transfer in from source logistics hub',
            created_at: new Date(now - (daysAgo - 1) * dayMs).toISOString(),
          }
        );
      }
    }

    await supabaseAdmin.from('inventory_transfers').insert(transferRows);
    counts.inventoryTransfers = transferRows.length;

    // 10. Inventory Adjustments (12)
    const adjustmentRows = [];
    for (let a = 1; a <= 12; a++) {
      const adjNum = `ADJ-2026-${String(7000 + a).slice(1)}`;
      const isPos = a % 2 === 1;
      const adjWh = whIds[a % whIds.length];
      const adjProd = prodList[(a * 3) % prodList.length];
      const qty = 3 + (a % 5);
      const daysAgo = 80 - a * 6;

      adjustmentRows.push({
        organization_id: orgId,
        adjustment_number: adjNum,
        warehouse_id: adjWh,
        product_id: adjProd.id,
        adjustment_type: isPos ? 'increase' : 'decrease',
        quantity: qty,
        reason: isPos ? 'Cycle count audit surplus correction' : 'Damaged stock written off during audit',
        status: 'completed',
        created_at: new Date(now - daysAgo * dayMs).toISOString(),
      });

      movementRows.push({
        organization_id: orgId,
        product_id: adjProd.id,
        warehouse_id: adjWh,
        movement_type: isPos ? 'adjustment_positive' : 'adjustment_negative',
        quantity: isPos ? qty : -qty,
        unit_cost: Number(adjProd.cost_price),
        reference_number: adjNum,
        notes: isPos ? 'Cycle count audit adjustment' : 'Damaged stock adjustment',
        created_at: new Date(now - daysAgo * dayMs).toISOString(),
      });
    }

    await supabaseAdmin.from('inventory_adjustments').insert(adjustmentRows);
    counts.inventoryAdjustments = adjustmentRows.length;

    // 11. Inventory Movements Ledger
    await supabaseAdmin.from('inventory_movements').insert(movementRows);
    counts.inventoryMovements = movementRows.length;

    return {
      success: true,
      organizationId: orgId,
      organizationSlug: DEMO_ORG_SLUG,
      counts,
      durationMs: Date.now() - startTime,
    };
  } catch (err) {
    return {
      success: false,
      organizationSlug: DEMO_ORG_SLUG,
      counts,
      durationMs: Date.now() - startTime,
      error: err?.message || String(err),
    };
  }
}
