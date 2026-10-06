import type { Item, Kind, Portfolio } from './content';

export const KIND_LABEL: Record<Kind, string> = {
  faithful: 'Faithful rebuild',
  revised: 'Revised slide',
  'chart-faithful': 'Chart rebuild',
  'chart-redesign': 'Chart redesign',
  exec: 'Executive slide',
  engineer: 'Engineer slide',
  brief: 'Architecture brief',
};

export const KIND_NOTE: Record<Kind, string> = {
  faithful: 'Matches the source as closely as possible, as editable PowerPoint.',
  revised: 'Keeps the facts and caveats, and changes the design and title to make one point.',
  'chart-faithful': 'Rebuilds the source chart as a native, editable PowerPoint chart.',
  'chart-redesign': 'Redesigns the chart around one finding, with every value from the source.',
  exec: 'The architecture as one point for an executive audience.',
  engineer: 'The architecture with the detail an engineer needs.',
  brief: 'A one-page written brief of the architecture.',
};

/** 38 kB, 1.2 MB (SI units, as macOS reports them). */
export function formatBytes(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(n / 1e3))} kB`;
}

const FILE_TYPE: Record<string, string> = {
  pptx: 'PowerPoint',
  pdf: 'PDF',
  md: 'Markdown',
  csv: 'CSV',
  png: 'PNG image',
  json: 'JSON',
  txt: 'Text',
  xlsx: 'Excel',
  zip: 'Zip archive',
};

export function fileType(rel: string): string {
  const ext = rel.split('.').pop()?.toLowerCase() ?? '';
  return FILE_TYPE[ext] ?? ext.toUpperCase();
}

export function fileName(rel: string): string {
  return rel.split('/').pop() ?? rel;
}

// Alt text. Every slide image gets a summary of what it shows, built from the item's own fields.
export function sourceAlt(item: Item): string {
  const s = item.source;
  if (!s) return '';
  return `Source slide, before the rebuild: "${s.title}" (${s.page}), ${s.credit}.`;
}

export function afterAlt(item: Item): string {
  return `${KIND_LABEL[item.kind]}, after: ${item.title}. ${item.summary}`;
}

export function overlayAlt(item: Item): string {
  const s = item.source;
  return `Overlay check: the rebuild at 50 percent opacity over the source slide${s ? ` "${s.title}"` : ''}. Where they match, edges look single and sharp.`;
}

export function coverAlt(p: Portfolio): string {
  return `Cover slide for ${p.title}. ${p.oneLiner}`;
}
