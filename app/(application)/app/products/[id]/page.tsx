import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { ProductForm } from '@/components/catalog/product-form';
import { getProductById } from '@/lib/catalog/products';
import { getCategories } from '@/lib/catalog/categories';
import { getUserContext } from '@/lib/auth/session';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const userContext = await getUserContext();
  const orgId = userContext?.organization?.id || '00000000-0000-0000-0000-000000000000';

  const product = await getProductById(id, orgId);
  return {
    title: product ? `${product.name} — Innvntory` : 'Product Details — Innvntory',
    description: product?.description || 'Product master record',
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const userContext = await getUserContext();
  const orgId = userContext?.organization?.id || '00000000-0000-0000-0000-000000000000';

  const [product, categories] = await Promise.all([
    getProductById(id, orgId),
    getCategories(orgId),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={product.name}
        description={`SKU: ${product.sku} • Last updated on ${new Date(product.updated_at).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}`}
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Products', href: '/app/products' },
          { label: product.sku },
        ]}
      />

      <ProductForm initialData={product} categories={categories} isEditing={true} />
    </div>
  );
}
