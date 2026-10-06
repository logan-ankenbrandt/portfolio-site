import Link from 'next/link';

import { SkillChips } from '@/components/skill-chips';
import { image, projectUrl, type SyncedProject } from '@/lib/content';
import { coverAlt } from '@/lib/format';

export function ProjectCard({ project }: { project: SyncedProject }) {
  const p = project.portfolio;
  const cover = image(project, p.cover, coverAlt(p));
  return (
    <article className="group relative flex flex-col">
      <img
        src={cover.src}
        width={cover.width}
        height={cover.height}
        alt={cover.alt}
        loading="lazy"
        decoding="async"
        className="block aspect-video h-auto w-full border border-rule-strong/60 bg-white object-cover transition-opacity group-hover:opacity-90"
      />
      <h3 className="mt-5 text-xl leading-snug font-semibold tracking-tight">
        {/* The title link covers the whole card, so the cover is clickable too. */}
        <Link href={projectUrl(p.slug)} className="text-ink no-underline after:absolute after:inset-0 group-hover:text-accent">
          {p.title}
        </Link>
      </h3>
      <p className="mt-2 text-muted">{p.oneLiner}</p>
      <div className="relative z-10 mt-4">
        <SkillChips skills={p.skills} />
      </div>
      <p className="relative z-10 mt-auto pt-5 text-[15px]">
        <a href={p.repo} className="link">
          Repo on GitHub<span className="sr-only">: {p.slug}</span>
        </a>
      </p>
    </article>
  );
}
