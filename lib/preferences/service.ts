import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { Theme, DEFAULT_THEME, THEME_COOKIE_NAME, isValidTheme } from './theme';
import { isDemoOrganization } from '@/lib/demo/config';

export interface UserPreferencesResult {
  theme: Theme;
  source: 'database' | 'cookie' | 'default';
  isDemo: boolean;
}

/**
 * Resolves the theme preference for the current request.
 * - For normal authenticated users: fetches or provisions from Supabase `user_preferences`.
 * - For demo users: relies on client/cookie persistence to avoid mutating the shared account.
 * - For unauthenticated requests: defaults to 'light'.
 */
export async function getResolvedThemePreference(): Promise<UserPreferencesResult> {
  const cookieStore = await cookies();
  const rawCookieTheme = cookieStore.get(THEME_COOKIE_NAME)?.value;
  const cookieTheme: Theme = isValidTheme(rawCookieTheme) ? rawCookieTheme : DEFAULT_THEME;

  const supabase = await createClient();
  if (!supabase) {
    return { theme: cookieTheme, source: 'cookie', isDemo: false };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If unauthenticated, use cookie or default
  if (!user || !user.email) {
    return { theme: cookieTheme, source: 'cookie', isDemo: false };
  }

  // Check if this is the shared public demo account
  const isDemo = user.email === 'demo@innvntory.sahaya.tech' || isDemoOrganization(user.user_metadata?.org_slug);

  if (isDemo) {
    // Demo accounts use isolated browser cookie/storage
    return { theme: cookieTheme, source: 'cookie', isDemo: true };
  }

  // Normal authenticated user: load from Supabase `user_preferences`
  const { data: preference, error } = await supabase
    .from('user_preferences')
    .select('theme')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('[THEME] Error fetching user_preferences:', error.message);
    return { theme: cookieTheme, source: 'cookie', isDemo: false };
  }

  if (preference && isValidTheme(preference.theme)) {
    return { theme: preference.theme, source: 'database', isDemo: false };
  }

  // No record exists yet -> idempotently insert default 'light' preference
  const { error: insertError } = await supabase
    .from('user_preferences')
    .insert({
      user_id: user.id,
      theme: DEFAULT_THEME,
    });

  if (insertError) {
    console.warn('[THEME] Failed to seed default user_preferences:', insertError.message);
  }

  return { theme: DEFAULT_THEME, source: 'database', isDemo: false };
}
