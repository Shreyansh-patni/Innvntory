'use client';

import React from 'react';
import { useTheme } from './theme-provider';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, setTheme, isSaving } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={isSaving}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={cn(
        'flex items-center gap-2 rounded-md border border-border-subtle bg-surface px-2.5 py-1.5 text-xs text-text-secondary hover:border-border hover:text-text-primary transition-colors cursor-pointer disabled:opacity-50',
        className
      )}
    >
      {isDark ? (
        <Sun className="h-3.5 w-3.5 text-amber-500" />
      ) : (
        <Moon className="h-3.5 w-3.5 text-text-muted" />
      )}
      {showLabel && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
    </button>
  );
}
