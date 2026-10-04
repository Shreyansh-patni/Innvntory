import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { SalesReturnTable } from '@/components/sales/sales-return-table';
import { getSalesReturns } from '@/lib/sales/sales';
import { getUserContext } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Sales Returns & Credit Notes — Innvntory',
  description: 'Customer returns, inventory restocks, and refund credits.',
};

export default async function SalesReturnsPage(props: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const userContext = await getUserContext();
  const orgId = userContext?.organization?.id || '00000000-0000-0000-0000-000000000000';
  const page = parseInt(searchParams.page || '1', 10);

  const data = await getSalesReturns({
    organizationId: orgId,
    page,
    pageSize: 25,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Returns"
        description="Customer RMA exchanges, return restocks, and credit note adjustments."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Sales', href: '/app/sales/returns' },
          { label: 'Returns' },
        ]}
      />

      <SalesReturnTable returns={data.items} />
    </div>
  );
}
