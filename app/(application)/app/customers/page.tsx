import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { CustomerTable } from '@/components/customers/customer-table';
import { getCustomers } from '@/lib/business/customers';
import { getUserContext } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Customers Directory — Innvntory',
  description: 'Manage institutional retail accounts, credit limits, and commercial customer profiles.',
};

export default async function CustomersPage(props: {
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

  const data = await getCustomers({
    organizationId: orgId,
    search,
    status,
    page,
    pageSize: 25,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Institutional buyer entities, retail network accounts, and credit profiles."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Business', href: '/app/customers' },
          { label: 'Customers' },
        ]}
      />

      <CustomerTable
        customers={data.customers}
        totalCount={data.totalCount}
        currentPage={data.page}
        totalPages={data.totalPages}
        searchParam={search}
        statusParam={status}
      />
    </div>
  );
}
