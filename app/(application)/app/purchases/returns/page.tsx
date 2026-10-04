import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { PurchaseReturnTable } from '@/components/purchases/purchase-return-table';
import { getPurchaseReturns } from '@/lib/purchases/purchases';
import { getUserContext } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Purchase Returns & Debit Notes — Innvntory',
  description: 'Supplier debit notes, defect dispatches, and vendor return tracking.',
};

export default async function PurchaseReturnsPage(props: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const userContext = await getUserContext();
  const orgId = userContext?.organization?.id || '00000000-0000-0000-0000-000000000000';
  const page = parseInt(searchParams.page || '1', 10);

  const data = await getPurchaseReturns({
    organizationId: orgId,
    page,
    pageSize: 25,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Returns"
        description="Supplier returns, defective item outward dispatches, and debit note reconciliations."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Purchases', href: '/app/purchases/returns' },
          { label: 'Returns' },
        ]}
      />

      <PurchaseReturnTable returns={data.items} />
    </div>
  );
}
