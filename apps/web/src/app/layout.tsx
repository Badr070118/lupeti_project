import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { buildMetadata } from '@/lib/metadata';
import { ScrollProgress } from '@/components/shared/ScrollProgress';
import { HotToaster } from '@/components/shared/HotToaster';
import { QuickView } from '@/components/products/QuickView';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = buildMetadata({
  title: 'Lupeti | Evcil hayvan ürünleri',
  description:
    'Kedi ve köpekler için mama, ödül maması ve aksesuarları Lupeti’de keşfedin.',
  path: '/',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-theme="light" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ScrollProgress />
        {children}
        <QuickView />
        <HotToaster />
      </body>
    </html>
  );
}
