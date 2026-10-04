import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { CreditCard, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Subscription & Billing — Innvntory',
  description: 'Manage your Innvntory subscription plan, seat count, and GST tax invoices.',
};

export default function BillingSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription & Billing"
        description="Manage your enterprise plan, add-on warehouse locations, user seat quotas, and payment methods."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Settings', href: '/app/settings/organization' },
          { label: 'Billing' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191A] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Current Plan</span>
                <h3 className="text-lg font-display font-medium text-neutral-900 dark:text-neutral-100 mt-1">
                  Growth Tier (Preview Environment)
                </h3>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </div>

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-neutral-500 block">Warehouses Included</span>
                <span className="font-mono text-neutral-900 dark:text-neutral-200 mt-1 block">Up to 3 locations</span>
              </div>
              <div>
                <span className="text-neutral-500 block">User Seats</span>
                <span className="font-mono text-neutral-900 dark:text-neutral-200 mt-1 block">10 team members</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Monthly SKUs</span>
                <span className="font-mono text-neutral-900 dark:text-neutral-200 mt-1 block">10,000 items</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191A] p-6 space-y-3">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-neutral-500" />
              Billing Provider
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Polar / Razorpay billing automation will manage subscription renewal, e-mandates, and GST tax invoice generation in subsequent phases.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-neutral-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>GST compliant invoicing ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
