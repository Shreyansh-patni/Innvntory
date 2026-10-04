'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, Building, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { signupAction, AuthActionResult } from '@/lib/auth/actions';

export function SignupForm() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    signupAction,
    null
  );
  const [showPassword, setShowPassword] = useState(false);

  if (state?.success && state.message) {
    return (
      <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-4 text-center">
        <div className="mx-auto w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-text-primary">Verify Your Email</h3>
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
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs leading-relaxed">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1.5">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-2.5 h-4 w-4 text-text-muted" />
          <input
            type="text"
            name="fullName"
            placeholder="Ramesh Sharma"
            disabled={isPending}
            className="w-full rounded-md border border-border bg-background pl-10 pr-3.5 py-2 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary disabled:opacity-60"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1.5">
          Work Email
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

      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1.5">
          Organization / Business Name
        </label>
        <div className="relative">
          <Building className="absolute left-3.5 top-2.5 h-4 w-4 text-text-muted" />
          <input
            type="text"
            name="organizationName"
            required
            placeholder="Acme Enterprises Pvt. Ltd."
            disabled={isPending}
            className="w-full rounded-md border border-border bg-background pl-10 pr-3.5 py-2 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary disabled:opacity-60"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1.5">
          Password
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

      <p className="text-[11px] text-text-muted leading-relaxed">
        By registering, you agree to Innvntory&apos;s{' '}
        <Link href="/terms" className="underline hover:text-text-primary">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline hover:text-text-primary">
          Privacy Policy
        </Link>.
      </p>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-text-primary py-2.5 text-xs sm:text-sm font-medium text-background hover:bg-text-primary/90 transition-colors cursor-pointer disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Creating organization workspace…</span>
          </>
        ) : (
          <>
            <span>Create Organization Account</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
