#!/usr/bin/env node
// Sync project repos into the hub.
//
//   npm run sync                  read ../<slug>/portfolio.json for each slug in projects.config.json
//   npm run sync -- --fixtures    read fixtures/<slug>/portfolio.json instead (placeholder content, local preview only)
//   npm run sync -- --check       validate only, write nothing
//
// Each portfolio.json is validated against THE CONTRACT (lib/contract.mjs). Every referenced file must
// exist and match its type. Any problem fails the sync with a full list. On success the referenced files
// are copied into public/projects/<slug>/ and content/projects.json is rewritten. Both are committed, so
// the deployed build reads only committed files.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { z } from 'zod';

import { contentSchema, formatIssues, portfolioSchema, referencedPaths } from '../lib/contract.mjs';

export const HUB_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const USAGE = 'usage: node scripts/sync-projects.mjs [--fixtures] [--check]';

const configSchema = z.strictObject({
  projects: z
    .array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be a lowercase kebab-case slug'))
    .min(1),
});

// Terms the published text must never contain are private, so they stay out of git in
// .private-terms.json (gitignored): { "never": ["..."], "warn": ["..."] }. A "never" term fails
// the sync (whole word, any case). A "warn" term prints a warning (whole word, exact case).
const termsSchema = z.strictObject({ never: z.array(z.string().min(1)), warn: z.array(z.string().min(1)) });
export const NO_TERMS = { never: [], warn: [] };
// Writing rules. They are warnings, since a faithful citation can need a dash from the source.
// The word list is split so the repo's own writing hook does not flag this file.
const BANNED_WORDS = ['del' + 've', 'tapes' + 'try', 'lever' + 'age', 'rob' + 'ust', 'seam' + 'less',
  'para' + 'digm', 'syn' + 'ergy', 'holis' + 'tic', 'util' + 'ize', 'stream' + 'line'];
const BANNED_RE = new RegExp(`\\b(?:${BANNED_WORDS.join('|')})\\w*`, 'i');
const DASH_RE = /[–—]/;

const SLIDE_WIDTHS = [1280, 960];

export function parseArgs(argv) {
  const opts = { fixtures: false, check: false };
  for (const arg of argv) {
    if (arg === '--fixtures') opts.fixtures = true;
    else if (arg === '--check') opts.check = true;
    else throw new Error(`unknown argument "${arg}"\n${USAGE}`);
  }
  return opts;
}

export function loadConfig(hubDir) {
  const file = path.join(hubDir, 'projects.config.json');
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    throw new Error(`cannot read ${file}: ${err.message}`);
  }
  const parsed = configSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`projects.config.json is invalid:\n  ${formatIssues(parsed.error.issues).join('\n  ')}`);
  }
  const dupes = parsed.data.projects.filter((s, i, all) => all.indexOf(s) !== i);
  if (dupes.length) throw new Error(`projects.config.json lists a slug twice: ${dupes.join(', ')}`);
  return parsed.data;
}

/** Reads .private-terms.json from the hub folder, or returns null when there is none. */
export function loadPrivateTerms(hubDir) {
  const file = path.join(hubDir, '.private-terms.json');
  if (!fs.existsSync(file)) return null;
  const parsed = termsSchema.safeParse(JSON.parse(fs.readFileSync(file, 'utf8')));
  if (!parsed.success) {
    throw new Error(`.private-terms.json is invalid:\n  ${formatIssues(parsed.error.issues).join('\n  ')}`);
  }
  return parsed.data;
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const termRe = (term, flags) => new RegExp(`(?<![A-Za-z0-9])${escapeRe(term)}(?![A-Za-z0-9])`, flags);

export function projectDir(hubDir, slug, fixtures) {
  return fixtures ? path.join(hubDir, 'fixtures', slug) : path.resolve(hubDir, '..', slug);
}

/** Collects [jsonPath, string] for every string value inside a parsed JSON value. */
function strings(value, at = []) {
  if (typeof value === 'string') return [[at.join('.'), value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, [...at, i]));
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([k, v]) => strings(v, [...at, k]));
  return [];
}

export function lintText(where, text, terms = NO_TERMS) {
  const errors = [];
  const warnings = [];
  for (const term of terms.never) {
    if (termRe(term, 'i').test(text)) errors.push(`${where}: mentions "${term}", which the hub never names`);
  }
  for (const term of terms.warn) {
    if (termRe(term, '').test(text)) warnings.push(`${where}: contains "${term}"; check that it is not a private reference`);
  }
  if (DASH_RE.test(text)) warnings.push(`${where}: contains an em or en dash`);
  const banned = text.match(BANNED_RE);
  if (banned) warnings.push(`${where}: contains the banned word "${banned[0]}"`);
  return { errors, warnings };
}

/** Reads a file's size, checks its signature against its type, and reads PNG dimensions. */
export function inspectFile(absPath, type) {
  let stat;
  try {
    stat = fs.statSync(absPath);
  } catch {
    return { error: 'file is missing' };
  }
  if (!stat.isFile()) return { error: 'is not a regular file' };
  if (stat.size === 0) return { error: 'file is empty' };
  const fd = fs.openSync(absPath, 'r');
  const head = Buffer.alloc(Math.min(stat.size, 8192));
  fs.readSync(fd, head, 0, head.length, 0);
  fs.closeSync(fd);
  const info = { bytes: stat.size };
  if (type === 'png') {
    const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    if (head.length < 24 || !head.subarray(0, 8).equals(sig) || head.toString('latin1', 12, 16) !== 'IHDR') {
      return { error: 'is not a PNG file (bad signature)' };
    }
    info.width = head.readUInt32BE(16);
    info.height = head.readUInt32BE(20);
  } else if (type === 'pdf') {
    if (head.toString('latin1', 0, 5) !== '%PDF-') return { error: 'is not a PDF file (bad signature)' };
  } else if (type === 'pptx' || type === 'xlsx' || type === 'zip') {
    if (head.toString('latin1', 0, 4) !== 'PK\u0003\u0004') return { error: `is not a ${type} file (not a zip archive)` };
  } else if (['md', 'csv', 'txt', 'json'].includes(type)) {
    if (head.includes(0)) return { error: 'is not a text file (contains NUL bytes)' };
  }
  return { info };
}

function gitInfo(dir) {
  const git = (...args) =>
    execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  try {
    // Only trust git when the project folder is itself the repo root, not a folder inside some other repo.
    if (fs.realpathSync(git('rev-parse', '--show-toplevel')) !== fs.realpathSync(dir)) return { commit: null, dirty: false };
    return { commit: git('rev-parse', '--short=12', 'HEAD'), dirty: git('status', '--porcelain').length > 0 };
  } catch {
    return { commit: null, dirty: false };
  }
}

/**
 * Validates one project folder. Returns { portfolio, files, errors, warnings }.
 * portfolio is null when the JSON is unreadable or fails the schema.
 */
export function inspectProject({ dir, slug, terms = NO_TERMS }) {
  const errors = [];
  const warnings = [];
  const file = path.join(dir, 'portfolio.json');
  const tag = `${slug}: `;
  let raw;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch {
    return { portfolio: null, files: {}, errors: [`${tag}missing ${file}`], warnings };
  }
  let json;
  try {
    json = JSON.parse(raw);
  } catch (err) {
    return { portfolio: null, files: {}, errors: [`${tag}${file} is not valid JSON: ${err.message}`], warnings };
  }
  const parsed = portfolioSchema.safeParse(json);
  if (!parsed.success) {
    return { portfolio: null, files: {}, errors: formatIssues(parsed.error.issues, tag), warnings };
  }
  const p = parsed.data;
  if (p.slug !== slug) errors.push(`${tag}slug is "${p.slug}" but projects.config.json lists "${slug}"`);

  for (const [where, value] of strings(json)) {
    const lint = lintText(`${tag}portfolio.json ${where}`, value, terms);
    errors.push(...lint.errors);
    warnings.push(...lint.warnings);
  }

  const files = {};
  for (const ref of referencedPaths(p)) {
    const { info, error } = inspectFile(path.join(dir, ref.path), ref.type);
    if (error) {
      errors.push(`${tag}${ref.role} "${ref.path}" ${error}`);
      continue;
    }
    files[ref.path] = info;
    if (ref.type === 'md') {
      const lint = lintText(`${tag}${ref.path}`, fs.readFileSync(path.join(dir, ref.path), 'utf8'), terms);
      errors.push(...lint.errors);
      warnings.push(...lint.warnings);
    }
  }

  p.downloads.forEach((d, i) => {
    const actual = files[d.path]?.bytes;
    if (actual !== undefined && actual !== d.bytes) {
      errors.push(`${tag}downloads[${i}] "${d.path}" says bytes ${d.bytes} but the file has ${actual} bytes`);
    }
  });

  const widthNote = (role, rel) => {
    const w = files[rel]?.width;
    if (w !== undefined && !SLIDE_WIDTHS.includes(w)) {
      warnings.push(`${tag}${role} "${rel}" is ${w} px wide; the contract expects 1280 (16:9) or 960 (4:3) at 96 dpi`);
    }
  };
  widthNote('cover', p.cover);
  const groupSources = new Map();
  for (const item of p.items) {
    widthNote(`items[${item.id}].after.image`, item.after.image);
    if (item.overlay && item.source) {
      const o = files[item.overlay];
      const s = files[item.source.image];
      if (o && s && (o.width !== s.width || o.height !== s.height)) {
        warnings.push(
          `${tag}items[${item.id}].overlay is ${o.width}x${o.height} but its source is ${s.width}x${s.height}; the overlay may be stale`,
        );
      }
    }
    if (item.overlay && !item.source) {
      warnings.push(`${tag}items[${item.id}] has an overlay but no source image to compare it with`);
    }
    const src = item.source ? item.source.image : null;
    if (groupSources.has(item.group) && groupSources.get(item.group) !== src) {
      warnings.push(`${tag}items in group "${item.group}" use different source images`);
    }
    if (!groupSources.has(item.group)) groupSources.set(item.group, src);
  }

  return { portfolio: errors.length ? null : p, files, errors, warnings };
}

function formatBytes(n) {
  return n >= 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} kB`;
}

/** Validates every configured project and, unless check is set, writes public/projects and content/. */
export function runSync({ hubDir = HUB_DIR, fixtures = false, check = false, log = console.log } = {}) {
  const config = loadConfig(hubDir);
  const terms = loadPrivateTerms(hubDir);
  if (!terms) log('note     no .private-terms.json here, so the private term check is skipped');
  const errors = [];
  const warnings = [];
  const results = [];
  for (const slug of config.projects) {
    const dir = projectDir(hubDir, slug, fixtures);
    const r = inspectProject({ dir, slug, terms: terms ?? NO_TERMS });
    errors.push(...r.errors);
    warnings.push(...r.warnings);
    if (r.portfolio) {
      const git = fixtures ? { commit: null, dirty: false } : gitInfo(dir);
      if (git.dirty) warnings.push(`${slug}: ${dir} has uncommitted changes; the synced files may not match commit ${git.commit}`);
      results.push({ slug, dir, ...r, ...git });
    }
  }
  const orders = new Map();
  for (const r of results) {
    const o = r.portfolio.order;
    if (orders.has(o)) errors.push(`${r.slug}: order ${o} is already used by ${orders.get(o)}`);
    else orders.set(o, r.slug);
  }

  for (const w of warnings) log(`warning  ${w}`);
  if (errors.length) {
    const list = errors.map((e) => `  ${e}`).join('\n');
    throw new Error(`sync failed with ${errors.length} problem${errors.length === 1 ? '' : 's'}:\n${list}`);
  }

  results.sort((a, b) => a.portfolio.order - b.portfolio.order);
  const content = contentSchema.parse({
    mode: fixtures ? 'fixtures' : 'repos',
    projects: results.map((r) => ({
      portfolio: r.portfolio,
      files: Object.fromEntries(Object.keys(r.files).sort().map((k) => [k, r.files[k]])),
      commit: r.commit,
      dirty: r.dirty,
    })),
  });

  for (const r of results) {
    const total = Object.values(r.files).reduce((sum, f) => sum + f.bytes, 0);
    const from = fixtures ? 'fixtures' : r.commit ? `commit ${r.commit}${r.dirty ? ' plus uncommitted changes' : ''}` : 'a folder outside git';
    log(`ok       ${r.slug} (order ${r.portfolio.order}): ${r.portfolio.items.length} items, ` +
      `${Object.keys(r.files).length} files, ${formatBytes(total)}, from ${from}`);
  }
  if (check) {
    log('check only: nothing written');
    return content;
  }

  // Build the new public/projects tree beside the old one, then swap, so a failed copy leaves the old tree intact.
  const target = path.join(hubDir, 'public', 'projects');
  const staging = path.join(hubDir, '.sync-staging');
  fs.rmSync(staging, { recursive: true, force: true });
  for (const r of results) {
    for (const rel of Object.keys(r.files)) {
      const dest = path.join(staging, r.slug, rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(path.join(r.dir, rel), dest);
    }
  }
  fs.mkdirSync(staging, { recursive: true });
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.rmSync(target, { recursive: true, force: true });
  fs.renameSync(staging, target);

  const contentFile = path.join(hubDir, 'content', 'projects.json');
  fs.mkdirSync(path.dirname(contentFile), { recursive: true });
  fs.writeFileSync(`${contentFile}.tmp`, `${JSON.stringify(content, null, 2)}\n`);
  fs.renameSync(`${contentFile}.tmp`, contentFile);
  log(`wrote    content/projects.json (${content.mode}) and public/projects/ for ${results.length} projects`);
  if (fixtures) log('note     fixture content is placeholder only; the build refuses it on Vercel or CI');
  return content;
}

function main() {
  try {
    runSync(parseArgs(process.argv.slice(2)));
  } catch (err) {
    console.error(`\n${err.message}\n`);
    process.exit(1);
  }
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) main();
