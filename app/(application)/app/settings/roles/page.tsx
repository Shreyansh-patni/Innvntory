import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { Shield, Check, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Roles & Permissions — Innvntory',
  description: 'Configure Role-Based Access Control (RBAC) policies and operational permissions.',
};

const SYSTEM_ROLES = [
  {
    key: 'owner',
    title: 'Organization Owner / Administrator',
    description: 'Full unrestricted governance across all organizational records, financial accounts, team settings, and database exports.',
    level: 'Full Governance',
    badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    permissions: [
      'Catalog & Pricing Management',
      'Inventory Stock & Multi-Hub Transfers',
      'Purchase Orders & Goods Receipts',
      'Sales Invoicing & Customer Payments',
      'Financial Profit & Loss Reports',
      'Organization & Team Administration',
    ],
  },
  {
    key: 'manager',
    title: 'Warehouse Operations Manager',
    description: 'Operational authority over stock inward receipts, inventory transfers, stock adjustments, and goods dispatch.',
    level: 'Operations Authority',
    badgeClass: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    permissions: [
      'Catalog & SKU Reading',
      'Inventory Stock & Multi-Hub Transfers',
      'Purchase Goods Receipts (GRNs)',
      'Sales Order Fulfillment',
      'Inventory Valuation & Aging Reports',
    ],
  },
  {
    key: 'operator',
    title: 'Sales & Purchasing Operator',
    description: 'Handles day-to-day transaction creation, order booking, and invoice generation.',
    level: 'Transactional Execution',
    badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    permissions: [
      'Catalog Item Lookup',
      'Sales Order & Invoice Generation',
      'Purchase Order Drafting',
      'Payment Record Logging',
    ],
  },
  {
    key: 'viewer',
    title: 'Auditor / Read-Only Viewer',
    description: 'Public demo and compliance auditor access with read-only inspection capabilities.',
    level: 'Read-Only Audit',
    badgeClass: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700',
    permissions: [
      'Read-Only Catalog & Inventory View',
      'Read-Only Order & Invoice Inspection',
      'Financial & Inventory Report Access',
    ],
  },
];

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SYSTEM_ROLES.map((role) => (
          <div
            key={role.key}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191A] p-6 space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-neutral-500" />
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {role.title}
                  </h3>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                  {role.description}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border shrink-0 ${role.badgeClass}`}
              >
                {role.level}
              </span>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:divide-neutral-800 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                Included Capabilities
              </span>
              <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                {role.permissions.map((perm) => (
                  <li key={perm} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191A] p-6 flex items-start gap-4">
        <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 shrink-0">
          <Lock className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            System Policy Hardening
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
            All operations require server-side session authentication and organization membership validation.
            Public demo sessions are strictly confined to the <code className="font-mono text-neutral-800 dark:text-neutral-200">viewer</code> role with read-only capabilities.
          </p>
        </div>
      </div>
    </div>
  );
}
