import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { SalesOrderTable } from '@/components/sales/sales-order-table';
import { getSalesOrders } from '@/lib/sales/sales';
import { getUserContext } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Sales Orders — Innvntory',
  description: 'Manage sales orders, order fulfillment, dispatch statuses, and backorders.',
};

export default async function SalesOrdersPage(props: {
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

  const data = await getSalesOrders({
    organizationId: orgId,
    search,
    status,
    page,
    pageSize: 25,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Orders"
        description="Customer order fulfillment, stock reservation, and dispatch management."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Sales', href: '/app/sales/orders' },
          { label: 'Orders' },
        ]}
      />

      <SalesOrderTable orders={data.items} />
    </div>
  );
}
