// THE CONTRACT: the exact shape of portfolio.json in each project repo.
// Shared by scripts/sync-projects.mjs (validation at sync) and lib/content.ts (validation at build).
import { z } from 'zod';

export const GITHUB_USER = 'logan-ankenbrandt';

export const KINDS = /** @type {const} */ ([
  'faithful',
  'revised',
  'chart-faithful',
  'chart-redesign',
  'exec',
  'engineer',
  'brief',
]);

// "skills": listing words only. These are the required skills as the listing words them.
export const LISTING_SKILLS = /** @type {const} */ ([
  'Microsoft PowerPoint',
  'Slide Reconstruction',
  'Presentation Design',
  'Data Visualization',
  'Visual Storytelling',
  'Content Editing',
  'Critical Thinking',
  'Attention to Detail',
  'Written Communication',
  'Software Engineering',
  'Technical Documentation',
  'System Architecture',
]);

// File types a project may offer in "downloads". No HTML or SVG, since they would run on the hub's origin.
export const DOWNLOAD_EXTENSIONS = ['pptx', 'pdf', 'png', 'csv', 'md', 'json', 'txt', 'xlsx', 'zip'];

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Relative path inside the repo: no leading slash, no "." or ".." segments, URL-safe characters only.
const REL_PATH_RE = /^[A-Za-z0-9][A-Za-z0-9._-]*(?:\/[A-Za-z0-9][A-Za-z0-9._-]*)*$/;

const text = z.string().refine((s) => s.trim().length > 0, 'must be a non-empty string');
const slug = z.string().regex(SLUG_RE, 'must be lowercase kebab-case (a-z, 0-9, single hyphens)');

const relPath = z
  .string()
  .regex(REL_PATH_RE, 'must be a relative path inside the repo using only A-Z a-z 0-9 . _ - and /');
const withExt = (exts) =>
  relPath.refine(
    (p) => exts.includes(p.split('.').pop().toLowerCase()),
    `must end in .${exts.join(' or .')}`,
  );
const pngPath = withExt(['png']);
const pptxPath = withExt(['pptx']);
const pdfPath = withExt(['pdf']);
const mdPath = withExt(['md']);
const downloadPath = withExt(DOWNLOAD_EXTENSIONS);

const httpUrl = z.string().refine((u) => {
  try {
    const parsed = new URL(u);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}, 'must be an absolute http(s) URL');

const reasoned = z.strictObject({ what: text, why: text });

export const logSchema = z.strictObject({
  changed: z.array(reasoned),
  kept: z.array(reasoned),
  rejected: z.array(reasoned),
  flagged: z.array(z.strictObject({ what: text, evidence: text })),
  checks: z.array(z.strictObject({ what: text, result: text })),
});

export const sourceSchema = z.strictObject({
  image: pngPath,
  title: text,
  credit: text,
  url: httpUrl,
  license: text,
  page: text,
});

export const itemSchema = z.strictObject({
  id: slug,
  group: slug,
  title: text,
  kind: z.enum(KINDS),
  summary: text,
  source: sourceSchema.nullable(),
  after: z.strictObject({
    image: pngPath,
    pptx: pptxPath.nullable(),
    pdf: pdfPath.nullable(),
  }),
  overlay: pngPath.nullable(),
  log: logSchema,
  logMarkdown: mdPath,
});

export const downloadSchema = z.strictObject({
  label: text,
  path: downloadPath,
  bytes: z.number().int().nonnegative(),
});

export const portfolioSchema = z
  .strictObject({
    slug,
    title: text,
    oneLiner: text,
    repo: httpUrl,
    order: z.number().int().positive(),
    skills: z
      .array(z.enum(LISTING_SKILLS, { error: `must be one of the listing's skills: ${LISTING_SKILLS.join(', ')}` }))
      .min(1),
    howMade: text,
    cover: pngPath,
    items: z.array(itemSchema).min(1),
    downloads: z.array(downloadSchema),
    credits: z.array(text).min(1),
  })
  .superRefine((p, ctx) => {
    const expectedRepo = `https://github.com/${GITHUB_USER}/${p.slug}`;
    if (p.repo !== expectedRepo) {
      ctx.addIssue({ code: 'custom', path: ['repo'], message: `must be exactly ${expectedRepo}` });
    }
    if (!/Claude Code/.test(p.howMade)) {
      ctx.addIssue({
        code: 'custom',
        path: ['howMade'],
        message: 'must carry the "How this was made" note, which names Claude Code agents',
      });
    }
    const seenIds = new Set();
    p.items.forEach((item, i) => {
      if (seenIds.has(item.id)) {
        ctx.addIssue({ code: 'custom', path: ['items', i, 'id'], message: `duplicate item id "${item.id}"` });
      }
      seenIds.add(item.id);
    });
    const seenSkills = new Set();
    p.skills.forEach((s, i) => {
      if (seenSkills.has(s)) ctx.addIssue({ code: 'custom', path: ['skills', i], message: `duplicate skill "${s}"` });
      seenSkills.add(s);
    });
  });

/** Every repo-relative file path a portfolio.json references, with the role it plays. */
export function referencedPaths(p) {
  const refs = [{ path: p.cover, role: 'cover', type: 'png' }];
  for (const item of p.items) {
    if (item.source) refs.push({ path: item.source.image, role: `items[${item.id}].source.image`, type: 'png' });
    refs.push({ path: item.after.image, role: `items[${item.id}].after.image`, type: 'png' });
    if (item.after.pptx) refs.push({ path: item.after.pptx, role: `items[${item.id}].after.pptx`, type: 'pptx' });
    if (item.after.pdf) refs.push({ path: item.after.pdf, role: `items[${item.id}].after.pdf`, type: 'pdf' });
    if (item.overlay) refs.push({ path: item.overlay, role: `items[${item.id}].overlay`, type: 'png' });
    refs.push({ path: item.logMarkdown, role: `items[${item.id}].logMarkdown`, type: 'md' });
  }
  p.downloads.forEach((d, i) => {
    refs.push({ path: d.path, role: `downloads[${i}]`, type: d.path.split('.').pop().toLowerCase() });
  });
  return refs;
}

/** Shape of content/projects.json, which scripts/sync-projects.mjs writes and the site reads at build. */
export const fileInfoSchema = z.strictObject({
  bytes: z.number().int().nonnegative(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export const syncedProjectSchema = z.strictObject({
  portfolio: portfolioSchema,
  files: z.record(z.string(), fileInfoSchema),
  commit: z.string().nullable(),
  dirty: z.boolean(),
});

export const contentSchema = z.strictObject({
  mode: z.enum(['repos', 'fixtures']),
  projects: z.array(syncedProjectSchema),
});

/** Formats zod issues as "path: message" lines. */
export function formatIssues(issues, prefix = '') {
  return issues.map((issue) => {
    const where = issue.path.length ? issue.path.map(String).join('.') : '(root)';
    return `${prefix}${where}: ${issue.message}`;
  });
}
