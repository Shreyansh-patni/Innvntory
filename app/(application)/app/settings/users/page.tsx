import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { PageToolbar } from '@/components/shared/page-toolbar';
import { DataPlaceholderTable } from '@/components/shared/data-placeholder-table';

export const metadata: Metadata = {
  title: 'Team & User Management — Innvntory',
  description: 'Manage team invitations, user accounts, and seat allocation.',
};

export default function UsersSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & Team Members"
        description="Invite colleagues, assign operational roles, and manage access privileges across warehouse locations."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Settings', href: '/app/settings/organization' },
          { label: 'Users' },
        ]}
      />

      <PageToolbar
        searchPlaceholder="Search team members by name or email..."
        filterOptions={[
          {
            label: 'Role',
            options: [
              { label: 'All Roles', value: 'all' },
              { label: 'Owner / Administrator', value: 'admin' },
              { label: 'Warehouse Manager', value: 'manager' },
              { label: 'Inventory Operator', value: 'operator' },
              { label: 'Accountant / Auditor', value: 'accountant' },
            ],
          },
        ]}
      />

      <DataPlaceholderTable
        columns={[
          { key: 'user', label: 'Member' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          { key: 'warehouseAccess', label: 'Location Access' },
          { key: 'status', label: 'Status' },
        ]}
        emptyTitle="Team management initialized"
        emptyDescription="Invite team members to collaborate in real-time with role-based access control (RBAC)."
      />
    </div>
  );
}
