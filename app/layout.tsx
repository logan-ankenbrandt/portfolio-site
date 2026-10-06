import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { FixtureBanner } from '@/components/fixture-banner';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getContent } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
import { site } from '@/lib/site';

import './globals.css';

export const metadata: Metadata = {
  ...pageMetadata({ description: site.description, path: '/' }),
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  authors: [{ name: site.name, url: site.github }],
};

export const viewport: Viewport = {
  themeColor: '#fbfbf8',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const { mode } = getContent();
  return (
    <html lang="en">
      <body className="min-h-screen text-base leading-relaxed sm:text-[17px]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-paper focus:px-3 focus:py-2 focus:text-accent"
        >
          Skip to content
        </a>
        {mode === 'fixtures' ? <FixtureBanner /> : null}
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
