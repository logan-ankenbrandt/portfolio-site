# Review before publishing

Claude Code agents wrote everything in this repo. Nothing has been pushed, no GitHub repo or Vercel
project exists, and nothing has been deployed. The site now builds from the three real project repos
(`npm run sync`, no fixtures), and `content/` and `public/projects/` hold that synced content. Work
through the items below, then run the commands in the last section yourself.

## 1. Copy to approve

All site copy lives in [`lib/site.ts`](lib/site.ts), except the headings in the page files.

1. The positioning line is a **DRAFT**. Current text: "I direct and check slide rebuilds in editable
   PowerPoint: clear charts, architecture diagrams and a log for every change." It sits under your
   name on the home page and on the one-pager. The earlier draft, "I rebuild technical slides as
   editable PowerPoint", implied you built the slides, which the honesty rule forbids, so the final
   review replaced it. A passive alternative: "Technical slides rebuilt as editable PowerPoint: clear
   charts, architecture diagrams and a log for every change."
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
6. The three project lines in `README.md` are each project's `oneLiner`. All three project titles
   now use sentence case and a curly apostrophe ("Chart rebuilds: GAO’s federal IT spending chart").
7. The only contact on the site is github.com/logan-ankenbrandt. There is no email or resume link.

## 2. The real sync, and what to check in it

`npm run sync` read `../slide-rebuild-log` (commit a25ad20), `../architecture-three-ways` (commit
de93d76) and `../chart-rebuilds` (commit ba1daa7), all clean. All three passed the contract, the file
checks and the private-term check with no warnings: 4, 3 and 2 items, 57 files in all. The project
agents reported slide-rebuild-log and architecture-three-ways as ready with caveats and chart-rebuilds
as ready (their caveats are in section 5). The sync still fails with a full list if any
`portfolio.json` breaks the contract, a file is missing, a byte count is wrong, or the text names a
term from `.private-terms.json` (gitignored, open it and add any names the site must never show).

Read these on the built site:

- The hero is the first item in slide-rebuild-log's `items` that has a source image: the revised
  "cFS has been used on 40+ NASA projects historically, about half of them at Goddard". The four log
  lines under it are the first changed, kept, rejected and flagged entries. The kept line now reads
  '"40+", "historically", "likely" and "dominant" exactly as the source phrases them.' A link under
  the hero images opens the faithful rebuild of the same slide with its overlay.
- The skills matrix picks one item per skill and project, by item kind and then keywords. The build
  printed no `matrix:` warning. Two cells read "Not in this project" because those projects do not list
  the skill: Data Visualization for architecture-three-ways and System Architecture for chart-rebuilds.
  For slide-rebuild-log, System Architecture points at the "cFS Key Features" faithful rebuild (the
  2015 layer diagram). Pin a different pick in `EVIDENCE_OVERRIDES` in `lib/site.ts` if you prefer.
- Credits on the home page are now grouped under each project's title. The projects cite the same
  NASA decks in their own words, so merging lines would have shown near-duplicates side by side.
- The not-affiliated line names only the agencies a page credits: "NASA or GAO" on the home page and
  the one-pager, "NASA" on the two NASA project pages and "GAO" on chart-rebuilds
  (`notAffiliatedFor` in `lib/site.ts`). No project uses a NIST source, so NIST is gone.
- Alt text comes from each item's kind, title, summary and source fields (`lib/format.ts`). Source
  images also get a one-sentence description of what they show, from `SOURCE_DESCRIPTIONS` in
  `lib/site.ts`. Read both once in the page source.
- Look at every source image on the project pages. In the screenshots no NASA insignia, GSFC banner,
  cFS logo or GAO logo is visible, and the published 2015 slide 8 copies are the masked ones.

## 3. Changes and checks in this pass

Changes:

- The home page's first screen at 1280 x 800 now shows the name, the positioning line, the featured
  title, both hero images with captions and all four log lines as text. At 1024 px and up the intro is
  tighter, the GitHub line under the name is hidden (the header links to GitHub), the hero summary moves
  below the log lines, and the log lines sit in four columns. Phone and tablet layouts are unchanged.
- Image captions keep "Full size" (and the overlay toggle) on the caption's first line beside a long
  credit, instead of wrapping onto a line of their own.
- Project pages label each group's heading "Source" instead of "Source slide", since the GAO source is
  a report figure. Source alt text says "Source, before the rebuild" for the same reason.
- `scripts/screenshots.sh` takes its capture heights from `H390` and `H1280`. The project pages are
  17,000 to 27,000 px tall, past what a single Chrome shot can hold, so `scripts/screenshots-long.mjs`
  captures them in segments through the DevTools protocol.

Checks, against the real content:

- `content/` and `public/` contain no fixture or placeholder text (`grep -ri "fixture\|placeholder"`
  finds nothing), `content/projects.json` has mode `repos`, and the built HTML has no fixture banner.
- `npm test` passes all 19 tests, `npm run typecheck` and `npm run build` pass, and `out/` holds `/`,
  `/one-pager/`, the three `/projects/<slug>/` pages and `404.html`.
- `node scripts/check-browser.mjs` passes 23 of 23: no horizontal scroll at 390 px on all five pages,
  alt text on every image, all 68 images and downloads served, the hero tabs by click, ArrowRight and
  Home, the overlay toggle by click and Space, and both images side by side at 1280 px.
- The one-pager printed from headless Chrome is one US Letter page.
- Screenshots at 390 and 1280 px of `/`, `/one-pager/` and all three project pages were read one by
  one. They are in `scratch/screenshots-final/` (project pages in `long/`), which is not committed.
  One small mismatch stays: when a caption has the overlay toggle, its row sits about 5 px lower than
  the caption beside it, because the button is taller than a text line.

## 4. Commands for later, yours to run

Agents never push, create repos or deploy. Run these from this folder, in this order.

The real content is already synced and committed. Run this again after any change in a project repo,
and before deploying if you are unsure the hub is current. The build refuses fixture content on Vercel:

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

## 5. Caveats the project agents reported

These are in each project's own logs or README. They are listed here so the site review covers them.

slide-rebuild-log (ready with caveats):

- No deck was opened in PowerPoint. The 3D pies with combined data labels and the manual label offsets
  are the parts most likely to differ there. The log says so under "Not checked".
- LibreOffice ignores the 3D depth setting and draws no leader lines, so the faithful render's pie
  sides are thinner than the source's and the Platform and Spacesuit leaders are missing. Both are
  logged.
- The 01 faithful slide types the centers and directorates percentages as text to keep the source's
  rounding, so they do not update after Edit Data. Logged.
- Two revised slides use labels under 14 pt (11 pt and 12 pt), logged as exceptions. Nothing is under
  10 pt.
- The center names in the 01 revised slide match NTRS 20230002444 slide 13 word for word (checked in
  the final review).
- `src/lib.js` still exports an unused `chartLabelPatch`. It was left in place pending your call.

architecture-three-ways (ready with caveats):

- The private names in that repo's history were removed from `main` with `git filter-branch`: the
  one regex line in `src/check_writing.py` became `NEVER = []` in every commit from 41c8367 on, and
  the final tree is byte-identical (tree 9b91d27). The old commits are still reachable from the backup
  ref `refs/original/refs/heads/main`. Delete that ref before any push (REVIEW-PACKET.md section 7
  has the commands), and push `main` only, never `--mirror`.
- Two sources come from outside the shared NTRS set: the nasa/cFS README and the cFE Application
  Developers Guide (Apache 2.0, committed unmodified with digests). Approve them, or every claim that
  cites them comes out of the brief and logs.
- The executive slide colors the whole "Platform support (PSP)" cell orange. In the 2015 legend the
  cFE PSP API itself is NASA maintained and only the packages are mission developed. A split cell is
  the alternative.
- The brief's 10 pt reference list was not raised to 11 pt, and the message-path source line wraps to
  three lines. Both pass the checks.

chart-rebuilds (ready):

- No deck was opened in PowerPoint, and renders use Liberation Sans in place of Arial. Both are
  logged.
- The faithful slide's footer sits 0.28 in from the bottom edge, inside the 0.5 in margin, because the
  figure fills the slide height at its printed size. Logged.
