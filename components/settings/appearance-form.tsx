'use client';

import React from 'react';
import { useTheme } from '@/components/theme/theme-provider';
import { Theme } from '@/lib/preferences/theme';
import { Check, Sun, Moon, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppearanceForm() {
  const { theme, setTheme, isSaving, error } = useTheme();

  const options: {
    id: Theme;
    title: string;
    description: string;
    icon: typeof Sun;
    previewBg: string;
    previewSurface: string;
    previewSidebar: string;
    previewText: string;
    previewBorder: string;
  }[] = [
    {
      id: 'light',
      title: 'Light',
      description: 'Clean white interface engineered for daylight clarity and high readability.',
      icon: Sun,
      previewBg: 'bg-[#f7f7f7]',
      previewSurface: 'bg-[#ffffff]',
      previewSidebar: 'bg-[#F8F8F8]',
      previewText: 'bg-[#1E1F21]',
      previewBorder: 'border-[#DDDEE1]',
    },
    {
      id: 'dark',
      title: 'Dark',
      description: 'Deep carbon interface optimized for low-light environments and reduced eye strain.',
      icon: Moon,
      previewBg: 'bg-[#111213]',
      previewSurface: 'bg-[#1F1F21]',
      previewSidebar: 'bg-[#18191A]',
      previewText: 'bg-[#E2E3E4]',
      previewBorder: 'border-[#2B2C2F]',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Status messages */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Theme Cards Grid */}
      <div
        role="radiogroup"
        aria-label="Theme Selection"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl"
      >
        {options.map((opt) => {
          const isSelected = theme === opt.id;
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => setTheme(opt.id)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  setTheme(opt.id);
                }
              }}
              className={cn(
                'relative flex flex-col text-left rounded-xl border p-5 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-text-primary',
                isSelected
                  ? 'border-text-primary bg-surface shadow-sm ring-1 ring-text-primary'
                  : 'border-border-subtle bg-surface hover:border-border text-text-secondary'
              )}
            >
              {/* Radio Indicator & Header */}
              <div className="flex items-center justify-between mb-3 w-full">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors',
                      isSelected
                        ? 'border-text-primary/20 bg-surface-muted text-text-primary'
                        : 'border-border-subtle bg-surface-muted text-text-muted'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-text-primary block font-secondary">
                      {opt.title}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      {opt.id === 'light' ? 'Default baseline' : 'Dark mode palette'}
                    </span>
                  </div>
                </div>

                {/* Selection indicator pill */}
                <div
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full border transition-all',
                    isSelected
                      ? 'border-text-primary bg-text-primary text-background'
                      : 'border-border text-transparent'
                  )}
                >
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              </div>

              {/* Visual Mini Mockup */}
              <div
                className={cn(
                  'h-24 w-full rounded-lg border p-2 mb-3 flex gap-2 overflow-hidden select-none',
                  opt.previewBg,
                  opt.previewBorder
                )}
                aria-hidden="true"
              >
                {/* Mock sidebar */}
                <div
                  className={cn(
                    'w-12 h-full rounded border flex flex-col gap-1.5 p-1 shrink-0',
                    opt.previewSidebar,
                    opt.previewBorder
                  )}
                >
                  <div className={cn('h-1.5 w-6 rounded-full opacity-40', opt.previewText)} />
                  <div className={cn('h-1 w-8 rounded-full opacity-20', opt.previewText)} />
                  <div className={cn('h-1 w-7 rounded-full opacity-20', opt.previewText)} />
                </div>

                {/* Mock content area */}
                <div className="flex-1 flex flex-col gap-1.5">
                  <div
                    className={cn(
                      'h-6 rounded border flex items-center justify-between px-2',
                      opt.previewSurface,
                      opt.previewBorder
                    )}
                  >
                    <div className={cn('h-1.5 w-10 rounded-full opacity-60', opt.previewText)} />
                    <div className="h-2 w-2 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="grid grid-cols-2 gap-1 flex-1">
                    <div className={cn('rounded border', opt.previewSurface, opt.previewBorder)} />
                    <div className={cn('rounded border', opt.previewSurface, opt.previewBorder)} />
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-text-muted leading-relaxed">
                {opt.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Sync Status Banner */}
      <div className="flex items-center gap-2 text-xs text-text-muted pt-2 border-t border-border-subtle max-w-3xl">
        {isSaving ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-text-secondary" />
            <span>Saving preference to your profile…</span>
          </>
        ) : (
          <>
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
            <span>Preferences auto-save immediately and sync across all your devices.</span>
          </>
        )}
      </div>
    </div>
  );
}
