import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { SupplierTable } from '@/components/suppliers/supplier-table';
import { getSuppliers } from '@/lib/business/suppliers';
import { getUserContext } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Suppliers Directory — Innvntory',
  description: 'Manage verified manufacturers, distributors, and institutional vendor records.',
};

export default async function SuppliersPage(props: {
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

  const data = await getSuppliers({
    organizationId: orgId,
    search,
    status,
    page,
    pageSize: 25,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        description="Authorized procurement vendors, mills, component fabricators, and payment terms."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Business', href: '/app/suppliers' },
          { label: 'Suppliers' },
        ]}
      />

      <SupplierTable
        suppliers={data.suppliers}
        totalCount={data.totalCount}
        currentPage={data.page}
        totalPages={data.totalPages}
        searchParam={search}
        statusParam={status}
      />
    </div>
  );
}
