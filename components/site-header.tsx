import Link from 'next/link';

import { site } from '@/lib/site';

const NAV = [
  { href: '/#projects', label: 'Projects' },
  { href: '/#skills', label: 'Skills' },
  { href: '/one-pager/', label: 'One-pager' },
];

export function SiteHeader() {
  return (
    <header className="border-b border-rule print:hidden">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-8 gap-y-2 px-4 py-4 sm:px-8">
        <Link href="/" className="text-[17px] font-semibold tracking-tight text-ink no-underline hover:text-accent">
          {site.name}
        </Link>
        <nav aria-label="Site">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[15px]">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink underline-offset-4 hover:text-accent hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={site.github} className="text-ink underline-offset-4 hover:text-accent hover:underline">
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
