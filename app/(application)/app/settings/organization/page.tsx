import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { Building2, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Organization Profile & GSTIN Settings — Innvntory',
  description: 'Manage legal entity details, registered business address, GSTIN numbers, and fiscal preferences.',
};

export default function OrganizationSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization Profile"
        description="Legal business registration details, GSTIN state registrations, and fiscal configuration."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Settings', href: '/app/settings/organization' },
          { label: 'Organization' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191A] p-6 space-y-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-neutral-500" />
              Entity Details (Tenant Environment)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-500 block">Organization Name</span>
                <span className="font-mono text-neutral-900 dark:text-neutral-200 mt-1 block">Sahaya Technologies Pvt. Ltd.</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Primary Jurisdiction</span>
                <span className="font-mono text-neutral-900 dark:text-neutral-200 mt-1 block">India (GST Active)</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Base Currency</span>
                <span className="font-mono text-neutral-900 dark:text-neutral-200 mt-1 block">INR (₹)</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Fiscal Year Start</span>
                <span className="font-mono text-neutral-900 dark:text-neutral-200 mt-1 block">April 1</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191A] p-6 space-y-3">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neutral-500" />
              Tenant Isolation
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Every database query and storage asset is isolated under PostgreSQL Row Level Security (RLS) and organization scoping.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
