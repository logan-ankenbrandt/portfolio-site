import Link from 'next/link';

import type { SyncedProject } from '@/lib/content';
import type { EvidenceCell, EvidenceRow } from '@/lib/evidence';
import { KIND_LABEL } from '@/lib/format';

function CellLink({ cell }: { cell: NonNullable<EvidenceCell> }) {
  return (
    <Link href={cell.href} className="group block no-underline">
      <span className="eyebrow block text-[11px] text-muted">{KIND_LABEL[cell.item.kind]}</span>
      <span className="mt-1 line-clamp-2 text-[15px] leading-snug text-accent underline decoration-accent/40 group-hover:decoration-accent">
        {cell.item.title}
      </span>
    </Link>
  );
}

/** A table from the md breakpoint up; a stacked list on phones. */
export function SkillsMatrix({ rows, projects }: { rows: EvidenceRow[]; projects: SyncedProject[] }) {
  return (
    <>
      <table className="hidden w-full table-fixed border-collapse text-left md:table">
        <caption className="sr-only">
          Each skill from the listing, with a link to one item in each project that shows it
        </caption>
        <thead>
          <tr className="border-b border-ink">
            <th scope="col" className="w-[22%] py-3 pr-6 align-bottom eyebrow text-ink">
              Skill
            </th>
            {projects.map((p) => (
              <th key={p.portfolio.slug} scope="col" className="py-3 pr-6 align-bottom text-[15px] font-semibold leading-snug">
                {p.portfolio.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.skill} className="border-b border-rule align-top">
              <th scope="row" className="py-4 pr-6 font-semibold leading-snug">
                {row.skill}
              </th>
              {row.cells.map((cell, i) => (
                <td key={projects[i].portfolio.slug} className="py-4 pr-6">
                  {cell ? <CellLink cell={cell} /> : <span className="text-sm text-muted/80">Not in this project</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="divide-y divide-rule border-y border-rule md:hidden">
        {rows.map((row) => (
          <div key={row.skill} className="py-4">
            <dt className="font-semibold">{row.skill}</dt>
            <dd className="m-0 mt-2">
              <ul className="space-y-3">
                {row.cells.map((cell) =>
                  cell ? (
                    <li key={cell.project.portfolio.slug}>
                      <span className="block text-sm text-muted">{cell.project.portfolio.title}</span>
                      <CellLink cell={cell} />
                    </li>
                  ) : null,
                )}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
