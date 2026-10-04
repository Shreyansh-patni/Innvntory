#!/usr/bin/env node
/**
 * scripts/reset-demo-workspace.mjs
 *
 * INNVNTORY — MANUAL DEMO WORKSPACE RESET SCRIPT
 * Sahaya Technologies Pvt. Ltd.
 *
 * PURPOSE:
 *   Manually triggers the comprehensive 2-hour demo reset logic from an administrative terminal
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

console.log('[RESET] Initiating comprehensive demo workspace reset...');

const DEMO_ORG_SLUG = 'innvntory-demo';

// Dynamic import of resetDemoWorkspace from typescript compiled or direct js/ts
// To ensure maximum compatibility with node without ts-node/tsx, we can either use tsx or run a direct node runner.
// Let's check how resetDemoWorkspace is executed or call it via tsx or inline.
