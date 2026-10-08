# cFS has been used on 40+ NASA projects historically, about half of them at Goddard

Log for the revised slide in `01-cfs-usage`.

Three 3D pies become three sorted bar charts under an action title in the source's own hedged terms, led by the centers chart that carries the title. Counts stay counts, the segment shares stay as printed, and a footnote says why those shares cannot be a split of the 40 projects.

Source: Ashok Prajapati, NASA Goddard Space Flight Center, 2024. NASA Technical Reports Server 20240004389. Slide 5 of 23, "cFS Usage and Impact At NASA". https://ntrs.nasa.gov/citations/20240004389. License: Work of the US Gov. Public Use Permitted.

Files: `revised.pptx`, `revised.pdf`, `revised.png`.

How this was made: Claude Code agents rebuilt these slides from the source images as editable PowerPoint and drafted the logs. I chose the sources, set the rules each rebuild follows, and checked every slide, number and log before publishing.

## Changed

- Changed: The topic title "cFS Usage and Impact At NASA" is now the action title "cFS has been used on 40+ NASA projects historically, about half of them at Goddard".
  Why: A reader gets the point from the title alone. "40+" and "historically" are the source's own hedges, and 19 of 40 projects at Goddard (47.5%) is about half.
- Changed: The three 3D pies are three sorted horizontal bar charts with direct value labels, no legend and no value axis.
  Why: Bars on a shared baseline compare more accurately than tilted pie slices, sorting puts the largest first, and labels on the bars remove the trip to a legend.
- Changed: The centers chart takes the left column at 14 pt. The directorates and segments charts are smaller and stacked on the right, where they share one bar baseline.
  Why: The title is about the project count and Goddard, so its evidence gets the most room. The other two charts support it.
- Changed: The centers and directorates charts show project counts (n = 40). The segments chart shows the printed percentages.
  Why: The first two pies print counts that total 40. The segment pie prints only percentages, and no split of 40 projects gives them, so it keeps its own unit.
- Changed: The chart headings say "Projects" where the source's pie titles say "CFS Applications".
  Why: The center and directorate counts each total 40, and the source's caption says cFS is "on 40+ projects historically", so the slide reads the counted applications as projects. The segment chart keeps "applications" in its data name because its unit is unknown.
- Changed: Goddard's bar is orange and every other bar is blue.
  Why: One accent marks the bar the title is about.
- Changed: The segment bars are muted gray, under the heading "Share by segment, as printed (labels total 103%)".
  Why: Those shares cannot be read against the 40 projects (see the flags), so they are quieter than the counts, and the heading says so where the reader looks.
- Changed: Center abbreviations are spelled out with the abbreviation kept in parentheses, for example "Goddard (GSFC)". The directorates keep the abbreviations the source prints: SMD, STMD, ESDMD, ARMD and SOMD.
  Why: The center names match the list on NTRS 20230002444 slide 13. No source in this repo spells out the directorate names, so they stay as printed (see Rejected).
- Changed: The yellow callout and the lilac footer banner are two gray notes in the left column, with their wording unchanged.
  Why: They are context, not data. Without the strong fills they no longer compete with the title.
- Changed: The captions are plain statements without the exclamation marks and the final period. The directorates caption, which holds the "40+ projects" claim, sits under the centers chart.
  Why: That caption is the source of the title's "40+" and "historically", so it sits with the title's evidence. The words are the source's.
- Changed: A footnote says the segment shares are as printed, total 103%, and could not come from 40 projects (the smallest total that fits is 57).
  Why: Without it a reader comparing the panels would assume the segment chart also counts the 40 projects.
- Changed: The two supporting charts use 11 pt labels, under the 14 pt body size.
  Why: That lets all 21 rows fit beside the main chart without dropping a segment. The main chart, captions and notes are 14 pt, and nothing on the slide is under 10 pt.
- Changed: The page is 13.333 x 7.5 in instead of 10 x 5.625 in, with a source line and the portfolio footer.
  Why: Same 16:9 shape at PowerPoint's default widescreen size, which leaves room for a 28 pt title and 14 pt body text inside 0.5 in margins.

## Kept

- Kept: "40+", "historically", "likely" and "dominant" exactly as the source phrases them.
  Why: They are the author's claims and hedges. The revision makes none of them stronger or weaker.
- Kept: "approved by HEO directorate" in the ISwSIS note.
  Why: It is the author's wording. The mismatch with the ESDMD and SOMD names on the pie is flagged instead of edited.
- Kept: "cFS is used at 6 NASA Centers", although a 2023 NASA deck lists seven.
  Why: Changing it would mix two sources on one slide. The conflict is flagged for the author.
- Kept: All 16 segments, including the ten at 2%.
  Why: Grouping small segments into "Other" would change what the author chose to show.
- Kept: Every printed value.
  Why: Nothing on the slide is recomputed or rounded again.

## Considered and rejected

- Rejected: Converting the segment percentages to project counts.
  Why: The source prints no counts for that pie and no split of 40 projects gives its labels, so any count would be invented.
- Rejected: Scaling the segment percentages to total 100%.
  Why: That changes printed values without knowing the true counts.
- Rejected: Flat 2D pies or one stacked bar per breakdown.
  Why: Six to sixteen slices with small differences are hard to compare by angle, and stacked segments share a baseline only at the ends.
- Rejected: Adding Kennedy as a seventh center with zero projects.
  Why: The 2024 slide has no data for Kennedy. A zero bar would state a count no source gives.
- Rejected: A title that says cFS is the most used flight software in the world.
  Why: The source hedges that claim with "likely" and gives no data for it on this slide. The title uses the claim the charts support.
- Rejected: Spelling out the directorate names, for example "Science" for SMD.
  Why: No source in this repo prints them, so the names would be unsourced text on the slide. The 02 revised slide follows the same rule for PSP, TSP and RTOS.

## Flagged for the author

- Flagged: The segment pie's labels total 103%.
  Evidence: 4 + 5 + 4 + 7 + 28 + 2 + 2 + 28 + 2 + 2 + 4 + 2 + 7 + 2 + 2 + 2 = 103, from the 16 labels on page 5 read at 200 dpi. The other two pies total 100%.
- Flagged: The segment pie cannot be a split of the 40 projects the other two pies count.
  Evidence: At 40 projects every share is a multiple of 2.5%, so no count prints as 4% (1/40 = 2.5%, 2/40 = 5%), and three segments print 4%. The smallest total that reproduces all 16 labels is 57, for example Payload and Spacecraft at 16 each (28.07%). The source prints no counts, so 57 is a lower bound and not the real base.
- Flagged: Six centers on this slide, seven in a 2023 NASA deck.
  Evidence: Page 5 says "cFS is used at 6 NASA Centers!" and its pie has six centers. NTRS 20230002444, slide 13, says "In use at seven NASA centers:" and adds Kennedy Space Center. That deck's speaker notes describe Kennedy's use as "Evaluation for use on UAVs and sounding rockets", which may be why the 2024 count leaves it out.
- Flagged: The callout names the HEO directorate while the directorates pie uses ESDMD and SOMD.
  Evidence: Callout on page 5: "cFS named by ISwSIS (and approved by HEO directorate) as the standard FSW framework". The pie labels read "ESDMD, 9, 23%" and "SOMD, 2, 5%" and it has no HEO slice. A reader who knows only one set of names may not connect them.
- Flagged: One project prints as 2% for Glenn and as 3% for Marshall.
  Evidence: Both centers show 1 project of 40, which is 2.5%. The center labels follow no single rounding rule: round half up would total 102% and round half to even 99%, while the printed labels total 100%.

## Checks

- Checked: Pie totals, read from page 5 at 200 dpi.
  Result: Centers 5 + 1 + 19 + 10 + 4 + 1 = 40 projects and 12 + 2 + 48 + 25 + 10 + 3 = 100%. Directorates 3 + 15 + 11 + 9 + 2 = 40 projects and 7 + 37 + 28 + 23 + 5 = 100%.
- Checked: Sum of the segment labels.
  Result: 16 labels, total 103%.
- Checked: Smallest number of projects consistent with every printed segment percentage (each segment at least 1).
  Result: 57, under round half up and under either direction at exact halves (tools/checks.py, then a separate script written for this log, which agreed). 40 is impossible.
- Checked: Centers on the 2024 slide against NTRS 20230002444 slide 13.
  Result: 6 in the 2024 pie and caption, 7 in the 2023 list. Kennedy Space Center is the difference.
- Checked: HEO wording against the pie's directorate names.
  Result: "HEO" appears only in the callout. The pie's five slices are ARMD, SMD, STMD, ESDMD and SOMD.
- Checked: Chart values read back from revised.pptx against data.csv.
  Result: Pass: 6 center counts, 5 directorate counts and 16 segment percentages match.
- Checked: Deck inspector (tools/inspect.py): native charts with workbooks, no picture over 15% of the slide, nothing off the slide, Arial only, nothing under 10 pt.
  Result: Pass.
- Checked: Type, color and contrast.
  Result: Title 28 pt bold, main heading 16 pt bold, side headings 14 pt bold, captions, notes and main chart labels 14 pt, side chart labels 11 pt, footnote and source line 10.5 pt, footer 10 pt. Dark text #1F2328 on white is 15.8:1 and on the note gray #F4F6F8 14.6:1, and the muted gray #5B6470 is 6.0:1. Accents: blue #2F5D8A and orange #D9822B. Segment bars #8C959F are 3.0:1 against white.
- Checked: Layout, checked by eye on the 96 dpi render.
  Result: Nothing overlaps, margins are at least 0.5 in, and the directorates and segments bars start at the same x (867 px at 1280 px wide).
