import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { WarehouseTable } from '@/components/inventory/warehouse-table';
import { getWarehouses } from '@/lib/inventory/inventory';
import { getUserContext } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Warehouses & Locations — Innvntory',
  description: 'Logistics hubs, fulfillment centers, and regional depot locations.',
};

export default async function WarehousesPage() {
  const userContext = await getUserContext();
  const orgId = userContext?.organization?.id || '00000000-0000-0000-0000-000000000000';
  const warehouses = await getWarehouses(orgId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warehouses & Locations"
        description="Active logistics hubs, fulfillment depots, and physical storage locations."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Inventory', href: '/app/inventory/warehouses' },
          { label: 'Warehouses' },
        ]}
      />

      <WarehouseTable warehouses={warehouses} />
    </div>
  );
}
