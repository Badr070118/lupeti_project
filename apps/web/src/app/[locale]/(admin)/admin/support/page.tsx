import { getTranslations } from 'next-intl/server';
import { AdminShell } from '@/features/admin/admin-shell';
import { AdminSupportManager } from '@/features/admin/admin-support-manager';

type AdminSupportPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminSupportPage({ params }: AdminSupportPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin.support' });
  return (
    <AdminShell title={t('title')} description={t('subtitle')}>
      <AdminSupportManager />
    </AdminShell>
  );
}
