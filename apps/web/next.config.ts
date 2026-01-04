import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const isAbsoluteUrl = /^https?:\/\//.test(apiUrl);
const scriptSrc = ["'self'", "'unsafe-inline'"];
if (process.env.NODE_ENV !== 'production') {
  scriptSrc.push("'unsafe-eval'");
}
const connectSrc = ["'self'", 'ws://localhost:3001', 'ws://127.0.0.1:3001'];
if (isAbsoluteUrl) {
  connectSrc.push(apiUrl);
}

const ContentSecurityPolicy = [
  "default-src 'self'",
  `script-src ${scriptSrc.join(' ')}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' https: data:",
  "font-src 'self' https: data:",
  "frame-src 'self' https://www.paytr.com",
  `connect-src ${connectSrc.join(' ')}`.trim(),
]
  .map((directive) => directive.replace(/\s{2,}/g, ' ').trim())
  .join('; ');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy,
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
