import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { DownloadList } from '@/components/download-list';
import { ItemBlock } from '@/components/item-block';
import { SkillChips } from '@/components/skill-chips';
import { fileUrl, getContent, getProject, groupItems, projectUrl, type Item } from '@/lib/content';
import { KIND_LABEL } from '@/lib/format';
import { site } from '@/lib/site';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getContent().projects.map((p) => ({ slug: p.portfolio.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const { title, oneLiner } = project.portfolio;
  return {
    title,
    description: oneLiner,
    alternates: { canonical: projectUrl(slug) },
    openGraph: { type: 'article', siteName: site.name, title: `${title} | ${site.name}`, description: oneLiner, url: projectUrl(slug) },
    twitter: { card: 'summary_large_image', title: `${title} | ${site.name}`, description: oneLiner },
  };
}

function groupHeading(items: Item[]): { eyebrow: string; title: string } {
  const first = items[0];
  return first.source
    ? { eyebrow: 'Source slide', title: first.source.title }
    : { eyebrow: 'New page', title: KIND_LABEL[first.kind] };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const p = project.portfolio;
  const groups = groupItems(p.items);
  const syncedFrom = project.commit
    ? `commit ${project.commit.slice(0, 7)}${project.dirty ? ', plus changes not yet committed' : ''}`
    : null;

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 sm:px-8">
      <nav aria-label="Breadcrumb" className="pt-8 text-[15px]">
        <Link href="/#projects" className="link">
          All projects
        </Link>
      </nav>

      <header className="pt-6">
        <h1 className="max-w-4xl text-[40px] leading-[1.08] font-semibold tracking-tight sm:text-5xl">{p.title}</h1>
        <p className="mt-5 max-w-3xl text-xl leading-relaxed text-ink/80">{p.oneLiner}</p>
        <div className="mt-6">
          <SkillChips skills={p.skills} />
        </div>
        <dl className="mt-7 grid gap-x-10 gap-y-3 text-[15px] sm:grid-cols-[auto_1fr]">
          <dt className="eyebrow pt-1">Repo</dt>
          <dd className="m-0">
            <a href={p.repo} className="link break-all">
              {p.repo.replace('https://', '')}
            </a>
          </dd>
          {syncedFrom ? (
            <>
              <dt className="eyebrow pt-1">Files synced from</dt>
              <dd className="m-0 font-mono text-sm">{syncedFrom}</dd>
            </>
          ) : null}
        </dl>
      </header>

      <section aria-labelledby="how-made" className="mt-10 max-w-4xl border-l-4 border-accent bg-panel px-5 py-4 sm:px-6">
        <h2 id="how-made" className="eyebrow text-ink">
          How this was made
        </h2>
        <p className="mt-2 leading-relaxed">{p.howMade}</p>
      </section>

      <nav aria-labelledby="contents" className="mt-12">
        <h2 id="contents" className="eyebrow">
          On this page
        </h2>
        <ol className="mt-3 space-y-1.5 text-[15px]">
          {p.items.map((item) => (
            <li key={item.id} className="flex flex-wrap gap-x-2">
              <span className="text-muted">{KIND_LABEL[item.kind]}:</span>
              <a href={`#${item.id}`} className="link">
                {item.title}
              </a>
            </li>
          ))}
          {p.downloads.length ? (
            <li>
              <a href="#downloads" className="link">
                Downloads
              </a>
            </li>
          ) : null}
          <li>
            <a href="#credits" className="link">
              Credits
            </a>
          </li>
        </ol>
      </nav>

      {groups.map(({ group, items }) => {
        const heading = groupHeading(items);
        return (
          <section key={group} aria-labelledby={`group-${group}`} className="mt-20">
            <div className="border-t border-ink pt-5">
              <p className="eyebrow">{heading.eyebrow}</p>
              <h2 id={`group-${group}`} className="mt-2 text-[28px] leading-tight font-semibold tracking-tight sm:text-[32px]">
                {heading.title}
              </h2>
            </div>
            <div className="mt-10 space-y-20">
              {items.map((item) => (
                <ItemBlock key={item.id} project={project} item={item} />
              ))}
            </div>
          </section>
        );
      })}

      {p.downloads.length ? (
        <section id="downloads" aria-labelledby="downloads-title" className="mt-24 scroll-mt-6">
          <div className="border-t border-ink pt-5">
            <h2 id="downloads-title" className="text-[28px] leading-tight font-semibold tracking-tight">
              Downloads
            </h2>
          </div>
          <div className="mt-6 max-w-3xl">
            <DownloadList links={p.downloads.map((d) => ({ label: d.label, href: fileUrl(p.slug, d.path), bytes: d.bytes }))} />
          </div>
        </section>
      ) : null}

      <section id="credits" aria-labelledby="credits-title" className="mt-24 scroll-mt-6">
        <div className="border-t border-ink pt-5">
          <h2 id="credits-title" className="text-[28px] leading-tight font-semibold tracking-tight">
            Credits
          </h2>
        </div>
        <ul className="mt-6 max-w-4xl space-y-3 text-[15px] leading-snug">
          {p.credits.map((credit) => (
            <li key={credit} className="border-l-2 border-rule pl-4">
              {credit}
            </li>
          ))}
        </ul>
        <p className="mt-6 font-semibold">{site.notAffiliated}</p>
        <p className="mt-2 text-[15px]">
          <a href={p.repo} className="link">
            Code, files and logs on GitHub
          </a>
        </p>
      </section>
    </main>
  );
}
