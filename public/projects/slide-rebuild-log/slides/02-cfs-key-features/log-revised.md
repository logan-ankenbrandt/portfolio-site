# In the 2015 cFS design, a mission builds its own apps, libraries and platform support and reuses the NASA-maintained framework

Log for the revised slide in `02-cfs-key-features`.

The 2015 layer diagram redrawn at 16:9 under an action title dated to 2015, with the layer names first, the API bars labeled, and one orange highlight on every mission developed part in place of the two red ellipses. Every status is dated as of August 2015.

Source: David McComas, Susanne Strege and Jonathan Wilmot, NASA Goddard Space Flight Center, August 2015. NASA Technical Reports Server 20150018075. Slide 8 of 24, "cFS Key Features" (NASA insignia, GSFC banner and cFS logo masked in this copy). https://ntrs.nasa.gov/citations/20150018075. License: Work of the US Gov. Public Use Permitted.

Files: `revised.pptx`, `revised.pdf`, `revised.png`.

How this was made: Claude Code agents rebuilt these slides from the source images as editable PowerPoint and drafted the logs. I approved the sources and the rules each rebuild follows, and checked every slide, number and log before publishing.

## Changed

- Changed: The topic title "cFS Key Features" is now "In the 2015 cFS design, a mission builds its own apps, libraries and platform support and reuses the NASA-maintained framework".
  Why: The legend is the evidence. The parts it marks Mission Developed are the apps, the library, the platform support packages, the board support package and the boot software, and the parts it marks Open source/NASA Maintained are the framework. The title says that in the legend's terms. "In the 2015 cFS design" keeps the date in the claim, because the statuses are a 2015 snapshot.
- Changed: The two red ellipses are gone. Every part the legend marks Mission Developed is orange instead.
  Why: The ellipses crossed the last bullet and two layer rules, and they circled only two of the five kinds of mission developed parts. One fill marks all of them and covers no text.
- Changed: Status colors are recoded: open source and NASA maintained in blue #2F5D8A, in development in light blue #A9BED3, mission developed in orange #D9822B, third party in white with a solid dark gray outline.
  Why: The source's red and green are the pair readers with the most common color vision deficiency confuse. Blue and orange stay distinct for them. Third party is an outline so it cannot be mistaken for the pale blue of in development.
- Changed: The legend heading reads "Status as of August 2015".
  Why: The statuses are a 2015 snapshot. Parts shown as in development may have changed since, and the slide should not read as current.
- Changed: The cFE API, OS Abstraction API and cFE PSP API are drawn as thin bars with bold labels, and the legend has a row for them: "Thin bar: an API between layers".
  Why: In the source they look like any other box. Naming the shape tells the reader these are the interfaces between layers, which their names already say.
- Changed: The layer names move from the right edge to a left column, and thin solid rules replace the dashed ones.
  Why: Reading left to right, the reader meets each layer before its parts.
- Changed: Circles become rectangles, the stacked cFE Apps circles become one box labeled "(x5)", and the shadows, marble fills and background art are gone.
  Why: Shape carries no meaning in the legend, and the effects add ink without information.
- Changed: The two cFS app boxes share one width, and so do the three mission app boxes.
  Why: Parts of the same kind look the same size. Other widths follow their label text.
- Changed: Part labels are 12 pt, under the 14 pt body size.
  Why: All 23 parts must fit the diagram grid with every label on one or two lines. Nothing on the slide is under 10 pt.
- Changed: The three parts whose source color is in no legend entry (cFE apps, OS Abstraction VxWorks and OS Abstraction TSP) are white with a dashed outline, and the legend says "Color not in the source legend".
  Why: Giving them a status would put a claim on the slide that the source does not make.
- Changed: Small wording edits: "Mission and CFS" to "Mission and cFS", "Time & Space Partitioning" to "Time and Space Partitioning", "3rd Party" to "Third party", "Open source/NASA Maintained" to "Open source, NASA maintained", "RTOS / BOOT Layer" to "RTOS and boot layer", "cFE Apps" to "cFE apps".
  Why: One spelling of cFS and plain words in labels. The meanings are unchanged.
- Changed: The source's bullets move to the right column under "Key features (source wording)".
  Why: The title now carries the message, and the bullets stay as the author's list.
- Changed: The page is 16:9 at 13.333 x 7.5 in, with a subtitle, a source line and the portfolio footer.
  Why: Same size as the other revised slide, with room for the legend and the bullets beside the diagram.

## Kept

- Kept: All 23 diagram parts in their layers and left to right order, with their printed names, including "n(13)", "(x5)" and "µcFE".
  Why: The parts and their places are the architecture the slide shows.
- Kept: Which part has which status.
  Why: The status of each part is the slide's data. Only the colors changed.
- Kept: The bullets word for word, including "Platform Independent".
  Why: They are the author's claims, quoted.
- Kept: PSP, TSP, RTOS, PROM and FSW as printed, without expansions.
  Why: The slide defines none of them, and definitions added from memory would be unsourced text on the slide.

## Considered and rejected

- Rejected: Moving the ellipses so they cross no text.
  Why: They would still mark only two of the five kinds of mission developed parts, and an ellipse around a row of parts crowds its neighbors.
- Rejected: Updating the statuses to today.
  Why: No source in this repo says what changed after August 2015, so new statuses would be invented. The date makes the age plain instead.
- Rejected: Giving cFE apps, VxWorks and TSP the nearest legend status.
  Why: It would be a guess presented as data.
- Rejected: Adding the line that each layer and service has a standard API.
  Why: It comes from a different deck (NTRS 20230002444, slide 8). On this slide it would credit the 2015 authors with a claim they did not make here.
- Rejected: Keeping the source's red and green status colors.
  Why: Red and green are the pair that readers with the most common color vision deficiency confuse, and the legend depends on telling them apart.

## Flagged for the author

- Flagged: Three parts have a color that is not in the legend.
  Evidence: cFE Apps (x5) is pale blue (about #AFDBEA), OS Abstraction VxWorks and OS Abstraction TSP are near white. The legend has only gray, green, bright blue and red.
- Flagged: The ellipses mark only two of the five kinds of mission developed parts.
  Evidence: The legend's gray covers the Mission App circles, Mission Library, cFE Platform Support Packages, Board Support Package and PROM Boot FSW. The ellipses circle only the first two. The revised title reads the author's point as all five.
- Flagged: "cFS App n(13)" does not say what 13 counts.
  Evidence: The label suggests n = 13 cFS apps, but the slide does not say so. It is kept as printed.

## Checks

- Checked: Every source part present.
  Result: 23 of 23, same names and layers, read from the shape list of revised.pptx.
- Checked: Every status kept, counted by fill and outline style in revised.pptx (tools/partstyles.py).
  Result: 9 open source and NASA maintained, 3 in development, 7 mission developed, 1 third party, 3 with no legend color. Same split as the source's colors.
- Checked: Bullets against the page 8 text layer.
  Result: Same words, same order.
- Checked: Deck inspector (tools/inspect.py).
  Result: Pass: no pictures, nothing off the slide, Arial only, nothing under 10 pt.
- Checked: Type sizes.
  Result: Title 28 pt bold, subtitle, layer names, legend and bullets 14 pt, part labels 12 pt, source line 10.5 pt, footer 10 pt.
- Checked: Contrast (WCAG ratio).
  Result: White on blue #2F5D8A 6.9:1. Dark #1F2328 on orange #D9822B 5.4:1, on light blue #A9BED3 8.3:1, on white 15.8:1. The third party outline #4A525C is 7.9:1 against white.
- Checked: Nothing covers text and no label overflows its box.
  Result: Checked by eye on the 96 dpi render: no shape overlaps another shape's text, and every part label fits inside its box.
