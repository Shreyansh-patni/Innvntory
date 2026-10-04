'use client';

import { useActionState, useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { resetPasswordAction, AuthActionResult } from '@/lib/auth/actions';

export function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    resetPasswordAction,
    null
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-4.5">
      {state?.error && (
        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs leading-relaxed">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1.5">
          New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-text-muted" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            autoComplete="new-password"
            placeholder="At least 8 characters"
            disabled={isPending}
            className="w-full rounded-md border border-border bg-background pl-10 pr-10 py-2 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-text-muted hover:text-text-primary focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1.5">
          Confirm New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-text-muted" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            required
            autoComplete="new-password"
            placeholder="Re-enter new password"
            disabled={isPending}
            className="w-full rounded-md border border-border bg-background pl-10 pr-10 py-2 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary disabled:opacity-60"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-text-primary py-2.5 text-xs sm:text-sm font-medium text-background hover:bg-text-primary/90 transition-colors cursor-pointer disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Updating password…</span>
          </>
        ) : (
          <>
            <span>Set New Password & Sign In</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
