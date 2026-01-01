import { getTranslations } from 'next-intl/server';
import { AdminShell } from '@/features/admin/admin-shell';
import { AdminProductManager } from '@/features/admin/admin-product-manager';

type AdminProductsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminProductsPage({ params }: AdminProductsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin.products' });
  return (
    <AdminShell title={t('title')} description={t('subtitle')}>
      <AdminProductManager />
    </AdminShell>
  );
}
