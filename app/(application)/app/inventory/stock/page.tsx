import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { StockTable } from '@/components/inventory/stock-table';
import { getStockBalances, getWarehouses } from '@/lib/inventory/inventory';
import { getUserContext } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Stock Balances — Innvntory',
  description: 'Multi-facility real-time on-hand, reserved, available inventory, and reorder levels.',
};

export default async function StockPage(props: {
  searchParams: Promise<{
    search?: string;
    warehouse?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const userContext = await getUserContext();
  const orgId = userContext?.organization?.id || '00000000-0000-0000-0000-000000000000';

  const page = parseInt(searchParams.page || '1', 10);
  const search = searchParams.search || '';
  const warehouse = searchParams.warehouse || 'all';

  const [stockData, warehouses] = await Promise.all([
    getStockBalances({
      organizationId: orgId,
      search,
      warehouseId: warehouse,
      page,
      pageSize: 25,
    }),
    getWarehouses(orgId),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Balances"
        description="Multi-warehouse stock levels, reserved quantities, and safety threshold triggers."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Inventory', href: '/app/inventory/stock' },
          { label: 'Stock' },
        ]}
      />

      <StockTable
        items={stockData.items}
        warehouses={warehouses}
        totalCount={stockData.totalCount}
        currentPage={stockData.page}
        totalPages={stockData.totalPages}
        searchParam={search}
        warehouseParam={warehouse}
      />
    </div>
  );
}
