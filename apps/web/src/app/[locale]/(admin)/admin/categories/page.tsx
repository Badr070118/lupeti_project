import { getTranslations } from 'next-intl/server';
import { AdminShell } from '@/features/admin/admin-shell';
import { AdminCategoryManager } from '@/features/admin/admin-category-manager';

type AdminCategoriesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminCategoriesPage({ params }: AdminCategoriesPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin.categories' });
  return (
    <AdminShell title={t('title')} description={t('subtitle')}>
      <AdminCategoryManager />
    </AdminShell>
  );
}
