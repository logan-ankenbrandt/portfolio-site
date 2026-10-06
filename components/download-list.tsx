import { fileName, fileType, formatBytes } from '@/lib/format';

export type DownloadLink = { label: string; href: string; bytes: number };

export function DownloadList({ links }: { links: DownloadLink[] }) {
  return (
    <ul className="divide-y divide-rule border-y border-rule">
      {links.map((d) => (
        <li key={d.href} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-2.5">
          <a href={d.href} download={fileName(d.href)} className="link">
            {d.label}
          </a>
          <span className="text-sm whitespace-nowrap text-muted tabular-nums">
            {fileType(d.href)}, {formatBytes(d.bytes)}
          </span>
        </li>
      ))}
    </ul>
  );
}
