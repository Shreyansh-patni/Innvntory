import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { TransferTable } from '@/components/inventory/transfer-table';
import { getInventoryTransfers } from '@/lib/inventory/inventory';
import { getUserContext } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Inventory Transfers — Innvntory',
  description: 'Inter-facility inventory stock transfers and dispatch tracking.',
};

export default async function TransfersPage(props: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const userContext = await getUserContext();
  const orgId = userContext?.organization?.id || '00000000-0000-0000-0000-000000000000';
  const page = parseInt(searchParams.page || '1', 10);

  const data = await getInventoryTransfers({
    organizationId: orgId,
    page,
    pageSize: 25,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inter-Facility Transfers"
        description="Transfer stock between fulfillment centers, retail outlets, and regional depots."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Inventory', href: '/app/inventory/transfers' },
          { label: 'Transfers' },
        ]}
      />

      <TransferTable transfers={data.items} />
    </div>
  );
}
