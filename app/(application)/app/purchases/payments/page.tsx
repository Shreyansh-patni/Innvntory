import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { PurchasePaymentTable } from '@/components/purchases/purchase-payment-table';
import { getPurchasePayments } from '@/lib/purchases/purchases';
import { getUserContext } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Purchase Payments & Payables — Innvntory',
  description: 'Supplier disbursements, vendor bill settlements, and NEFT remittance references.',
};

export default async function PurchasePaymentsPage(props: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const userContext = await getUserContext();
  const orgId = userContext?.organization?.id || '00000000-0000-0000-0000-000000000000';
  const page = parseInt(searchParams.page || '1', 10);

  const data = await getPurchasePayments({
    organizationId: orgId,
    page,
    pageSize: 25,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Payments"
        description="Supplier payment disbursements, remittance tracking, and account clearance."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Purchases', href: '/app/purchases/payments' },
          { label: 'Payments' },
        ]}
      />

      <PurchasePaymentTable payments={data.items} />
    </div>
  );
}
