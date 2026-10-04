'use client';

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { Theme, DEFAULT_THEME, THEME_STORAGE_KEY, THEME_COOKIE_NAME, isValidTheme } from '@/lib/preferences/theme';
import { updateThemePreferenceAction } from '@/lib/preferences/actions';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isSaving: boolean;
  error: string | null;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: Theme;
}

export function ThemeProvider({ children, initialTheme = DEFAULT_THEME }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Sync HTML document class whenever theme state changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    if (!isValidTheme(newTheme)) return;

    // 1. Immediate optimistic UI update
    setThemeState(newTheme);
    setError(null);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 2. Persist in browser local storage & cookie (immediate cache & demo account isolation)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      document.cookie = `${THEME_COOKIE_NAME}=${encodeURIComponent(newTheme)}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Storage access guard
    }

    // 3. Persist to server / Supabase in background
    setIsSaving(true);
    startTransition(async () => {
      try {
        const res = await updateThemePreferenceAction(newTheme);
        if (!res.success && res.error) {
          setError(res.error);
        }
      } catch {
        setError('Network error saving theme preference.');
      } finally {
        setIsSaving(false);
      }
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isSaving, error }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
