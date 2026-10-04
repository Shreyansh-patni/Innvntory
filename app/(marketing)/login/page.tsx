import type { Metadata } from 'next';
import Link from 'next/link';
import { FlaskConical } from 'lucide-react';
import { LoginForm } from '@/components/auth/login-form';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/lib/demo/config';

export const metadata: Metadata = {
  title: 'Sign In — Innvntory',
  description: 'Sign in to your Innvntory organization workspace.',
};

export default async function LoginPage(props: {
  searchParams: Promise<{ next?: string; error?: string; message?: string }>;
}) {
  const searchParams = await props.searchParams;
  const next = searchParams.next || '/app/dashboard';
  const errorParam = searchParams.error;
  const messageParam = searchParams.message;

  const showDemoPanel = Boolean(DEMO_EMAIL && DEMO_PASSWORD);

  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Main login card */}
        <div className="space-y-6 rounded-2xl border border-border-subtle bg-surface p-8 sm:p-10 shadow-sm">
          {/* Brand Header */}
          <div className="text-center">
            <Link href="/" className="inline-block mb-3">
              <span className="text-2xl font-heading font-bold tracking-tight text-text-primary">
                Innvntory
              </span>
            </Link>
            <h1 className="text-xl font-heading font-bold text-text-primary">
              Sign in to your workspace
            </h1>
            <p className="mt-1.5 text-xs text-text-secondary">
              Enter your work email to access your inventory and operations ledger.
            </p>
          </div>

          {/* Status Messages */}
          {messageParam === 'password_updated' && (
            <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs text-center">
              Your password has been reset successfully. Please sign in with your new credentials.
            </div>
          )}

          {errorParam === 'auth_callback_failed' && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 text-xs text-center">
              Authentication link expired or invalid. Please try signing in or request a new link.
            </div>
          )}

          {/* Interactive Login Form */}
          <LoginForm nextPath={next} />

          {/* Switch to Signup */}
          <div className="text-center text-xs text-text-secondary pt-2 border-t border-border-subtle">
            Don&apos;t have an organization account?{' '}
            <Link
              href="/signup"
              className="font-semibold text-text-primary hover:underline"
            >
              Create workspace
            </Link>
          </div>
        </div>

        {/* Demo Workspace Panel */}
        {showDemoPanel && (
          <div
            id="demo-credentials-panel"
            className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-5 space-y-3"
          >
            <div className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                  Demo Workspace
                </p>
                <p className="text-[11px] text-amber-700/80 dark:text-amber-400/70 leading-snug">
                  Explore Innvntory with a realistic sample workspace. No sign-up required.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-background/60 border border-amber-500/15 p-3 space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-text-muted">Email</span>
                <span
                  className="text-text-primary font-medium select-all"
                  title="Click to select"
                >
                  {DEMO_EMAIL}
                </span>
              </div>
              <div className="h-px bg-amber-500/10" />
              <div className="flex items-center justify-between gap-3">
                <span className="text-text-muted">Password</span>
                <span
                  className="text-text-primary font-medium select-all"
                  title="Click to select"
                >
                  {DEMO_PASSWORD}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-amber-700/60 dark:text-amber-400/50 leading-relaxed">
              This account has read-only access to an isolated demo organization and cannot access real customer or billing data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
