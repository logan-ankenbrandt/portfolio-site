#!/usr/bin/env node
// Writes fixtures/<slug>/: a portfolio.json in the exact contract shape plus every file it references,
// each one a labeled PLACEHOLDER. The site is developed against these until the project repos exist.
//
// macOS only (it uses ImageMagick and the system Arial). Run once:
//   npm install --no-save pptxgenjs@4.0.1 && node scripts/make-fixtures.mjs
// pptxgenjs is not a saved dependency, because only this script needs it.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import { HUB_DIR } from './sync-projects.mjs';

const FONT = '/System/Library/Fonts/Supplemental/Arial.ttf';
const FONT_BOLD = '/System/Library/Fonts/Supplemental/Arial Bold.ttf';
const HOW_MADE =
  'Claude Code agents rebuilt these slides from the source images as editable PowerPoint and drafted the logs. ' +
  'I approved the sources and the rules each rebuild follows, and checked every slide, number and log before publishing.';

const STYLE = {
  cover: { bg: '#E6EDF3', block: '#C5D3E0', ink: '#1F3B57', label: 'COVER' },
  source: { bg: '#F0E9DD', block: '#D9CDB8', ink: '#4A3F2E', label: 'SOURCE IMAGE (BEFORE)' },
  after: { bg: '#E2EBF4', block: '#B9CCDF', ink: '#1F3B57', label: 'REBUILD (AFTER)' },
  overlay: { bg: '#ECE7EF', block: '#CFC5D8', ink: '#3E3448', label: 'OVERLAY' },
};

const P = 'PLACEHOLDER';
const LINES = {
  changed: [
    [`${P} change. The real entry names one change made to the slide.`,
      `${P} reason. The real entry gives the design rule or the source evidence behind the change, in a sentence or two.`],
    [`${P} change to the title, which states the point instead of the topic.`,
      `${P} reason. A reader should get the message from the title alone.`],
    [`${P} change to labels, which move from a legend onto the marks.`,
      `${P} reason. Direct labels remove the back and forth between legend and chart.`],
  ],
  kept: [
    [`${P} kept. The real entry names something deliberately left as the source had it.`,
      `${P} reason. Keeping it preserves a definition, a caveat or the source's own hedge.`],
    [`${P} kept wording from the source.`, `${P} reason. The source's hedge is part of the claim.`],
  ],
  rejected: [
    [`${P} rejected. A change that was considered and not made.`,
      `${P} reason. What the change would have cost, such as accuracy, a caveat or traceability to the source.`],
    [`${P} rejected a second change.`, `${P} reason, one short sentence.`],
  ],
  flagged: [
    [`${P} flag. Something in the source looks wrong and was left for the author instead of fixed.`,
      `${P} evidence. The arithmetic or the page reference behind the flag.`],
  ],
  checks: [
    [`${P} check. A verification step, for example an overlay or a value read back from the file.`,
      `${P} result. What the check found.`],
    [`${P} check of fonts and sizes.`, `${P} result. Pass.`],
    [`${P} check that every number traces to the source.`, `${P} result. Pass, with the page cited in the log.`],
  ],
};

function log(counts) {
  const pick = (key, detail) => LINES[key].slice(0, counts[key]).map(([what, d]) => ({ what, [detail]: d }));
  return {
    changed: pick('changed', 'why'),
    kept: pick('kept', 'why'),
    rejected: pick('rejected', 'why'),
    flagged: pick('flagged', 'evidence'),
    checks: pick('checks', 'result'),
  };
}

function source(image, n) {
  return {
    image,
    title: `${P} source title ${n}`,
    credit: `${P} credit: author, agency and date of source ${n}`,
    url: `https://example.com/placeholder-source-${n}`,
    license: `${P} license line for source ${n}`,
    page: `${P} page ${n}`,
  };
}

function item({ id, group, kind, title, src, srcN, overlay, counts }) {
  const dir = `slides/${group}`;
  const variant = id.slice(group.length + 1);
  return {
    id,
    group,
    title: `${P} ${title}`,
    kind,
    summary: `${P} summary. The real summary says what this ${kind} version changes and keeps, in one or two sentences.`,
    source: src ? source(`${dir}/source.png`, srcN) : null,
    after: { image: `${dir}/${variant}.png`, pptx: `${dir}/${variant}.pptx`, pdf: `${dir}/${variant}.pdf` },
    overlay: overlay ? `${dir}/overlay-${variant}.png` : null,
    log: log(counts),
    logMarkdown: `${dir}/log-${variant}.md`,
  };
}

const FULL = { changed: 3, kept: 2, rejected: 2, flagged: 1, checks: 3 };
const LEAN = { changed: 2, kept: 1, rejected: 1, flagged: 0, checks: 2 };

// Pixel sizes per file: 16:9 slides are 1280 x 720 and 4:3 slides 960 x 720 at 96 dpi.
// The chart source is a portrait report figure, so its overlay matches the source size.
const PROJECTS = [
  {
    slug: 'slide-rebuild-log',
    title: 'Slide rebuild log',
    order: 1,
    skills: ['Slide Reconstruction', 'Presentation Design', 'Data Visualization', 'Visual Storytelling',
      'Content Editing', 'Technical Documentation', 'Microsoft PowerPoint', 'Attention to Detail'],
    items: [
      item({ id: '01-usage-revised', group: '01-usage', kind: 'revised', title: 'revised slide whose title states the point in the source\'s own hedged terms', src: true, srcN: 1, overlay: false, counts: FULL }),
      item({ id: '01-usage-faithful', group: '01-usage', kind: 'faithful', title: 'faithful rebuild of the usage slide', src: true, srcN: 1, overlay: true, counts: LEAN }),
      item({ id: '02-key-features-faithful', group: '02-key-features', kind: 'faithful', title: 'faithful rebuild of a 4:3 architecture slide', src: true, srcN: 2, overlay: true, counts: FULL }),
    ],
    sizes: { '02-key-features': [960, 720] },
    downloads: [['Deck with every slide (.pptx)', 'dist/deck.pptx'], ['Deck with every slide (PDF)', 'dist/deck.pdf']],
  },
  {
    slug: 'architecture-three-ways',
    title: 'One architecture, three ways',
    order: 2,
    skills: ['System Architecture', 'Technical Documentation', 'Visual Storytelling', 'Presentation Design',
      'Content Editing', 'Written Communication'],
    items: [
      item({ id: '01-layers-exec', group: '01-layers', kind: 'exec', title: 'executive slide that makes one point about the layers', src: true, srcN: 1, overlay: false, counts: FULL }),
      item({ id: '01-layers-engineer', group: '01-layers', kind: 'engineer', title: 'engineer slide with each layer API labeled', src: true, srcN: 1, overlay: false, counts: FULL }),
      item({ id: '02-brief-page', group: '02-brief', kind: 'brief', title: 'one-page architecture brief', src: false, srcN: 0, overlay: false, counts: LEAN }),
    ],
    sizes: { 'source.png': [960, 720] },
    downloads: [['Executive and engineer slides (.pptx)', 'dist/deck.pptx'], ['Architecture brief (PDF)', 'dist/brief.pdf']],
  },
  {
    slug: 'chart-rebuilds',
    title: 'Chart rebuilds',
    order: 3,
    skills: ['Data Visualization', 'Slide Reconstruction', 'Presentation Design', 'Visual Storytelling',
      'Attention to Detail'],
    items: [
      item({ id: '01-spending-faithful', group: '01-spending', kind: 'chart-faithful', title: 'native chart rebuilt to match the report figure', src: true, srcN: 1, overlay: true, counts: FULL }),
      item({ id: '01-spending-redesign', group: '01-spending', kind: 'chart-redesign', title: 'redesigned chart whose title states the finding', src: true, srcN: 1, overlay: false, counts: FULL }),
    ],
    sizes: { 'source.png': [600, 759], 'overlay-faithful.png': [600, 759] },
    downloads: [['Both charts (.pptx)', 'dist/charts.pptx'], ['Both charts (PDF)', 'dist/charts.pdf'], ['Chart data (CSV)', 'data/spending.csv']],
  },
];

function sizeFor(project, rel) {
  const name = path.basename(rel);
  if (project.sizes[name]) return project.sizes[name];
  const group = rel.split('/')[1];
  return project.sizes[group] ?? [1280, 720];
}

function placeholderPng(file, [w, h], role, caption) {
  const s = STYLE[role];
  const m = Math.round(w * 0.05);
  const args = ['-size', `${w}x${h}`, `xc:${s.bg}`, '-fill', s.block,
    '-draw', `rectangle ${m},${m} ${w - m},${m + Math.round(h * 0.1)}`,
    '-draw', `rectangle ${m},${h - m - Math.round(h * 0.05)} ${Math.round(w * 0.45)},${h - m}`,
    '-fill', 'none', '-stroke', s.block, '-strokewidth', String(Math.max(2, Math.round(w / 320))),
    '-draw', `rectangle 1,1 ${w - 2},${h - 2}`, '-stroke', 'none',
    '-fill', s.ink, '-gravity', 'center',
    '-font', FONT_BOLD, '-pointsize', String(Math.round(w / 11)), '-annotate', `+0-${Math.round(h * 0.06)}`, P,
    '-font', FONT_BOLD, '-pointsize', String(Math.round(w / 34)), '-annotate', `+0+${Math.round(h * 0.07)}`, s.label,
    '-font', FONT, '-pointsize', String(Math.round(w / 48)), '-annotate', `+0+${Math.round(h * 0.15)}`, caption,
    '-annotate', `+0+${Math.round(h * 0.21)}`, `${w} x ${h} px`, '-depth', '8', file];
  execFileSync('magick', args);
}

async function placeholderPptx(file, caption) {
  let PptxGenJS;
  try {
    PptxGenJS = (await import('pptxgenjs')).default;
  } catch {
    throw new Error('pptxgenjs is not installed. Run: npm install --no-save pptxgenjs@4.0.1');
  }
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  const slide = pptx.addSlide();
  slide.background = { color: 'E2EBF4' };
  slide.addText(P, { x: 0.5, y: 2.4, w: 12.33, h: 1.4, align: 'center', fontFace: 'Arial', fontSize: 66, bold: true, color: '1F3B57' });
  slide.addText(caption, { x: 0.5, y: 4.0, w: 12.33, h: 0.6, align: 'center', fontFace: 'Arial', fontSize: 18, color: '1F3B57' });
  await pptx.writeFile({ fileName: file });
}

function placeholderMd(it) {
  const section = (name, entries, detail) =>
    `## ${name}\n\n${entries.length ? entries.map((e) => `- ${e.what} ${detail}: ${e[detail.toLowerCase()]}`).join('\n') : '- None recorded.'}\n`;
  return [`# ${P} log for ${it.id}\n`, 'This file stands in for the real slide log from the project repo.\n',
    section('Changed', it.log.changed, 'Why'), section('Kept', it.log.kept, 'Why'),
    section('Rejected', it.log.rejected, 'Why'), section('Flagged', it.log.flagged, 'Evidence'),
    section('Checks', it.log.checks, 'Result')].join('\n');
}

async function main() {
  for (const proj of PROJECTS) {
    const root = path.join(HUB_DIR, 'fixtures', proj.slug);
    fs.rmSync(root, { recursive: true, force: true });
    const write = (rel) => {
      const abs = path.join(root, rel);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      return abs;
    };
    const cap = (rel) => `${proj.slug}/${rel}`;
    placeholderPng(write('renders/cover.png'), [1280, 720], 'cover', cap('renders/cover.png'));
    for (const it of proj.items) {
      if (it.source && !fs.existsSync(path.join(root, it.source.image))) {
        placeholderPng(write(it.source.image), sizeFor(proj, it.source.image), 'source', cap(it.source.image));
      }
      placeholderPng(write(it.after.image), sizeFor(proj, it.after.image), 'after', cap(it.after.image));
      if (it.overlay) placeholderPng(write(it.overlay), sizeFor(proj, it.overlay), 'overlay', cap(it.overlay));
      execFileSync('magick', [path.join(root, it.after.image), write(it.after.pdf)]);
      await placeholderPptx(write(it.after.pptx), cap(it.after.pptx));
      fs.writeFileSync(write(it.logMarkdown), placeholderMd(it));
    }
    const downloads = [];
    for (const [label, rel] of proj.downloads) {
      const abs = write(rel);
      if (rel.endsWith('.pptx')) await placeholderPptx(abs, cap(rel));
      else if (rel.endsWith('.pdf')) execFileSync('magick', [path.join(root, 'renders/cover.png'), abs]);
      else fs.writeFileSync(abs, `label,value\n${P} row one,0\n${P} row two,0\n`);
      downloads.push({ label: `${P} ${label}`, path: rel, bytes: fs.statSync(abs).size });
    }
    const portfolio = {
      slug: proj.slug,
      title: `${P} ${proj.title}`,
      oneLiner: `${P} one-liner. The real line says what the ${proj.title.toLowerCase()} project shows, in one sentence.`,
      repo: `https://github.com/logan-ankenbrandt/${proj.slug}`,
      order: proj.order,
      skills: proj.skills,
      howMade: HOW_MADE,
      cover: 'renders/cover.png',
      items: proj.items,
      downloads,
      credits: [`${P} credit line for source 1: title, author, agency, date, ID, URL and license.`,
        `${P} credit line for source 2, with what was left out of the published copy.`],
    };
    fs.writeFileSync(path.join(root, 'portfolio.json'), `${JSON.stringify(portfolio, null, 2)}\n`);
    console.log(`wrote fixtures/${proj.slug}`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
