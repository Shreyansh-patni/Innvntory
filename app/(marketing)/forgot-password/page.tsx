import type { Metadata } from 'next';
import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const metadata: Metadata = {
  title: 'Forgot Password — Innvntory',
  description: 'Reset your Innvntory account password.',
};

export default function ForgotPasswordPage() {
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
            Reset your password
          </h1>
          <p className="mt-1.5 text-xs text-text-secondary">
            Enter your work email address and we will send you instructions to reset your password.
          </p>
        </div>

        {/* Interactive Forgot Password Form */}
        <ForgotPasswordForm />

        {/* Switch to Login */}
        <div className="text-center text-xs text-text-secondary pt-2 border-t border-border-subtle">
          Remembered your credentials?{' '}
          <Link
            href="/login"
            className="font-semibold text-text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
