import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { productService } from '@/services/product.service';
import { ProductDetails } from '@/features/products/components/product-details';
import { buildMetadata } from '@/lib/metadata';
import { env } from '@/lib/config';

interface ProductPageProps {
  params: { locale: string; slug: string };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await productService.get(params.slug, { revalidate: 300 });
  if (!product) {
    return buildMetadata({
      title: `Product unavailable | ${env.appName}`,
      description: 'This recipe is currently unavailable.',
      path: `/${params.locale}/product/${params.slug}`,
    });
  }
  const hero = product.images?.[0]?.url;
  return buildMetadata({
    title: `${product.title} | ${env.appName}`,
    description: product.description,
    path: `/${params.locale}/product/${product.slug}`,
    images: hero ? [hero] : undefined,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await productService.get(params.slug, { revalidate: 300 });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ProductDetails product={product} />
    </div>
  );
}
