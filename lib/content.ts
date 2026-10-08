// Build-time access to content/projects.json, which scripts/sync-projects.mjs writes.
// The file is validated against the contract again here, so a hand edit or a stale sync fails the build.
import fs from 'node:fs';
import path from 'node:path';
import type { z } from 'zod';

import { contentSchema, formatIssues, referencedPaths } from './contract.mjs';

export type Content = z.infer<typeof contentSchema>;
export type SyncedProject = Content['projects'][number];
export type Portfolio = SyncedProject['portfolio'];
export type Item = Portfolio['items'][number];
export type Kind = Item['kind'];
export type Log = Item['log'];

export type Img = { src: string; width: number; height: number; alt: string };

let cached: Content | null = null;

function fail(message: string): never {
  throw new Error(`\n\n${message}\n`);
}

export function getContent(): Content {
  if (cached) return cached;
  const root = process.cwd();
  const file = path.join(root, 'content', 'projects.json');
  if (!fs.existsSync(file)) {
    fail('content/projects.json is missing. Run "npm run sync" (project repos) or "npm run sync -- --fixtures" (placeholders) first.');
  }
  const parsed = contentSchema.safeParse(JSON.parse(fs.readFileSync(file, 'utf8')));
  if (!parsed.success) {
    fail(`content/projects.json does not match the contract:\n  ${formatIssues(parsed.error.issues).join('\n  ')}`);
  }
  const content = parsed.data;
  if (content.mode === 'fixtures' && (process.env.VERCEL || process.env.CI)) {
    fail('content/projects.json holds placeholder fixtures, which never deploy. Run "npm run sync" against the project repos and commit the result.');
  }
  const problems: string[] = [];
  for (const project of content.projects) {
    const { slug } = project.portfolio;
    for (const ref of referencedPaths(project.portfolio)) {
      const info = project.files[ref.path];
      const abs = path.join(root, 'public', 'projects', slug, ref.path);
      if (!info) problems.push(`${slug}: ${ref.path} is referenced but has no file entry`);
      else if (!fs.existsSync(abs)) problems.push(`${slug}: public/projects/${slug}/${ref.path} is missing`);
      else if (fs.statSync(abs).size !== info.bytes) problems.push(`${slug}: public/projects/${slug}/${ref.path} changed since the sync`);
      else if (ref.type === 'png' && (!info.width || !info.height)) problems.push(`${slug}: ${ref.path} has no recorded size`);
    }
  }
  const orders = content.projects.map((p) => p.portfolio.order);
  if (new Set(orders).size !== orders.length) problems.push('two projects share an order value');
  if (problems.length) fail(`content/projects.json is out of step with public/projects:\n  ${problems.join('\n  ')}\nRun the sync again.`);

  content.projects.sort((a, b) => a.portfolio.order - b.portfolio.order);
  cached = content;
  return content;
}

export function getProject(slug: string): SyncedProject | undefined {
  return getContent().projects.find((p) => p.portfolio.slug === slug);
}

export function fileUrl(slug: string, rel: string): string {
  return `/projects/${slug}/${rel}`;
}

export function projectUrl(slug: string): string {
  return `/projects/${slug}/`;
}

export function itemUrl(slug: string, itemId: string, toLog = false): string {
  return `/projects/${slug}/#${itemId}${toLog ? '-log' : ''}`;
}

export function image(project: SyncedProject, rel: string, alt: string): Img {
  const info = project.files[rel];
  return { src: fileUrl(project.portfolio.slug, rel), width: info.width ?? 1280, height: info.height ?? 720, alt };
}

export function bytesOf(project: SyncedProject, rel: string): number {
  return project.files[rel].bytes;
}

/** The home page hero: the order-1 project's first item that has both a source and an after image. */
export function getHero(content: Content): { project: SyncedProject; item: Item } | null {
  const project = content.projects.find((p) => p.portfolio.order === 1);
  const item = project?.portfolio.items.find((i) => i.source !== null && i.after.image);
  return project && item ? { project, item } : null;
}

/** Items grouped by "group", in first-appearance order. */
export function groupItems(items: Item[]): { group: string; items: Item[] }[] {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const list = groups.get(item.group) ?? [];
    list.push(item);
    groups.set(item.group, list);
  }
  return [...groups].map(([group, list]) => ({ group, items: list }));
}

/** Each project's credit lines under its title. Projects cite shared sources in their own words, so lines are not merged. */
export function creditsByProject(content: Content): { slug: string; title: string; credits: string[] }[] {
  return content.projects
    .map((p) => ({ slug: p.portfolio.slug, title: p.portfolio.title, credits: [...new Set(p.portfolio.credits)] }))
    .filter((g) => g.credits.length);
}
