'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { forgotPasswordAction, AuthActionResult } from '@/lib/auth/actions';

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    forgotPasswordAction,
    null
  );

  if (state?.success && state.message) {
    return (
      <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-4 text-center">
        <div className="mx-auto w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-text-primary">Reset Link Dispatched</h3>
        <p className="text-xs text-text-secondary leading-relaxed max-w-sm mx-auto">
          {state.message}
        </p>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-md bg-text-primary text-background hover:bg-text-primary/90 transition-colors"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4.5">
      {state?.error && (
        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs leading-relaxed">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1.5">
          Registered Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-text-muted" />
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="name@company.com"
            disabled={isPending}
            className="w-full rounded-md border border-border bg-background pl-10 pr-3.5 py-2 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary disabled:opacity-60"
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
            <span>Sending recovery instructions…</span>
          </>
        ) : (
          <>
            <span>Send Reset Instructions</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
