'use client';

import { useActionState, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, FlaskConical } from 'lucide-react';
import { loginAction, AuthActionResult } from '@/lib/auth/actions';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/lib/demo/config';

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    loginAction,
    null
  );
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleDemoLogin = useCallback(() => {
    if (!DEMO_EMAIL || !DEMO_PASSWORD) return;
    if (emailRef.current) emailRef.current.value = DEMO_EMAIL;
    if (passwordRef.current) passwordRef.current.value = DEMO_PASSWORD;
    // Submit the form after a short delay so React renders the values
    setTimeout(() => formRef.current?.requestSubmit(), 50);
  }, []);

  const hasDemoCredentials = Boolean(DEMO_EMAIL && DEMO_PASSWORD);

  return (
    <form ref={formRef} action={formAction} className="space-y-4.5">
      <input type="hidden" name="next" value={nextPath} />

      {state?.error && (
        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs leading-relaxed">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1.5">
          Work Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-text-muted" />
          <input
            ref={emailRef}
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
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-text-primary">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-[11px] text-text-muted hover:text-text-primary transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-text-muted" />
          <input
            ref={passwordRef}
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••••••"
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

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-text-primary py-2.5 text-xs sm:text-sm font-medium text-background hover:bg-text-primary/90 transition-colors cursor-pointer disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Signing in…</span>
          </>
        ) : (
          <>
            <span>Sign In to App</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      {hasDemoCredentials && (
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isPending}
          id="demo-login-btn"
          className="flex w-full items-center justify-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/8 py-2.5 text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-500/15 transition-colors cursor-pointer disabled:opacity-60"
        >
          <FlaskConical className="h-3.5 w-3.5" />
          <span>Use Demo Account</span>
        </button>
      )}
    </form>
  );
}
