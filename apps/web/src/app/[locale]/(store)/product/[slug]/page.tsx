import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { productService } from '@/services/product.service';
import { ProductDetails } from '@/features/products/components/product-details';
import { buildMetadata } from '@/lib/metadata';
import { env } from '@/lib/config';
import { ProductGrid } from '@/features/products/components/product-grid';
import { getTranslations } from 'next-intl/server';

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
  const product = await productService.get(slug);
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
  const product = await productService.get(slug);

  if (!product) {
    notFound();
  }

  const [related, t] = await Promise.all([
    productService.list({ category: product.category.slug, limit: 4, sort: 'newest' }),
    getTranslations('product'),
  ]);

  const relatedProducts = related.data
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <ProductDetails product={product} />
      {relatedProducts.length ? (
        <section className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-400">
              {t('related.eyebrow', { default: 'Keep browsing' })}
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              {t('related.title', { default: 'Related products' })}
            </h2>
          </div>
          <ProductGrid products={relatedProducts} />
        </section>
      ) : null}
    </div>
  );
}
