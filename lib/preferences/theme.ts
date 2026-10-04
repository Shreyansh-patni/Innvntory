export type Theme = 'light' | 'dark';

export const DEFAULT_THEME: Theme = 'light';
export const THEME_COOKIE_NAME = 'innvntory_theme';
export const THEME_STORAGE_KEY = 'innvntory_theme';

/**
 * Type guard to validate whether an unknown value is a valid Innvntory theme.
 */
export function isValidTheme(val: unknown): val is Theme {
  return val === 'light' || val === 'dark';
}
