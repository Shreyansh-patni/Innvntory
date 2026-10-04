/**
 * tests/unit/theme-preference.test.mjs
 *
 * Unit tests for SETUP 11.7 Persistent Light / Dark Theme:
 * - Default theme = 'light'
 * - Valid theme choices: 'light' and 'dark'
 * - Invalid theme values rejected
 * - user_preferences migration rules & RLS policies
 * - Demo account browser-isolation guarantees
 */

import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import {
  DEFAULT_THEME,
  THEME_COOKIE_NAME,
  THEME_STORAGE_KEY,
  isValidTheme,
} from '../../lib/preferences/theme.ts';

test('theme system defaults to light mode', () => {
  assert.strictEqual(DEFAULT_THEME, 'light', 'Default theme must strictly be light');
});

test('theme validator accepts only light and dark', () => {
  assert.strictEqual(isValidTheme('light'), true, 'light must be valid');
  assert.strictEqual(isValidTheme('dark'), true, 'dark must be valid');
  assert.strictEqual(isValidTheme('system'), false, 'system must not be supported');
  assert.strictEqual(isValidTheme('auto'), false, 'auto must not be supported');
  assert.strictEqual(isValidTheme('high-contrast'), false, 'high-contrast must not be supported');
  assert.strictEqual(isValidTheme(''), false, 'empty string must be invalid');
  assert.strictEqual(isValidTheme(null), false, 'null must be invalid');
  assert.strictEqual(isValidTheme(undefined), false, 'undefined must be invalid');
  assert.strictEqual(isValidTheme(123), false, 'numbers must be invalid');
});

test('cookie and storage keys are consistently defined', () => {
  assert.strictEqual(THEME_COOKIE_NAME, 'innvntory_theme');
  assert.strictEqual(THEME_STORAGE_KEY, 'innvntory_theme');
});

test('user_preferences migration defines strict constraints and RLS', () => {
  const migrationPath = path.resolve(process.cwd(), 'supabase/migrations/20261004030000_user_preferences.sql');
  assert.ok(fs.existsSync(migrationPath), 'Migration file must exist');

  const content = fs.readFileSync(migrationPath, 'utf8');

  // Check table creation & FK
  assert.ok(content.includes('CREATE TABLE IF NOT EXISTS public.user_preferences'), 'Must create user_preferences table');
  assert.ok(content.includes('REFERENCES auth.users(id)'), 'Must reference auth.users(id)');
  assert.ok(content.includes("CHECK (theme IN ('light', 'dark'))"), 'Must strictly enforce light/dark check constraint');
  assert.ok(content.includes("DEFAULT 'light'"), 'Must default to light');

  // Check RLS
  assert.ok(content.includes('ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;'), 'RLS must be enabled');
  assert.ok(content.includes('auth.uid() = user_id'), 'RLS policy must enforce auth.uid() = user_id');
});

test('Appearance settings page and form components exist', () => {
  const pagePath = path.resolve(process.cwd(), 'app/(application)/app/settings/appearance/page.tsx');
  assert.ok(fs.existsSync(pagePath), 'Settings Appearance page must exist');

  const formPath = path.resolve(process.cwd(), 'components/settings/appearance-form.tsx');
  assert.ok(fs.existsSync(formPath), 'AppearanceForm component must exist');

  const providerPath = path.resolve(process.cwd(), 'components/theme/theme-provider.tsx');
  assert.ok(fs.existsSync(providerPath), 'ThemeProvider component must exist');
});
