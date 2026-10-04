import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

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

  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border-subtle bg-surface p-8 sm:p-10 shadow-sm">
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
    </div>
  );
}
