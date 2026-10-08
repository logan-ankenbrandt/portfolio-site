import Link from 'next/link';
import type { ReactNode } from 'react';

import { BeforeAfter } from '@/components/before-after';
import { CreditText } from '@/components/credit-text';
import { LogExcerpt } from '@/components/log-view';
import { ProjectCard } from '@/components/project-card';
import { SkillsMatrix } from '@/components/skills-matrix';
import { creditsByProject, getContent, getHero, image, itemUrl } from '@/lib/content';
import { buildEvidence } from '@/lib/evidence';
import { KIND_LABEL, afterAlt, overlayAlt, sourceAlt } from '@/lib/format';
import { notAffiliatedFor, site } from '@/lib/site';

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
  const credits = creditsByProject(content);
  // The faithful rebuild of the hero's source slide: the evidence for accurate reconstruction.
  const faithful = hero
    ? hero.project.portfolio.items.find(
        (i) => i.id !== hero.item.id && i.group === hero.item.group && (i.kind === 'faithful' || i.kind === 'chart-faithful'),
      )
    : undefined;

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 sm:px-8">
      <section aria-labelledby="intro" className="pt-14 pb-4 sm:pt-20 lg:pt-8 lg:pb-0">
        <h1 id="intro" className="text-[44px] leading-[1.05] font-semibold tracking-tight sm:text-6xl lg:text-5xl">
          {site.name}
        </h1>
        <p className="mt-5 max-w-3xl text-xl leading-relaxed text-ink/80 sm:text-2xl sm:leading-relaxed lg:mt-3 lg:max-w-none lg:text-xl lg:leading-snug">
          {site.positioning}
        </p>
        {/* The header links to GitHub too, so on wide screens this line gives its space to the hero. */}
        <p className="mt-5 text-[15px] lg:hidden">
          <a href={site.github} className="link">
            github.com/logan-ankenbrandt
          </a>
        </p>
      </section>

      {hero ? (
        <section aria-labelledby="featured" className="mt-12 sm:mt-16 lg:mt-7">
          <p className="eyebrow">
            Featured &middot; {hero.project.portfolio.title} &middot; {KIND_LABEL[hero.item.kind]}
          </p>
          <h2 id="featured" className="mt-3 max-w-4xl text-[26px] leading-tight font-semibold tracking-tight sm:text-[32px] lg:mt-1.5 lg:max-w-none lg:text-2xl">
            {hero.item.title}
          </h2>
          {/* The summary follows the log at every width, so the images reach the first screen on a phone and
              at 1280 x 800 the name, the positioning line, both images and the log lines fit on the first screen. */}
          <div className="mt-6 lg:mt-4">
            <BeforeAfter
              eager
              before={image(hero.project, hero.item.source!.image, sourceAlt(hero.item))}
              after={image(hero.project, hero.item.after.image, afterAlt(hero.item))}
              overlay={hero.item.overlay ? image(hero.project, hero.item.overlay, overlayAlt(hero.item)) : null}
              beforeNote={hero.item.source!.credit}
              afterNote={hero.item.after.pptx ? 'editable PowerPoint' : KIND_LABEL[hero.item.kind].toLowerCase()}
            />
          </div>
          {faithful ? (
            <p className="mt-4 text-[15px] lg:mt-2">
              <Link href={itemUrl(hero.project.portfolio.slug, faithful.id)} className="link font-medium">
                {faithful.overlay
                  ? 'Faithful rebuild of the same slide, with its overlay on the source'
                  : 'Faithful rebuild of the same slide'}
              </Link>
            </p>
          ) : null}
          <div className="mt-10 lg:mt-4">
            <h3 className="sr-only">From the log</h3>
            <LogExcerpt log={hero.item.log} />
          </div>
          <p className="mt-8 max-w-3xl text-muted">{hero.item.summary}</p>
          <p className="mt-8 text-[15px] lg:mt-4">
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

      <section id="method" aria-labelledby="method-title" className="mt-24 scroll-mt-6">
        <SectionHeading id="method-title" eyebrow="Method">
          The rules each rebuild follows
        </SectionHeading>
        <ol className="mt-8 max-w-3xl list-decimal space-y-2.5 pl-5 text-[15px] leading-snug marker:text-muted">
          {site.rules.map((rule) => (
            <li key={rule} className="pl-1">
              {rule}
            </li>
          ))}
        </ol>
      </section>

      <section id="credits" aria-labelledby="credits-title" className="mt-24 scroll-mt-6">
        <SectionHeading id="credits-title" eyebrow="Sources">
          Credits
        </SectionHeading>
        <div className="mt-8 max-w-4xl space-y-8">
          {credits.map((group) => (
            <div key={group.slug}>
              <h3 className="font-semibold">{group.title}</h3>
              <ul className="mt-3 space-y-3 text-[15px] leading-snug">
                {group.credits.map((credit) => (
                  <li key={credit} className="border-l-2 border-rule pl-4">
                    <CreditText text={credit} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8 font-semibold">{notAffiliatedFor(credits.flatMap((g) => g.credits))}</p>
      </section>
    </main>
  );
}
