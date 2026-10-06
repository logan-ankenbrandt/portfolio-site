import type { Metadata } from 'next';

import { site } from './site';

// One Open Graph card for every page (drawn by scripts/make-brand-assets.mjs).
// Each page sets openGraph and twitter in full, because a page's openGraph replaces the layout's.
export const ogImage = {
  url: '/og.png',
  width: 1200,
  height: 630,
  alt: 'Logan Ankenbrandt, slide reconstruction portfolio: a pie chart slide rebuilt as sorted bars.',
};

export function pageMetadata({ title, description, path, type = 'website' }: {
  title?: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
}): Metadata {
  const fullTitle = title ? `${title} | ${site.name}` : site.title;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { type, siteName: site.name, locale: 'en_US', title: fullTitle, description, url: path, images: [ogImage] },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [{ url: ogImage.url, alt: ogImage.alt }] },
  };
}
