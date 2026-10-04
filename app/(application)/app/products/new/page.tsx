import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { ProductForm } from '@/components/catalog/product-form';
import { getCategories } from '@/lib/catalog/categories';
import { getUserContext } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Create Product — Innvntory',
  description: 'Add a new product or inventory SKU to the master catalog.',
};

export default async function NewProductPage() {
  const userContext = await getUserContext();
  const orgId = userContext?.organization?.id || '00000000-0000-0000-0000-000000000000';

  const categories = await getCategories(orgId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Product"
        description="Define a new inventory catalog item with unique SKU, optional barcode, and base pricing."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Products', href: '/app/products' },
          { label: 'New Product' },
        ]}
      />

      <ProductForm categories={categories} isEditing={false} />
    </div>
  );
}
