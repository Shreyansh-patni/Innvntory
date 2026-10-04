import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { PurchaseReceiptTable } from '@/components/purchases/purchase-receipt-table';
import { getPurchaseReceipts } from '@/lib/purchases/purchases';
import { getUserContext } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Goods Receipts (GRN) — Innvntory',
  description: 'Inbound shipment verification, dock receipts, and warehouse inward logging.',
};

export default async function PurchaseReceiptsPage(props: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const userContext = await getUserContext();
  const orgId = userContext?.organization?.id || '00000000-0000-0000-0000-000000000000';
  const page = parseInt(searchParams.page || '1', 10);

  const data = await getPurchaseReceipts({
    organizationId: orgId,
    page,
    pageSize: 25,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Goods Receipts (GRN)"
        description="Warehouse inward logs, consignment inspections, and stock balance additions."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Purchases', href: '/app/purchases/receipts' },
          { label: 'Receipts' },
        ]}
      />

      <PurchaseReceiptTable receipts={data.items} />
    </div>
  );
}
