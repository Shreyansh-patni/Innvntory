'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { LogOut, User, Settings, ShieldCheck, Loader2 } from 'lucide-react';
import { logoutAction } from '@/lib/auth/actions';

interface UserAccountMenuProps {
  email?: string;
  fullName?: string;
  organizationName?: string;
}

export function UserAccountMenu({
  email = 'admin@sahaya.tech',
  fullName,
  organizationName = 'Sahaya Technologies',
}: UserAccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const displayName = fullName || email.split('@')[0];
  const initials = (displayName.slice(0, 2) || 'OP').toUpperCase();

  const handleSignOut = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="User account menu"
        className="flex items-center gap-2.5 pl-2 border-l border-border-subtle hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-muted border border-border-subtle text-[11px] font-mono font-bold text-text-primary">
          {initials}
        </div>
        <div className="hidden xl:block text-left leading-tight">
          <p className="text-xs font-medium text-text-primary truncate max-w-[140px]">{displayName}</p>
          <p className="text-[10px] text-text-muted truncate max-w-[140px]">{organizationName}</p>
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border-subtle bg-surface p-1.5 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2 border-b border-border-subtle mb-1">
              <p className="text-xs font-medium text-text-primary truncate">{displayName}</p>
              <p className="text-[11px] text-text-muted truncate font-mono">{email}</p>
            </div>

            <Link
              href="/app/settings/organization"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-muted hover:text-text-primary rounded-md transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-text-muted" />
              <span>Organization Settings</span>
            </Link>

            <Link
              href="/app/settings/security"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-muted hover:text-text-primary rounded-md transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-text-muted" />
              <span>Security & Access Logs</span>
            </Link>

            <Link
              href="/app/settings/users"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-muted hover:text-text-primary rounded-md transition-colors"
            >
              <User className="w-3.5 h-3.5 text-text-muted" />
              <span>Team Members</span>
            </Link>

            <div className="border-t border-border-subtle my-1" />

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isPending}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Signing out…</span>
                </>
              ) : (
                <>
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
