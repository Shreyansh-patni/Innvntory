import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Roles & Permissions — Innvntory',
  description: 'Configure Role-Based Access Control (RBAC) policies and operational permissions.',
};

export default function RolesSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Fine-grained Role-Based Access Control (RBAC) governing inventory modifications, order approvals, and financial views."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Settings', href: '/app/settings/organization' },
          { label: 'Roles' },
        ]}
      />

      <div className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191A] p-8">
        <EmptyState
          icon={ShieldAlert}
          title="RBAC Policy Engine"
          description="Default system roles (Organization Owner, Warehouse Manager, Operations Clerk, Read-only Auditor) are active. Custom permission matrices will be editable in a future release."
        />
      </div>
    </div>
  );
}
