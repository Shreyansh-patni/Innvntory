import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { InvoiceTable } from '@/components/sales/invoice-table';
import { getInvoices } from '@/lib/sales/sales';
import { getUserContext } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Invoices & Billing — Innvntory',
  description: 'GST-compliant tax invoices, credit terms, and payment reconciliation.',
};

export default async function InvoicesPage(props: {
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

  const data = await getInvoices({
    organizationId: orgId,
    search,
    status,
    page,
    pageSize: 25,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="GST Tax Invoices"
        description="Commercial sales invoices, GST computations, and receivable statuses."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Sales', href: '/app/sales/invoices' },
          { label: 'Invoices' },
        ]}
      />

      <InvoiceTable invoices={data.items} />
    </div>
  );
}
