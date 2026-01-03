import { getTranslations } from 'next-intl/server';
import { AdminShell } from '@/features/admin/admin-shell';
import { AdminOrderManager } from '@/features/admin/admin-order-manager';

type AdminOrdersPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminOrdersPage({ params }: AdminOrdersPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin.orders' });
  return (
    <AdminShell title={t('title')} description={t('subtitle')}>
      <AdminOrderManager />
    </AdminShell>
  );
}
