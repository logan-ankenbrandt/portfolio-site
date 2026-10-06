// The home page's skills-to-evidence matrix: for each listing skill and each project, one item that shows it.
import { itemUrl, type Content, type Item, type SyncedProject } from './content';
import { EVIDENCE_OVERRIDES, MATRIX, type MatrixRule } from './site';

export type EvidenceCell = { href: string; item: Item; project: SyncedProject } | null;
export type EvidenceRow = { skill: string; cells: EvidenceCell[] };

const logSize = (item: Item) =>
  item.log.changed.length + item.log.kept.length + item.log.rejected.length + item.log.flagged.length + item.log.checks.length;

function pick(rule: MatrixRule, project: SyncedProject): Item | null {
  const { slug, items, skills } = project.portfolio;
  const pinned = EVIDENCE_OVERRIDES[rule.skill]?.[slug];
  if (pinned) {
    const item = items.find((i) => i.id === pinned);
    if (!item) throw new Error(`EVIDENCE_OVERRIDES pins "${rule.skill}" in ${slug} to "${pinned}", which is not an item there`);
    return item;
  }
  if (!(skills as readonly string[]).includes(rule.skill)) return null;
  for (const kind of rule.kinds) {
    const item = items.find((i) => i.kind === kind);
    if (item) return item;
  }
  if (rule.keywords) {
    const re = rule.keywords;
    const item = items.find((i) => re.test(`${i.title} ${i.summary} ${i.source?.title ?? ''}`));
    if (item) return item;
  }
  if (rule.longestLog) {
    return items.reduce((best, i) => (logSize(i) > logSize(best) ? i : best), items[0]);
  }
  return null;
}

/** Rows with no evidence in any project are left out rather than shown empty. */
export function buildEvidence(content: Content): EvidenceRow[] {
  return MATRIX.map((rule) => ({
    skill: rule.skill,
    cells: content.projects.map((project) => {
      const item = pick(rule, project);
      if (!item && (project.portfolio.skills as readonly string[]).includes(rule.skill)) {
        console.warn(`matrix: ${project.portfolio.slug} lists "${rule.skill}" but no item matched; pin one in EVIDENCE_OVERRIDES (lib/site.ts)`);
      }
      return item ? { item, project, href: itemUrl(project.portfolio.slug, item.id, rule.toLog) } : null;
    }),
  })).filter((row) => row.cells.some(Boolean));
}
