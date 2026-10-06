import { site } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule print:hidden">
      <div className="mx-auto grid max-w-6xl gap-3 px-4 py-10 text-sm text-muted sm:px-8">
        <p>
          <span className="font-semibold text-ink">{site.name}</span>
          <span aria-hidden="true"> &middot; </span>
          <a href={site.github} className="link">
            github.com/logan-ankenbrandt
          </a>
        </p>
        <p>{site.licenses}</p>
      </div>
    </footer>
  );
}
