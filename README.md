# portfolio

Source for [logan-ankenbrandt.vercel.app](https://logan-ankenbrandt.vercel.app), a static site that
shows three slide reconstruction projects, each in its own repo:

- [slide-rebuild-log](https://github.com/logan-ankenbrandt/slide-rebuild-log): Two public NASA slides rebuilt as editable PowerPoint, each once faithfully and once revised, with a log of every change, every rejected change and every number check.
- [architecture-three-ways](https://github.com/logan-ankenbrandt/architecture-three-ways): NASA’s layered flight software framework, documented from NASA’s public slides and training memo as an executive slide, an engineer slide and a one-page brief, with every quote cited to its page.
- [chart-rebuilds](https://github.com/logan-ankenbrandt/chart-rebuilds): A dense GAO chart, 24 agencies with every value printed, rebuilt as a native PowerPoint chart, checked against its own printed totals, then redesigned around its one finding.

## How this was made

Claude Code agents built this site and its sync and check scripts, and rebuilt the slides and drafted
the logs in the project repos. I approved the sources and the rules each rebuild follows, and checked
every slide, number and log before publishing.

## How it works

Each project repo has a `portfolio.json` at its root. Its shape is the contract in
[`lib/contract.mjs`](lib/contract.mjs), a strict zod schema: an unknown key, a missing field, a kind
outside the list or a skill outside the listing's words fails it.

1. `npm run sync` reads `../<slug>/portfolio.json` for each slug in `projects.config.json`. It
   validates the JSON, checks that every referenced file exists and matches its type (PNG, PDF, PPTX,
   Markdown), checks the download byte counts and the repo URL, and fails with the full list of
   problems. When a local `.private-terms.json` exists (gitignored, never published), text that
   names one of its terms fails the sync too. On success it copies the referenced files into `public/projects/<slug>/` and writes
   `content/projects.json`, with each PNG's size and the project repo's commit.
2. Both outputs are committed, so a deploy builds only from files in this repo.
3. `npm run build` is a Next.js static export. It validates `content/projects.json` again, checks
   every synced file, and writes plain HTML, CSS, JS and the synced files to `out/`. There are no API
   routes, no middleware, no request-time code, no analytics, no cookies and no external fonts or
   scripts.

The site was developed against labeled placeholder fixtures (`fixtures/<slug>/`). The sync reads them
only with `--fixtures`, a fixture build shows a banner on every page, and the build refuses fixture
content on Vercel or CI.

## Commands

| Command | What it does |
| --- | --- |
| `npm ci` | Install the pinned dependencies. |
| `npm run sync` | Validate and copy the project repos (`../<slug>`). |
| `npm run sync -- --check` | Validate only, write nothing. |
| `npm run sync -- --fixtures` | Use the placeholder fixtures instead, for local work. |
| `npm test` | Contract and sync tests (`node:test`). |
| `npm run typecheck` | TypeScript, no emit. |
| `npm run build` | Static export to `out/`. |
| `npm run preview` | Serve `out/` at http://127.0.0.1:4173. |
| `node scripts/check-browser.mjs` | Headless Chrome checks against the preview: no horizontal scroll at 390 px, alt text, every image and download served, tabs and overlay toggle by mouse and keyboard. |
| `bash scripts/screenshots.sh` | Full-page screenshots at 390 and 1280 px into `scratch/screenshots/`. |
| `node scripts/screenshots-long.mjs [outdir] [path ...]` | Screenshots of long pages (the project pages) at 390 and 1280 px, cut into segments of at most 2000 px. |
| `node scripts/make-brand-assets.mjs` | Redraw the Open Graph card and icons in `app/`. |
| `node scripts/make-fixtures.mjs` | Regenerate the placeholder fixtures (needs `npm install --no-save pptxgenjs@4.0.1`). |

The last five scripts expect macOS with Google Chrome and ImageMagick installed.

## Layout

```
app/                 pages: home, /projects/[slug], /one-pager, 404; OG card and icons
components/          before/after viewer, log, cards, skills matrix, downloads
lib/contract.mjs     the portfolio.json contract (shared by the sync and the build)
lib/content.ts       build-time loading and checks of content/projects.json
lib/evidence.ts      picks the item behind each cell of the skills matrix
lib/site.ts          site copy, links, matrix rules and pinned evidence
scripts/             sync, tests, fixtures, brand assets, screenshots, browser checks
content/             synced content (committed)
public/projects/     synced files (committed)
fixtures/            placeholder projects for local development
```

## Licenses

Code: MIT ([LICENSE](LICENSE)). Site text and brand images: CC BY 4.0
([LICENSE-content](LICENSE-content)). Synced project content keeps the license of its repo. The source
slides and figures are US government works, credited on the site and in each project's CREDITS.md.

Not affiliated with or endorsed by NASA or GAO.
