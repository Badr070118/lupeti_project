import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { settingsService } from '@/services/settings.service';

const FOOTER_COLUMNS = [
  {
    key: 'shop',
    links: [
      { key: 'croquettes', href: '/category/dog' },
      { key: 'accessories', href: '/category/accessories' },
      { key: 'snacks', href: '/category/cat' },
    ],
  },
  {
    key: 'support',
    links: [
      { key: 'contact', href: '/contact' },
      { key: 'shipping', href: '/shipping-returns' },
      { key: 'privacy', href: '/privacy' },
      { key: 'terms', href: '/terms' },
    ],
  },
] as const;

async function getFooterSettings() {
  try {
    const payload = await settingsService.getPublic();
    return payload.store;
  } catch {
    return null;
  }
}

export async function Footer() {
  const t = await getTranslations('footer');
  const store = await getFooterSettings();
  const year = new Date().getFullYear();

  const storeName = store?.storeName?.trim() || 'Lupeti';
  const supportEmail = store?.supportEmail?.trim() || t('contact.email');
  const supportPhone = store?.supportPhone?.trim() || t('contact.phone');
  const supportAddress = store?.supportAddress?.trim() || '';

  return (
    <footer className="border-t border-slate-100 bg-white/60 py-12 backdrop-blur">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-4">
        <div className="space-y-3">
          <p className="text-xl font-extrabold tracking-tight">
            {storeName}
            <span className="text-rose-500">.</span>
          </p>
          <p className="text-sm text-slate-500">{t('tagline')}</p>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.key}>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              {t(`columns.${column.key}.title`)}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {column.links.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-slate-600 transition hover:text-rose-500"
                  >
                    {t(`columns.${column.key}.links.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            {t('contact.title')}
          </p>
          <div className="mt-3 space-y-1 text-sm text-slate-600">
            <p>{supportEmail}</p>
            <p>{supportPhone}</p>
            {supportAddress ? <p>{supportAddress}</p> : null}
            <p className="text-slate-400">
              (c) {year} {storeName} - {t('contact.rights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
