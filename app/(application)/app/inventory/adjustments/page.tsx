import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { AdjustmentTable } from '@/components/inventory/adjustment-table';
import { getInventoryAdjustments } from '@/lib/inventory/inventory';
import { getUserContext } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Inventory Adjustments — Innvntory',
  description: 'Cycle count reconciliations, shrinkage write-offs, and stock adjustments.',
};

export default async function AdjustmentsPage(props: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const userContext = await getUserContext();
  const orgId = userContext?.organization?.id || '00000000-0000-0000-0000-000000000000';
  const page = parseInt(searchParams.page || '1', 10);

  const data = await getInventoryAdjustments({
    organizationId: orgId,
    page,
    pageSize: 25,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Adjustments"
        description="Audit-backed cycle count corrections, damages, and manual stock reconciliations."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Inventory', href: '/app/inventory/adjustments' },
          { label: 'Adjustments' },
        ]}
      />

      <AdjustmentTable adjustments={data.items} />
    </div>
  );
}
