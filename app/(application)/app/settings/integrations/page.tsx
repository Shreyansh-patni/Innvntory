import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Cpu } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Integrations & Webhooks — Innvntory',
  description: 'Connect e-commerce storefronts, accounting software, logistics partners, and custom webhooks.',
};

export default function IntegrationsSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations & API"
        description="Connect external sales channels (Shopify, Amazon), accounting engines (Tally, Zoho), and logistics partners."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Settings', href: '/app/settings/organization' },
          { label: 'Integrations' },
        ]}
      />

      <div className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191A] p-8">
        <EmptyState
          icon={Cpu}
          title="Integrations hub ready"
          description="E-commerce channels, ERP sync connectors, and developer webhook configurations will be unlocked during platform integration phases."
        />
      </div>
    </div>
  );
}
