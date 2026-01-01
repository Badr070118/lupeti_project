import { getTranslations } from 'next-intl/server';
import { AdminShell } from '@/features/admin/admin-shell';
import { AdminDashboard } from '@/features/admin/admin-dashboard';

type AdminPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin.dashboard' });

  return (
    <AdminShell title={t('title')} description={t('subtitle')}>
      <AdminDashboard />
    </AdminShell>
  );
}
