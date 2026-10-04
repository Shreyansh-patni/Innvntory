import type { Metadata } from 'next';
import Link from 'next/link';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const metadata: Metadata = {
  title: 'Set New Password — Innvntory',
  description: 'Choose a new password for your Innvntory account.',
};

export default function ResetPasswordPage() {
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
            Set a new password
          </h1>
          <p className="mt-1.5 text-xs text-text-secondary">
            Ensure your account remains secure with a strong password.
          </p>
        </div>

        {/* Interactive Reset Password Form */}
        <ResetPasswordForm />
      </div>
    </div>
  );
}
