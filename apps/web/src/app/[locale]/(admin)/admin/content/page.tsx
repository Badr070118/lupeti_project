import { getTranslations } from 'next-intl/server';
import { AdminShell } from '@/features/admin/admin-shell';
import { AdminContentManager } from '@/features/admin/admin-content-manager';

type AdminContentPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminContentPage({ params }: AdminContentPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin.content' });
  return (
    <AdminShell title={t('title')} description={t('subtitle')}>
      <AdminContentManager />
    </AdminShell>
  );
}
