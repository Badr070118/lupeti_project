import { getTranslations } from 'next-intl/server';
import { AdminShell } from '@/features/admin/admin-shell';
import { AdminSettingsManager } from '@/features/admin/admin-settings-manager';

type AdminSettingsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminSettingsPage({ params }: AdminSettingsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin.settings' });
  return (
    <AdminShell title={t('title')} description={t('subtitle')}>
      <AdminSettingsManager />
    </AdminShell>
  );
}
