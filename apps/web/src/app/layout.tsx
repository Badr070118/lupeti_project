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
  title: 'Nourri | Conscious nutrition for pets',
  description:
    'Nourri is a multilingual pet commerce experience for croquettes, accessories, and playful rituals.',
  path: '/',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
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
