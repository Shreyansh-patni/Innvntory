import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { getUserContext } from '@/lib/auth/session';
import { UserCheck, Shield, Mail, Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Team & User Management — Innvntory',
  description: 'Manage team invitations, user accounts, and seat allocation.',
};

export default async function UsersSettingsPage() {
  const userContext = await getUserContext();
  const userEmail = userContext?.user?.email || 'demo@innvntory.com';
  const userName = userContext?.user?.fullName || (userEmail.startsWith('demo') ? 'Demo Workspace User' : 'Workspace Admin');
  const orgName = userContext?.organization?.name || 'Sahaya Technologies';
  const primaryRole = userContext?.roles?.[0] || 'viewer';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & Team Members"
        description="Review organization team members, assigned operational roles, and warehouse location access privileges."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Settings', href: '/app/settings/organization' },
          { label: 'Users' },
        ]}
      />

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191A] overflow-hidden">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-neutral-500" />
            <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">{orgName}</span>
            <span className="text-[11px] font-mono text-neutral-500">· 1 Active Member</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px]">Member</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px]">Email</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px]">Role</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px]">Location Access</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              <tr className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-xs">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-medium text-neutral-900 dark:text-neutral-100 block">{userName}</span>
                      <span className="text-[10px] text-neutral-400">Current Session</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-mono text-neutral-600 dark:text-neutral-300">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{userEmail}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                    <Shield className="w-2.5 h-2.5" />
                    {primaryRole}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-neutral-600 dark:text-neutral-400 font-mono text-[11px]">
                  All Warehouses (Global)
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <UserCheck className="w-2.5 h-2.5" />
                    Active
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
