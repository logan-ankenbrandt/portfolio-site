import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-6xl px-4 pt-20 sm:px-8">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4 text-muted">That address does not match a page on this site.</p>
      <p className="mt-6">
        <Link href="/" className="link">
          Back to the home page
        </Link>
      </p>
    </main>
  );
}
