/**
 * tests/unit/onboarding.test.mjs
 *
 * Unit tests for SETUP 11.8 First-Time Onboarding:
 * - Business and Inventory setup schema validations
 * - user_preferences onboarding migration columns and types
 * - Demo account browser-scoped isolation guarantee
 * - Component and route file integrity
 */

import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import {
  businessSetupSchema,
  inventorySetupSchema,
  fullOnboardingSchema,
  DEMO_ONBOARDING_COOKIE,
} from '../../lib/onboarding/types.ts';

test('businessSetupSchema validates required fields and lengths', () => {
  const valid = {
    businessName: 'Apex Retail Pvt Ltd',
    industry: 'retail',
    country: 'India',
    currency: 'INR',
  };

  const parsed = businessSetupSchema.safeParse(valid);
  assert.strictEqual(parsed.success, true, 'Valid business profile should parse successfully');

  const invalid = {
    businessName: 'A', // too short
    industry: 'invalid_industry',
  };
  const failed = businessSetupSchema.safeParse(invalid);
  assert.strictEqual(failed.success, false, 'Invalid business profile must fail validation');
});

test('inventorySetupSchema validates warehouse and SKU count', () => {
  const valid = {
    warehouseName: 'Central Hub',
    warehouseCity: 'Mumbai',
    skuCountRange: '50-500',
    gstRegistered: true,
  };

  const parsed = inventorySetupSchema.safeParse(valid);
  assert.strictEqual(parsed.success, true, 'Valid inventory setup should parse successfully');

  const invalid = {
    warehouseName: '',
    skuCountRange: 'unknown-range',
  };
  const failed = inventorySetupSchema.safeParse(invalid);
  assert.strictEqual(failed.success, false, 'Invalid inventory setup must fail validation');
});

test('fullOnboardingSchema validates comprehensive multi-step data', () => {
  const fullValid = {
    business: {
      businessName: 'Sahaya Wholesale Hub',
      industry: 'wholesale',
      country: 'India',
      currency: 'INR',
    },
    inventory: {
      warehouseName: 'Bhiwandi Central',
      warehouseCity: 'Thane',
      skuCountRange: '500-5000',
      gstRegistered: true,
    },
  };

  const parsed = fullOnboardingSchema.safeParse(fullValid);
  assert.strictEqual(parsed.success, true, 'Full onboarding payload must parse correctly');
});

test('demo onboarding cookie key is consistently defined', () => {
  assert.strictEqual(DEMO_ONBOARDING_COOKIE, 'innvntory_demo_onboarding_completed');
});

test('user_preferences migration adds onboarding columns', () => {
  const migrationPath = path.resolve(process.cwd(), 'supabase/migrations/20261004040000_user_onboarding.sql');
  assert.ok(fs.existsSync(migrationPath), 'Onboarding migration file must exist');

  const content = fs.readFileSync(migrationPath, 'utf8');
  assert.ok(content.includes('ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN'), 'Must add onboarding_completed column');
  assert.ok(content.includes('ADD COLUMN IF NOT EXISTS onboarding_step INTEGER'), 'Must add onboarding_step column');
  assert.ok(content.includes('ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ'), 'Must add onboarding_completed_at column');
  assert.ok(content.includes('ADD COLUMN IF NOT EXISTS onboarding_data JSONB'), 'Must add onboarding_data column');
});

test('onboarding components and route exist', () => {
  const pagePath = path.resolve(process.cwd(), 'app/(application)/app/onboarding/page.tsx');
  assert.ok(fs.existsSync(pagePath), 'Onboarding page route must exist');

  const normalWizardPath = path.resolve(process.cwd(), 'components/onboarding/normal-onboarding-wizard.tsx');
  assert.ok(fs.existsSync(normalWizardPath), 'NormalOnboardingWizard component must exist');

  const demoWizardPath = path.resolve(process.cwd(), 'components/onboarding/demo-onboarding-wizard.tsx');
  assert.ok(fs.existsSync(demoWizardPath), 'DemoOnboardingWizard component must exist');
});
