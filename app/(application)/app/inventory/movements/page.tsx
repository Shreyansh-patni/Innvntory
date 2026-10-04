import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { MovementTable } from '@/components/inventory/movement-table';
import { getInventoryMovements } from '@/lib/inventory/inventory';
import { getUserContext } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Stock Movement Ledger — Innvntory',
  description: 'Immutable ledger of all stock receipts, dispatches, transfers, and reconciliations.',
};

export default async function MovementsPage(props: {
  searchParams: Promise<{
    search?: string;
    type?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const userContext = await getUserContext();
  const orgId = userContext?.organization?.id || '00000000-0000-0000-0000-000000000000';

  const page = parseInt(searchParams.page || '1', 10);
  const search = searchParams.search || '';
  const type = searchParams.type || 'all';

  const data = await getInventoryMovements({
    organizationId: orgId,
    search,
    movementType: type,
    page,
    pageSize: 50,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Movement Ledger"
        description="Immutable chronological ledger of physical stock entries, dispatches, and transfers."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Inventory', href: '/app/inventory/movements' },
          { label: 'Movements' },
        ]}
      />

      <MovementTable movements={data.items} />
    </div>
  );
}
