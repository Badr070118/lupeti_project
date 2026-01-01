import { getTranslations } from 'next-intl/server';
import { AdminShell } from '@/features/admin/admin-shell';
import { AdminUserManager } from '@/features/admin/admin-user-manager';

type AdminUsersPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminUsersPage({ params }: AdminUsersPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin.users' });
  return (
    <AdminShell title={t('title')} description={t('subtitle')}>
      <AdminUserManager />
    </AdminShell>
  );
}
