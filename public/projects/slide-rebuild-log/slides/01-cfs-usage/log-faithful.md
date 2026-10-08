# cFS Usage and Impact At NASA (faithful rebuild)

Log for the faithful rebuild in `01-cfs-usage`.

The 2024 usage slide at its own size and positions, with the three pasted 3D pie pictures rebuilt as native 3D pie charts whose labels are chart data labels tied to the data. Every printed word and value is kept as printed, including the ones that do not add up.

Source: Ashok Prajapati, NASA Goddard Space Flight Center, 2024. NASA Technical Reports Server 20240004389. Slide 5 of 23, "cFS Usage and Impact At NASA". https://ntrs.nasa.gov/citations/20240004389. License: Work of the US Gov. Public Use Permitted.

Files: `faithful.pptx`, `faithful.pdf`, `faithful.png`, `overlay.png`.

How this was made: Claude Code agents rebuilt these slides from the source images as editable PowerPoint and drafted the logs. I approved the sources and the rules each rebuild follows, and checked every slide, number and log before publishing.

## Changed

- Changed: The three pasted 3D pie pictures are native 3D pie charts with their data in an embedded workbook.
  Why: In the source the pies are raster images, so no value on them can be edited or checked. Each chart keeps the source's slice order and is sized and tilted to its source pie: the chart frames are centered on the source pies, and tilts of 52, 60 and 63 degrees give the source's height to width ratios of 0.83, 0.87 and 0.89.
- Changed: The 27 pie labels are chart data labels. In each label the category name and the value are fields tied to the chart data, and the label is moved to the center of its source label box.
  Why: Edit Data then changes the names and counts on the labels too. Each move runs from where LibreOffice first places the label to the source position, measured with tools/pielabels.py.
- Changed: On the center and directorate pies, the printed percentage in each label is typed text, not a computed field.
  Why: The printed percentages follow no single rounding rule (one project prints as 2% for Glenn and as 3% for Marshall), so a computed percentage would print different numbers. The cost is that these percentages do not update after an edit in Edit Data. The segment labels show the value itself, so they do update.
- Changed: Labels are Arial Bold, 7 pt on the centers and segments pies and 8 pt on the directorates pie.
  Why: The source labels use a narrower typeface. At these sizes each box is as wide as the source's within about 6 pt. The boxes are 2 to 6 pt shorter (12 pt for the source's taller NASA LARC box), because LibreOffice draws a label box tight around its text.
- Changed: The sides of the pies are thinner than in the source.
  Why: LibreOffice draws a 3D pie's side at a fixed thickness and ignores the depth setting, so the source's deeper sides cannot be matched in the render.
- Changed: The title's shadow and the two gold rules are native: a text shadow, and gradient-filled rectangles with stops sampled from the 200 dpi render.
  Why: In the source they are pictures. Native versions keep the look with no image on the slide.
- Changed: The portfolio footer sits in the bottom left, where the source has no text.
  Why: Every rebuilt slide says it is a portfolio reconstruction and not a NASA document.

## Kept

- Kept: Every word of the title, callout, captions and footer banner, including the exclamation marks, "HEO directorate" and the period after "ecosystem".
  Why: A faithful rebuild reproduces the text as printed. Questions about the wording go to the flags.
- Kept: "CFS" with a capital C in the first two panel titles and "cFS" in the third.
  Why: The source spells them that way. Correcting it here would hide a detail the author may want to fix.
- Kept: Every printed count and percentage, including the labels that do not add up.
  Why: The faithful rebuild records what the slide says. The arithmetic is flagged, not corrected.
- Kept: Text at the source's sizes, including the 8 pt page number and the 7 pt and 8 pt pie labels.
  Why: A faithful rebuild matches the source. The 10 pt floor in this repo applies to the revised slides.
- Kept: The 16:9 page at 10 x 5.625 in, with positions, sizes and fonts from the PDF objects.
  Why: That is what lets the rebuild sit exactly on top of the source in the overlay.
- Kept: Leader lines on the segment pie's labels, switched on as in the source, which draws them for Platform and Spacesuit.
  Why: PowerPoint draws a leader line when a label sits away from its slice. LibreOffice does not draw them, so they are missing from faithful.png.

## Considered and rejected

- Rejected: Placing the source pie pictures on the slide and typing labels over them.
  Why: It would pass a visual check and leave the numbers locked in pictures, which is the problem a rebuild exists to solve.
- Rejected: Flat 2D pies.
  Why: A faithful rebuild keeps the source's form. Flat pies are round and smaller than the source's wide tilted pies, and would leave most labels off their slices.
- Rejected: Pie labels as text boxes on the slide.
  Why: They would look the same but would not change with Edit Data, so a changed value would sit under a stale label.
- Rejected: Correcting the segment percentages so they total 100%.
  Why: The source prints no counts for that pie, so there is no way to know the right values. Any fix would invent data.

## Flagged for the author

- Flagged: The segment pie's labels total 103%.
  Evidence: 4 + 5 + 4 + 7 + 28 + 2 + 2 + 28 + 2 + 2 + 4 + 2 + 7 + 2 + 2 + 2 = 103, from the 16 labels on page 5 read at 200 dpi. Details are in the revised slide's log.
- Flagged: Six centers on this slide, seven in a 2023 NASA deck.
  Evidence: "cFS is used at 6 NASA Centers!" here. NTRS 20230002444, slide 13: "In use at seven NASA centers:", adding Kennedy Space Center.
- Flagged: The callout names the HEO directorate while the directorates pie uses ESDMD and SOMD.
  Evidence: Callout: "approved by HEO directorate". Pie labels: "ESDMD, 9, 23%" and "SOMD, 2, 5%". No HEO slice.

## Checks

- Checked: Overlay of the rebuild render on the source at 96 dpi (tools/overlay.sh).
  Result: RMSE 0.1848 (ImageMagick, 0 to 1, lower is closer), down from 0.2452 with flat 2D pies and 10 pt labels. Most of the remaining difference is the source pies' deeper sides and shading, the label typeface, and the Liberation Sans glyphs LibreOffice draws for Arial.
- Checked: Label boxes against the source at 200 dpi (tools/darkboxes.py).
  Result: The detector finds 25 of the source's 27 label boxes (Telescope and Robot sit on a dark slice and merge with it). 21 pair with a rebuild box whose center is within 0.4 pt. The other four (Platform, Launch Vehicle, Lander and Capsule) touch a neighbor in the render and are paired wrongly, and a 200 dpi crop shows them at their source positions.
- Checked: Label text centers read back from faithful.pdf (tools/pielabels.py --compare).
  Result: All 27 found, each 0.0 pt from its target. This confirms the moves were applied. The targets themselves come from the box measurement above.
- Checked: Word positions against the source PDF's text layer (tools/textpos.py).
  Result: 78 words matched. Median offset -0.13 pt across and 0.00 pt down. Largest offsets 1.87 pt across and 1.02 pt down.
- Checked: Slice colors against the source at 200 dpi.
  Result: The flat top faces of 11 source slices are within 6 levels per channel of the Office theme colors used. The source's shaded sides and rims are darker.
- Checked: Chart values read back from faithful.pptx against data.csv (tools/checks.py).
  Result: Pass: 6 center counts, 5 directorate counts and 16 segment percentages match the transcription.
- Checked: Deck inspector (tools/inspect.py).
  Result: Pass: native charts with workbooks, no pictures, nothing off the slide, Arial only, nothing under the 7 pt floor for faithful decks.
- Checked: Render font.
  Result: LibreOffice draws Arial with the metric-compatible Liberation Sans, so line breaks hold and glyph shapes differ slightly. That adds a little to the RMSE.
- Checked: Not checked: the deck in PowerPoint.
  Result: The renders come from LibreOffice. PowerPoint draws 3D pies with its own projection, so there a label can land a few points from its LibreOffice position.
