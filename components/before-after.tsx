'use client';

import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';

import type { Img } from '@/lib/content';

type Side = 'before' | 'after';
const SIDES: Side[] = ['before', 'after'];

type Props = {
  before: Img | null;
  after: Img;
  overlay?: Img | null;
  beforeNote?: string;
  afterNote?: string;
  /** Load eagerly (the home page hero is above the fold). */
  eager?: boolean;
  /** Below md, show "Full size" as a button: for figures whose values cannot be read at phone width. */
  fullSizeProminent?: boolean;
};

function Figure({
  img,
  label,
  note,
  eager,
  prominent,
  children,
}: {
  img: Img;
  label: string;
  note?: string;
  eager?: boolean;
  prominent?: boolean;
  children?: ReactNode;
}) {
  return (
    <figure className="m-0">
      {/* Plain img with width and height: the site is a static export with no image optimization. */}
      <img
        src={img.src}
        width={img.width}
        height={img.height}
        alt={img.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="block h-auto w-full border border-rule-strong/60 bg-white"
      />
      <figcaption className="mt-2.5 flex min-h-8 flex-wrap items-baseline justify-between gap-x-4 gap-y-2 text-sm md:flex-nowrap">
        {/* A long credit wraps beside the links instead of pushing them onto a line of their own. */}
        <span className="min-w-0 md:flex-1">
          <span className="font-semibold">{label}</span>
          {note ? <span className="text-muted"> &middot; {note}</span> : null}
        </span>
        <span className="flex flex-wrap items-center gap-x-4 gap-y-2 md:shrink-0">
          {children}
          {prominent ? (
            <a
              href={img.src}
              target="_blank"
              rel="noopener"
              className="link max-md:inline-flex max-md:rounded-full max-md:border max-md:border-accent max-md:px-3 max-md:py-1 max-md:font-medium max-md:no-underline"
            >
              <span className="md:hidden">Open full size to read the values</span>
              <span className="hidden md:inline">Full size</span>
              <span className="sr-only"> image: {label}</span>
            </a>
          ) : (
            <a href={img.src} target="_blank" rel="noopener" className="link">
              Full size<span className="sr-only"> image: {label}</span>
            </a>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Before and after, side by side from the md breakpoint up and as two tabs below it.
 * Columns are sized by each image's aspect ratio so both images render at the same height.
 * When an overlay exists, a toggle swaps the after image for the overlay.
 */
export function BeforeAfter({ before, after, overlay = null, beforeNote, afterNote, eager, fullSizeProminent }: Props) {
  const id = useId();
  const [side, setSide] = useState<Side>('after');
  const [showOverlay, setShowOverlay] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const shown = showOverlay && overlay ? overlay : after;
  const afterLabel = showOverlay && overlay ? 'Overlay' : 'After';
  const afterCaption = showOverlay && overlay ? 'rebuild at 50% over the source' : afterNote;

  const toggle = overlay ? (
    <button
      type="button"
      aria-pressed={showOverlay}
      onClick={() => setShowOverlay((v) => !v)}
      className="inline-flex items-center gap-2 rounded-full border border-accent px-3 py-1 text-sm font-medium text-accent hover:bg-accent/5 aria-pressed:bg-accent aria-pressed:text-white"
    >
      <span
        aria-hidden="true"
        className={`inline-block h-2.5 w-2.5 rounded-full border ${showOverlay ? 'border-white bg-white' : 'border-accent'}`}
      />
      Overlay on source
    </button>
  ) : null;

  if (!before) {
    // A lone image would fill the whole column, so it gets the width of one side of a pair at most.
    return (
      <div className="max-w-3xl">
        <Figure img={shown} label={afterLabel} note={afterCaption} eager={eager} prominent={fullSizeProminent}>
          {toggle}
        </Figure>
      </div>
    );
  }

  const ratio = (img: Img) => (img.width / img.height).toFixed(4);
  const style = { '--ba-cols': `minmax(0, ${ratio(before)}fr) minmax(0, ${ratio(shown)}fr)` } as CSSProperties;

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const current = SIDES.indexOf(side);
    const keys: Record<string, number> = {
      ArrowRight: (current + 1) % SIDES.length,
      ArrowDown: (current + 1) % SIDES.length,
      ArrowLeft: (current - 1 + SIDES.length) % SIDES.length,
      ArrowUp: (current - 1 + SIDES.length) % SIDES.length,
      Home: 0,
      End: SIDES.length - 1,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setSide(SIDES[next]);
    tabs.current[next]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="Compare before and after" className="mb-4 inline-flex rounded-full border border-muted p-1 md:hidden">
        {SIDES.map((s, i) => (
          <button
            key={s}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${s}`}
            aria-selected={side === s}
            aria-controls={`${id}-panel-${s}`}
            tabIndex={side === s ? 0 : -1}
            onClick={() => setSide(s)}
            onKeyDown={onKeyDown}
            className="rounded-full px-4 py-1.5 text-sm font-medium text-ink aria-selected:bg-ink aria-selected:text-white"
          >
            {s === 'before' ? 'Before' : 'After'}
          </button>
        ))}
      </div>
      <div style={style} className="md:grid md:items-start md:gap-6 md:[grid-template-columns:var(--ba-cols)]">
        <div
          role="tabpanel"
          id={`${id}-panel-before`}
          aria-labelledby={`${id}-tab-before`}
          className={side === 'before' ? 'block' : 'hidden md:block'}
        >
          <Figure img={before} label="Before" note={beforeNote} eager={eager} prominent={fullSizeProminent} />
        </div>
        <div
          role="tabpanel"
          id={`${id}-panel-after`}
          aria-labelledby={`${id}-tab-after`}
          className={side === 'after' ? 'block' : 'hidden md:block'}
        >
          <Figure img={shown} label={afterLabel} note={afterCaption} eager={eager} prominent={fullSizeProminent}>
            {toggle}
          </Figure>
        </div>
      </div>
    </div>
  );
}
