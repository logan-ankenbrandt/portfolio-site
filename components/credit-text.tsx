import { Fragment } from 'react';

const URL_RE = /https?:\/\/[^\s<>"]+/g;

/** A credit line with its URLs as links. Trailing sentence punctuation stays outside the link. */
export function CreditText({ text }: { text: string }) {
  const parts: (string | { href: string })[] = [];
  let last = 0;
  for (const match of text.matchAll(URL_RE)) {
    let href = match[0];
    const trail = /[.,;:)]+$/.exec(href)?.[0] ?? '';
    href = href.slice(0, href.length - trail.length);
    const start = match.index ?? 0;
    parts.push(text.slice(last, start), { href });
    last = start + href.length;
  }
  parts.push(text.slice(last));
  return (
    <>
      {parts.map((part, i) =>
        typeof part === 'string' ? (
          <Fragment key={i}>{part}</Fragment>
        ) : (
          <a key={i} href={part.href} className="link break-words [overflow-wrap:anywhere]">
            {part.href}
          </a>
        ),
      )}
    </>
  );
}
