import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { PurchaseOrderTable } from '@/components/purchases/purchase-order-table';
import { getPurchaseOrders } from '@/lib/purchases/purchases';
import { getUserContext } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Purchase Orders — Innvntory',
  description: 'Manage procurement vendor orders, delivery schedules, and committed spend.',
};

export default async function PurchaseOrdersPage(props: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const userContext = await getUserContext();
  const orgId = userContext?.organization?.id || '00000000-0000-0000-0000-000000000000';

  const page = parseInt(searchParams.page || '1', 10);
  const search = searchParams.search || '';
  const status = searchParams.status || 'all';

  const data = await getPurchaseOrders({
    organizationId: orgId,
    search,
    status,
    page,
    pageSize: 25,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Orders"
        description="Vendor procurement orders, scheduled consignments, and committed commitments."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Purchases', href: '/app/purchases/orders' },
          { label: 'Purchase Orders' },
        ]}
      />

      <PurchaseOrderTable orders={data.items} />
    </div>
  );
}
