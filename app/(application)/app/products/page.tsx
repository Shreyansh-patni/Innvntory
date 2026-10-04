import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { ProductTable } from '@/components/catalog/product-table';
import { getProducts } from '@/lib/catalog/products';
import { getCategories } from '@/lib/catalog/categories';
import { getUserContext } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Products Master Catalog — Innvntory',
  description: 'Manage items, SKUs, barcodes, categories, and pricing across your organization.',
};

export default async function ProductsPage(props: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: 'active' | 'inactive' | 'archived' | 'all';
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const userContext = await getUserContext();

  const orgId = userContext?.organization?.id || '00000000-0000-0000-0000-000000000000';
  const page = parseInt(searchParams.page || '1', 10);
  const search = searchParams.search || '';
  const category = searchParams.category || 'all';
  const status = searchParams.status || 'active';

  const [productsData, categories] = await Promise.all([
    getProducts({
      organizationId: orgId,
      search,
      categoryId: category,
      status,
      page,
      pageSize: 25,
    }),
    getCategories(orgId),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Tenant master catalog of all inventory items, SKUs, and default commercial price rates."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Business', href: '/app/products' },
          { label: 'Products' },
        ]}
      />

      <ProductTable
        products={productsData.products}
        categories={categories}
        totalCount={productsData.totalCount}
        currentPage={productsData.page}
        totalPages={productsData.totalPages}
        searchParam={search}
        categoryParam={category}
        statusParam={status}
      />
    </div>
  );
}
