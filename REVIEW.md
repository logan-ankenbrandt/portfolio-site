# Review before publishing

Claude Code agents wrote everything in this repo. Nothing has been pushed, no GitHub repo or Vercel
project exists, and nothing has been deployed. The site was built and checked against labeled
placeholder fixtures, because the three project repos had no `portfolio.json` yet. Work through the
items below, then run the commands in the last section yourself.

## 1. Copy to approve

All site copy lives in [`lib/site.ts`](lib/site.ts), except the headings in the page files.

1. The positioning line is a **DRAFT**. Current text: "I rebuild technical slides as editable
   PowerPoint: clear charts, architecture diagrams and a log for every change." It sits under your
   name on the home page and on the one-pager. "I rebuild" can read as rebuilt by hand, while agents
   did the rebuilds. The "How this was made" section on the same page says so plainly. If the first
   line should not lean on that, two alternatives:
   - "Technical slides rebuilt as editable PowerPoint: clear charts, architecture diagrams and a log
     for every change."
   - "I direct and check slide rebuilds in editable PowerPoint: clear charts, architecture diagrams
     and a log for every change."
2. The how-made note (`howMade`) reads: "Claude Code agents rebuilt these slides from the source
   images as editable PowerPoint, drafted the logs and built this site. I chose the sources, set the
   rules each rebuild follows, and checked every slide, number and log before publishing." The last
   clause is a claim about you. Do the checking first, or change the clause.
3. The four rules (`rules`) under "How this was made" restate the rules the project agents were given:
   numbers trace to the source, faithful rebuilds match the source, revised slides keep hedges and
   caveats, and logs list what changed, was kept, was rejected and was flagged. Confirm they match what
   the projects did.
4. The meta description (`description`) and the Open Graph card (`app/opengraph-image.png`) need a
   read. The card shows your name, "Slide reconstruction portfolio", "Technical slides rebuilt as
   editable PowerPoint, with a log for every change.", the URL and a pie-to-bars drawing. Redraw it
   with `node scripts/make-brand-assets.mjs` after any text change.
5. The section headings in `app/page.tsx` are "Three case studies" (the number follows the project
   count), "Each skill, with a slide or log that shows it", "How this was made" and "Credits".
6. The three project lines in `README.md` come from the plan. Replace them with each project's final
   `oneLiner` once the projects are done.
7. The only contact on the site is github.com/logan-ankenbrandt. There is no email or resume link.

## 2. After the real sync, check the content

`npm run sync` reads `../slide-rebuild-log`, `../architecture-three-ways` and `../chart-rebuilds`.
It fails with a full list if any `portfolio.json` breaks the contract, a file is missing, a byte count
is wrong, or the text or a log names a term from `.private-terms.json`. That file sits in this folder,
is gitignored, and lists the names the site must never show; open it and add any you want. Without it
the sync skips that check and says so. Warnings (dashes, the banned word list, a warn term, a repo
with uncommitted changes, slide widths other than 1280 or 960) print but do not stop it. Then build,
preview and check these:

- The hero is the first item in slide-rebuild-log's `items` that has a source image, so item order in
  that `portfolio.json` decides it. The four log lines under it are the first changed, kept, rejected
  and flagged entries.
- The skills matrix picks one item per skill and project, by item kind first and then by keywords in
  the title, summary or source title. Pin a wrong pick in `EVIDENCE_OVERRIDES` in `lib/site.ts`. The
  build prints a `matrix:` warning when a project lists a skill and no item matched, and a skill that
  no project shows is left out of the table.
- Alt text is built from each item's kind, title, summary and source fields (`lib/format.ts`). Read it
  once in the page source. To change it, change those fields in the project's `portfolio.json`.
- Home page credits are every project's `credits` lines with duplicates removed. Check each one, and
  the line "Not affiliated with or endorsed by NASA, GAO or NIST."
- Look at every source image on the project pages. No NASA insignia, logotype, GSFC banner, cFS logo
  or other agency logo should be visible.
- Project pages say "Files synced from commit ..." when the project folder is a git repo. Sync from
  clean, committed project repos so that line names a real commit.

## 3. Checks already run, against the fixtures

- `npm test` passes all 19 sync and contract tests. Six rules (unknown keys, the repo URL, byte
  counts, private terms, a first sync into an empty hub, the dash warning's pattern) were broken on
  purpose to confirm that their tests fail.
- An early version of the sync script spelled the private terms out in code. The history (never
  pushed) was rewritten so that no commit contains them; `git grep` over every commit finds none.
- `npm run typecheck` and `npm run build` pass, and `out/` holds `/`, `/one-pager/`, the three
  `/projects/<slug>/` pages and `404.html`.
- `node scripts/check-browser.mjs` passes 23 checks: no horizontal scroll at 390 px on all five
  pages, alt text on every image, every image and download served, the tabs by click, ArrowRight and
  Home, the overlay toggle by click and Space, and both images side by side at 1280 px.
- `VERCEL=1 npm run build` fails with the fixture message, so placeholder content cannot deploy.
- The one-pager prints on one US Letter page.
- Screenshots of `/`, all three project pages and `/one-pager/` at 390 and 1280 px are in
  `scratch/screenshots/`, which is not committed. Take them again after the real sync with
  `bash scripts/screenshots.sh` while `npm run preview` runs.

## 4. Commands for later, yours to run

Agents never push, create repos or deploy. Run these from this folder, in this order.

Sync the real content first. The build refuses fixture content on Vercel, so this step is required:

```sh
npm ci
npm run sync
npm test
npm run build
npm run preview          # open http://127.0.0.1:4173 and read every page
git add content public/projects
git commit -m "Sync project content"
```

Push the three project repos before the hub, so the repo links on the site resolve. Then the hub:

```sh
gh repo create logan-ankenbrandt/portfolio --public --source=. --remote=origin \
  --description "Slide reconstruction portfolio: static site for three case studies"
git push -u origin main
```

On Vercel the project name sets the domain, so name the project `logan-ankenbrandt`:

```sh
vercel login
vercel link              # personal scope; create a new project named logan-ankenbrandt
vercel deploy            # preview deploy: open the URL it prints and check it
vercel deploy --prod
```

If `vercel link` offers to connect the GitHub repo, decline, so that every deploy stays a manual step.
After the first production deploy, open the domain Vercel assigned in a logged-out browser. If it is
not `logan-ankenbrandt.vercel.app` (the fallback is `loganankenbrandt.vercel.app`), set `url` in
`lib/site.ts` to the real domain, then rebuild, commit and deploy again. The canonical URLs, the Open
Graph image URL and the one-pager's printed links all come from it.

This file can stay in the repo or be deleted before pushing. It names no employer.
