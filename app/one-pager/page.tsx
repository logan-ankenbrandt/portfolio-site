import type { Metadata } from 'next';

import { PrintButton } from '@/components/print-button';
import { getContent, image, projectUrl } from '@/lib/content';
import { coverAlt } from '@/lib/format';
import { pageMetadata } from '@/lib/metadata';
import { notAffiliatedFor, site } from '@/lib/site';

/** A URL as text that may break only after a slash, so it never splits a word on a phone. */
function BreakableUrl({ text }: { text: string }) {
  const parts = text.split('/');
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 ? (
            <>
              /<wbr />
            </>
          ) : null}
        </span>
      ))}
    </>
  );
}

export const metadata: Metadata = pageMetadata({
  title: 'One-page summary',
  description: `${site.name}: each project on one printable page, with its link as text.`,
  path: '/one-pager/',
});

const host = site.url.replace('https://', '');

export default function OnePager() {
  const { projects } = getContent();
  return (
    <main id="main" className="mx-auto max-w-[8.5in] px-4 py-10 sm:px-8 print:max-w-none print:p-0">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <p className="text-sm text-muted">Formatted for US Letter paper.</p>
        <PrintButton />
      </div>

      <header className="border-b-2 border-ink pb-4">
        <h1 className="text-[32px] leading-tight font-semibold tracking-tight print:text-[24pt]">{site.name}</h1>
        <p className="mt-2 leading-snug print:text-[11pt]">{site.positioning}</p>
        <p className="mt-2 font-mono text-[13px] [overflow-wrap:anywhere] text-muted print:text-[9pt]">
          {host} &middot; github.com/logan-ankenbrandt
        </p>
      </header>

      <ol className="mt-6 space-y-6 print:mt-5 print:space-y-5">
        {projects.map((project) => {
          const p = project.portfolio;
          const cover = image(project, p.cover, coverAlt(p));
          return (
            <li key={p.slug} className="grid break-inside-avoid gap-4 sm:grid-cols-[2.3in_1fr] sm:gap-5 print:grid-cols-[2.1in_1fr]">
              <img
                src={cover.src}
                width={cover.width}
                height={cover.height}
                alt={cover.alt}
                className="block aspect-video h-auto w-full border border-rule-strong bg-white object-cover"
              />
              <div className="min-w-0">
                <h2 className="text-lg leading-snug font-semibold print:text-[13pt]">{p.title}</h2>
                <p className="mt-1 text-[15px] leading-snug print:text-[10.5pt]">{p.oneLiner}</p>
                <p className="mt-1 text-[15px] leading-snug text-muted print:text-[10pt]">Shows: {p.skills.join(', ')}</p>
                <p className="mt-2 font-mono text-[13px] leading-snug [overflow-wrap:anywhere] print:text-[9pt]">
                  <BreakableUrl text={`${host}${projectUrl(p.slug)}`} />
                </p>
                <p className="font-mono text-[13px] leading-snug [overflow-wrap:anywhere] text-muted print:text-[9pt]">
                  <BreakableUrl text={p.repo.replace('https://', '')} />
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <footer className="mt-8 border-t border-rule pt-3 text-[13px] leading-snug text-muted print:text-[9pt]">
        <p>{notAffiliatedFor(projects.flatMap((project) => project.portfolio.credits))}</p>
      </footer>
    </main>
  );
}
