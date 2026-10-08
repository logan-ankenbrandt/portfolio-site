import type { Log } from '@/lib/content';

type Section = {
  key: keyof Log;
  label: string;
  detail: 'why' | 'evidence' | 'result';
  detailLabel: string;
  tone: string;
};

export const LOG_SECTIONS: Section[] = [
  { key: 'changed', label: 'Changed', detail: 'why', detailLabel: 'Why', tone: 'text-accent' },
  { key: 'kept', label: 'Kept', detail: 'why', detailLabel: 'Why', tone: 'text-ink' },
  { key: 'rejected', label: 'Rejected', detail: 'why', detailLabel: 'Why', tone: 'text-muted' },
  { key: 'flagged', label: 'Flagged', detail: 'evidence', detailLabel: 'Evidence', tone: 'text-flag' },
  { key: 'checks', label: 'Checks', detail: 'result', detailLabel: 'Result', tone: 'text-ink' },
];

type Entry = { what: string; why?: string; evidence?: string; result?: string };

/** The full log as text: every section, every entry, with empty sections marked. */
export function LogView({ log }: { log: Log }) {
  return (
    <div className="space-y-7">
      {LOG_SECTIONS.map((section) => {
        const entries = log[section.key] as Entry[];
        return (
          <section key={section.key}>
            <h5 className={`eyebrow ${section.tone}`}>
              {section.label} <span className="font-normal tracking-normal text-muted">({entries.length})</span>
            </h5>
            {entries.length ? (
              <ol className="mt-3 space-y-4">
                {entries.map((entry, i) => (
                  <li key={i} className="border-l-2 border-rule pl-4">
                    <p className="leading-snug">{entry.what}</p>
                    <p className="mt-1.5 text-[15px] leading-snug text-muted">
                      <span className="font-semibold text-ink/75">{section.detailLabel}:</span> {entry[section.detail]}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-2 text-[15px] text-muted">None recorded.</p>
            )}
          </section>
        );
      })}
    </div>
  );
}

/** Up to four lines for the home page: the first changed, kept, rejected and flagged entries. */
export function LogExcerpt({ log }: { log: Log }) {
  const lines = LOG_SECTIONS.filter((s) => s.key !== 'checks')
    .map((s) => ({ section: s, entry: (log[s.key] as Entry[])[0] }))
    .filter((l): l is { section: Section; entry: Entry } => Boolean(l.entry));
  if (!lines.length) return null;
  return (
    <dl className="grid gap-x-12 gap-y-7 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-6">
      {lines.map(({ section, entry }) => (
        <div key={section.key} className="border-t border-rule pt-4 lg:pt-2.5">
          <dt className={`eyebrow ${section.tone}`}>{section.label}</dt>
          <dd className="m-0 mt-2 lg:mt-1">
            <p className="leading-snug lg:text-[15px]">{entry.what}</p>
            <p className="mt-1.5 text-[15px] leading-snug text-muted lg:text-sm">
              <span className="font-semibold text-ink/75">{section.detailLabel}:</span> {entry[section.detail]}
            </p>
          </dd>
        </div>
      ))}
    </dl>
  );
}
