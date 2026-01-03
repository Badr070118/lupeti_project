import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const FOOTER_COLUMNS = [
  {
    key: 'shop',
    links: [
      { key: 'croquettes', type: 'external', href: '/category/dog' },
      { key: 'accessories', type: 'external', href: '/category/accessories' },
      { key: 'snacks', type: 'external', href: '/category/cat' },
    ],
  },
  {
    key: 'support',
    links: [
      { key: 'contact', type: 'external', href: '/contact' },
      { key: 'shipping', type: 'external', href: '/shipping-returns' },
      { key: 'privacy', type: 'external', href: '/privacy' },
      { key: 'terms', type: 'external', href: '/terms' },
    ],
  },
] as const;

export function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-100 bg-white/60 py-12 backdrop-blur">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-4">
        <div className="space-y-3">
          <p className="text-xl font-extrabold tracking-tight">
            Lupeti<span className="text-rose-500">.</span>
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
                  {link.type === 'route' ? (
                    <Link
                      href={{ pathname: '/shop', query: link.query }}
                      className="text-slate-600 transition hover:text-rose-500"
                    >
                      {t(`columns.${column.key}.links.${link.key}`)}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-slate-600 transition hover:text-rose-500"
                    >
                      {t(`columns.${column.key}.links.${link.key}`)}
                    </a>
                  )}
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
            <p>{t('contact.email')}</p>
            <p>{t('contact.phone')}</p>
            <p className="text-slate-400">
              © {year} Lupeti · {t('contact.rights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
