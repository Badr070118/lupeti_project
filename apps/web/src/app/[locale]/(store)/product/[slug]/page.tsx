import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { productService } from '@/services/product.service';
import { ProductDetails } from '@/features/products/components/product-details';
import { buildMetadata } from '@/lib/metadata';
import { env } from '@/lib/config';

type RouteParams = { locale: string; slug: string };

interface ProductPageProps {
  params: Promise<RouteParams> | RouteParams;
}

async function resolveParams(params: ProductPageProps['params']): Promise<RouteParams> {
  return await params;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug, locale } = await resolveParams(params);
  const product = await productService.get(slug, { revalidate: 300 });
  if (!product) {
    return buildMetadata({
      title: `Product unavailable | ${env.appName}`,
      description: 'This recipe is currently unavailable.',
      path: `/${locale}/product/${slug}`,
    });
  }
  const hero = product.images?.[0]?.url;
  return buildMetadata({
    title: `${product.title} | ${env.appName}`,
    description: product.description,
    path: `/${locale}/product/${product.slug}`,
    images: hero ? [hero] : undefined,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await resolveParams(params);
  const product = await productService.get(slug, { revalidate: 300 });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ProductDetails product={product} />
    </div>
  );
}
