import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { Shield, KeyRound, Lock, History } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Security & Audit Logs — Innvntory',
  description: 'Manage authentication policies, session management, multi-factor authentication, and security audit logs.',
};

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Security & Access Logs"
        description="Configure account security policies, multi-factor authentication (MFA), active sessions, and audit trails."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Settings', href: '/app/settings/organization' },
          { label: 'Security' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191A] p-6 space-y-3">
          <div className="w-8 h-8 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
            <KeyRound className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Multi-Factor Auth (MFA)</h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Enforce TOTP authenticator app verification across all organization administrative accounts.
          </p>
        </div>

        <div className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191A] p-6 space-y-3">
          <div className="w-8 h-8 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
            <Lock className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Session Controls</h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Automated session timeout, IP restriction policies, and centralized remote session termination.
          </p>
        </div>

        <div className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191A] p-6 space-y-3">
          <div className="w-8 h-8 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
            <History className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Immutable Audit Trail</h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Every inventory adjustment, price change, and login event is logged with cryptographic timestamps.
          </p>
        </div>
      </div>

      <div className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191A] p-6 space-y-4">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Platform Security Compliance
        </h3>
        <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
          <p>
            • All database operations enforce tenant isolation using PostgreSQL Row Level Security (RLS).
          </p>
          <p>
            • Zero cross-tenant data leakage guarantees at the database engine level.
          </p>
          <p>
            • Authentication sessions backed by cryptographically signed JWT tokens with short expiration lifespans.
          </p>
        </div>
      </div>
    </div>
  );
}
