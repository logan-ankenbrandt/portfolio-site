// Site-wide copy and settings. Logan reviews every line here before publishing (see REVIEW.md).

export const site = {
  name: 'Logan Ankenbrandt',
  title: 'Logan Ankenbrandt | Slide reconstruction portfolio',
  description:
    'Public government slides and charts rebuilt as editable PowerPoint, each with a log of what changed, what was kept, what was rejected and what was flagged for the author.',
  // DRAFT: Logan approves or rewrites this line (REVIEW.md, item 1). Agents build the slides, so it must not say he does.
  positioning:
    'I direct and check slide rebuilds in editable PowerPoint: clear charts, architecture diagrams and a log for every change.',
  url: 'https://logan-ankenbrandt.vercel.app',
  github: 'https://github.com/logan-ankenbrandt',
  howMade:
    'Claude Code agents rebuilt these slides from the source images as editable PowerPoint, drafted the logs and built this site. I approved the sources and the rules each rebuild follows, and checked every slide, number and log before publishing.',
  rules: [
    'Every number on a slide or in a log traces to the source page or figure, or to an arithmetic check recorded in the log. A value that cannot be read is reported, not guessed.',
    'Faithful rebuilds match the source: positions, sizes, colors sampled from the source pixels, fonts, line weights and aspect ratio.',
    'Revised slides carry one message under a title that states the point, and keep the source\u2019s definitions, caveats and hedges, such as \u201chistorically\u201d and \u201cabout\u201d.',
    'Each log lists what changed, what was kept on purpose, what was considered and rejected, and what was flagged for the author instead of fixed.',
  ],
  notAffiliated: 'Not affiliated with or endorsed by NASA or GAO.',
  licenses:
    'Code is MIT licensed. The rebuilt slides, logs and site text are CC BY 4.0. The source slides and figures are US government works.',
} as const;

/** The agencies whose work appears on the site, matched against credit lines. */
const AGENCIES: [name: string, pattern: RegExp][] = [
  ['NASA', /\bNASA\b/],
  ['GAO', /\bGAO\b|Government Accountability Office/],
];

/** The not-affiliated line for a page, naming only the agencies its credits name. */
export function notAffiliatedFor(credits: readonly string[]): string {
  const names = AGENCIES.filter(([, re]) => credits.some((c) => re.test(c))).map(([name]) => name);
  return names.length ? `Not affiliated with or endorsed by ${names.join(' or ')}.` : site.notAffiliated;
}

/**
 * What each source image shows, for its alt text, keyed by the image path in the project's portfolio.json.
 * A source without an entry gets a citation-only alt text.
 */
export const SOURCE_DESCRIPTIONS: Record<string, string> = {
  'slides/01-cfs-usage/source.png':
    'Source slide \u201ccFS Usage and Impact At NASA\u201d: three 3D pie charts of cFS applications by NASA center, by mission directorate and by segment, with a caption box under each.',
  'slides/02-cfs-key-features/source.png':
    'Source slide \u201ccFS Key Features\u201d: three bullets above a layered block diagram of cFS, from apps at the top to the real-time OS and boot software at the bottom, colored by a four-entry status legend, with red ellipses around the mission-built parts.',
  'slides/01-layers/source.png':
    'Source slide \u201ccFS Key Features\u201d: three bullets above a layered block diagram of cFS, from apps at the top to the real-time OS and boot software at the bottom, colored by a four-entry status legend, with red ellipses around the mission-built parts.',
  'slides/figure1/source.png':
    'Source figure: one horizontal bar per agency for 24 agencies\u2019 planned fiscal year 2025 IT spending, each bar split into the operations and maintenance share and the development, modernization and enhancement share, with the dollar total beside each agency name.',
};

/** The listing's skills that the home page matrix shows, and how a cell picks its evidence. */
export type MatrixRule = {
  skill: string;
  /** Item kinds that show this skill, best first. */
  kinds: string[];
  /** Fallback: the first item whose title, summary or source title matches. */
  keywords?: RegExp;
  /** Fallback after keywords: the item with the longest log (the log itself is the evidence). */
  longestLog?: boolean;
  /** Link to the item's log instead of its slides. */
  toLog?: boolean;
};

export const MATRIX: MatrixRule[] = [
  { skill: 'Slide Reconstruction', kinds: ['faithful', 'chart-faithful'], keywords: /rebuil|reconstruct|faithful/i },
  { skill: 'Presentation Design', kinds: ['revised', 'exec', 'chart-redesign', 'engineer'] },
  { skill: 'Data Visualization', kinds: ['chart-redesign', 'chart-faithful', 'revised'], keywords: /chart|graph|plot|\bbars?\b|\bpies?\b/i },
  { skill: 'Visual Storytelling', kinds: ['exec', 'revised', 'chart-redesign'] },
  { skill: 'Content Editing', kinds: ['revised', 'brief', 'exec'], longestLog: true, toLog: true },
  { skill: 'Technical Documentation', kinds: ['brief'], longestLog: true, toLog: true },
  { skill: 'System Architecture', kinds: ['engineer', 'exec', 'brief'], keywords: /architect|layer|diagram/i },
];

/**
 * Pin a matrix cell to a specific item when the automatic pick is wrong:
 * { 'System Architecture': { 'slide-rebuild-log': '02-cfs-key-features-faithful' } }
 * The build fails if a pinned item does not exist.
 */
export const EVIDENCE_OVERRIDES: Record<string, Record<string, string>> = {};
