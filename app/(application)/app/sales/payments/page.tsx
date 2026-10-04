import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { SalesPaymentTable } from '@/components/sales/sales-payment-table';
import { getSalesPayments } from '@/lib/sales/sales';
import { getUserContext } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Sales Receipts & Payments — Innvntory',
  description: 'Customer payment settlements, UTR tracking, and account credits.',
};

export default async function SalesPaymentsPage(props: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const userContext = await getUserContext();
  const orgId = userContext?.organization?.id || '00000000-0000-0000-0000-000000000000';
  const page = parseInt(searchParams.page || '1', 10);

  const data = await getSalesPayments({
    organizationId: orgId,
    page,
    pageSize: 25,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Payments"
        description="Reconciled customer collections, NEFT/UPI settlements, and bank references."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Sales', href: '/app/sales/payments' },
          { label: 'Payments' },
        ]}
      />

      <SalesPaymentTable payments={data.items} />
    </div>
  );
}
