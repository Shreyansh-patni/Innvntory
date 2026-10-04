'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { Theme, THEME_COOKIE_NAME, isValidTheme } from './theme';

export interface UpdateThemeResult {
  success: boolean;
  theme?: Theme;
  error?: string;
  isDemo?: boolean;
}

/**
 * Server action to update the user's theme preference.
 * - Sets the `innvntory_theme` cookie for SSR fast paint.
 * - If user is authenticated and not demo, persists to Supabase `user_preferences`.
 */
export async function updateThemePreferenceAction(theme: Theme): Promise<UpdateThemeResult> {
  if (!isValidTheme(theme)) {
    return { success: false, error: 'Invalid theme choice. Must be "light" or "dark".' };
  }

  // 1. Set fast SSR theme cookie (1 year lifespan)
  const cookieStore = await cookies();
  cookieStore.set(THEME_COOKIE_NAME, theme, {
    path: '/',
    maxAge: 31536000,
    sameSite: 'lax',
    httpOnly: false, // accessible to client scripts to avoid hydration mismatch
  });

  // 2. Persist to Supabase if authenticated normal user
  const supabase = await createClient();
  if (!supabase) {
    return { success: true, theme, isDemo: false };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Anonymous user: cookie is saved
    return { success: true, theme, isDemo: false };
  }

  const isDemo = user.email === 'demo@innvntory.com' || user.email === 'demo@innvntory.sahaya.tech';
  if (isDemo) {
    // Demo user: do NOT overwrite the shared DB row for other visitors
    return { success: true, theme, isDemo: true };
  }

  // Normal user: upsert preference row in database
  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: user.id,
      theme,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) {
    console.error('[THEME] Failed to persist user_preferences:', error.message);
    return { success: false, error: 'Could not sync theme preference to your cloud profile.' };
  }

  return { success: true, theme, isDemo: false };
}
