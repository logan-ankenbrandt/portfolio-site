import Link from 'next/link';
import type { ReactNode } from 'react';

import { BeforeAfter } from '@/components/before-after';
import { LogExcerpt } from '@/components/log-view';
import { ProjectCard } from '@/components/project-card';
import { SkillsMatrix } from '@/components/skills-matrix';
import { allCredits, getContent, getHero, image, itemUrl } from '@/lib/content';
import { buildEvidence } from '@/lib/evidence';
import { KIND_LABEL, afterAlt, overlayAlt, sourceAlt } from '@/lib/format';
import { site } from '@/lib/site';

const COUNT_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

function caseStudies(n: number): string {
  return `${COUNT_WORDS[n] ?? n} case ${n === 1 ? 'study' : 'studies'}`;
}

function SectionHeading({ id, eyebrow, children }: { id: string; eyebrow: string; children: ReactNode }) {
  return (
    <div className="border-t border-ink pt-5">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-[28px] leading-tight font-semibold tracking-tight sm:text-[32px]">
        {children}
      </h2>
    </div>
  );
}

export default function HomePage() {
  const content = getContent();
  const hero = getHero(content);
  const rows = buildEvidence(content);
  const credits = allCredits(content);

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 sm:px-8">
      <section aria-labelledby="intro" className="pt-14 pb-4 sm:pt-20">
        <h1 id="intro" className="text-[44px] leading-[1.05] font-semibold tracking-tight sm:text-6xl">
          {site.name}
        </h1>
        <p className="mt-5 max-w-3xl text-xl leading-relaxed text-ink/80 sm:text-2xl sm:leading-relaxed">{site.positioning}</p>
        <p className="mt-5 text-[15px]">
          <a href={site.github} className="link">
            github.com/logan-ankenbrandt
          </a>
        </p>
      </section>

      {hero ? (
        <section aria-labelledby="featured" className="mt-12 sm:mt-16">
          <p className="eyebrow">
            Featured &middot; {hero.project.portfolio.title} &middot; {KIND_LABEL[hero.item.kind]}
          </p>
          <h2 id="featured" className="mt-3 max-w-4xl text-[26px] leading-tight font-semibold tracking-tight sm:text-[32px]">
            {hero.item.title}
          </h2>
          <p className="mt-3 max-w-3xl text-muted">{hero.item.summary}</p>
          <div className="mt-7">
            <BeforeAfter
              eager
              before={image(hero.project, hero.item.source!.image, sourceAlt(hero.item))}
              after={image(hero.project, hero.item.after.image, afterAlt(hero.item))}
              overlay={hero.item.overlay ? image(hero.project, hero.item.overlay, overlayAlt(hero.item)) : null}
              beforeNote={hero.item.source!.credit}
              afterNote={hero.item.after.pptx ? 'editable PowerPoint' : KIND_LABEL[hero.item.kind].toLowerCase()}
            />
          </div>
          <div className="mt-10">
            <h3 className="sr-only">From the log</h3>
            <LogExcerpt log={hero.item.log} />
          </div>
          <p className="mt-8 text-[15px]">
            <Link href={itemUrl(hero.project.portfolio.slug, hero.item.id)} className="link font-medium">
              {hero.item.after.pptx ? 'See the full log and download the PowerPoint' : 'See the full log'}
            </Link>
          </p>
        </section>
      ) : null}

      <section id="projects" aria-labelledby="projects-title" className="mt-24 scroll-mt-6">
        <SectionHeading id="projects-title" eyebrow="Projects">
          {caseStudies(content.projects.length)}
        </SectionHeading>
        <div className="mt-10 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {content.projects.map((project) => (
            <ProjectCard key={project.portfolio.slug} project={project} />
          ))}
        </div>
      </section>

      {rows.length ? (
        <section id="skills" aria-labelledby="skills-title" className="mt-24 scroll-mt-6">
          <SectionHeading id="skills-title" eyebrow="Skills">
            Each skill, with a slide or log that shows it
          </SectionHeading>
          <div className="mt-8">
            <SkillsMatrix rows={rows} projects={content.projects} />
          </div>
        </section>
      ) : null}

      <section id="how-made" aria-labelledby="how-made-title" className="mt-24 scroll-mt-6">
        <SectionHeading id="how-made-title" eyebrow="Method">
          How this was made
        </SectionHeading>
        <div className="mt-8 grid gap-x-12 gap-y-8 lg:grid-cols-2">
          <p className="text-lg leading-relaxed">{site.howMade}</p>
          <div>
            <h3 className="font-semibold">The rules each rebuild follows</h3>
            <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-[15px] leading-snug marker:text-muted">
              {site.rules.map((rule) => (
                <li key={rule} className="pl-1">
                  {rule}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="credits" aria-labelledby="credits-title" className="mt-24 scroll-mt-6">
        <SectionHeading id="credits-title" eyebrow="Sources">
          Credits
        </SectionHeading>
        <ul className="mt-8 max-w-4xl space-y-3 text-[15px] leading-snug">
          {credits.map((credit) => (
            <li key={credit} className="border-l-2 border-rule pl-4">
              {credit}
            </li>
          ))}
        </ul>
        <p className="mt-8 font-semibold">{site.notAffiliated}</p>
      </section>
    </main>
  );
}
