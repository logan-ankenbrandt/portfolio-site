# cFS Key Features (faithful rebuild)

Log for the faithful rebuild in `02-cfs-key-features`.

The 2015 layered architecture slide at 4:3, with its pasted diagram picture rebuilt as native shapes, dashed layer rules, legend and labels, and the two red highlight ellipses left where the author put them, over the text.

Source: David McComas, Susanne Strege and Jonathan Wilmot, NASA Goddard Space Flight Center, August 2015. NASA Technical Reports Server 20150018075. Slide 8 of 24, "cFS Key Features" (NASA insignia, GSFC banner and cFS logo masked in this copy). https://ntrs.nasa.gov/citations/20150018075. License: Work of the US Gov. Public Use Permitted.

Files: `faithful.pptx`, `faithful.pdf`, `faithful.png`, `overlay.png`.

How this was made: Claude Code agents rebuilt these slides from the source images as editable PowerPoint and drafted the logs. I chose the sources, set the rules each rebuild follows, and checked every slide, number and log before publishing.

## Changed

- Changed: The pasted diagram picture is native shapes: 23 parts, the four dashed layer rules, the legend, five layer labels and the two red ellipses.
  Why: In the source the whole diagram is one picture, so none of its text can be edited or searched. Each shape was measured from the 200 dpi render.
- Changed: The level 1 bullet is an Arial bullet in the source's color #6FB7D7, where the source uses a Wingdings 2 glyph.
  Why: The decks use Arial only, so the slide looks the same on a machine without Wingdings 2.
- Changed: The template's background picture is a native gradient sampled down the slide's edge, five nested translucent white ellipses with soft edges for the lighter middle of the teal band, and two soft translucent swooshes.
  Why: The deck carries no pictures. A radial gradient would be simpler, but LibreOffice draws it as a circle, and the band's light area is a wide ellipse. The swooshes are filled bands with soft edges, so they read as light and not as drawn lines.
- Changed: The NASA insignia, the GSFC banner and the cFS logo are left out, and the portfolio footer sits in the strip where the banner was.
  Why: The NTRS public use line does not cover the agency's marks, and every rebuilt slide says it is a reconstruction.
- Changed: The source's shadows and the stacked look of the cFE Apps circles and the PSP box are native shadows and offset copies. The marble texture of the VxWorks and TSP boxes is a near-flat light gradient with no texture.
  Why: They are drawn into the source picture. Native versions keep the look without an image. The marble is a picture texture, and a native pattern fill did not look like it (see Rejected).

## Kept

- Kept: The two red ellipses where the source puts them, crossing the last bullet and two dashed rules.
  Why: They are part of the slide as presented. The faithful rebuild keeps the overlap and the revised slide fixes it.
- Kept: "Layered  architecture" with two spaces, "Mission and CFS" with a capital C, "n(13)", "(x5)", "µcFE" and "3rd Party" with a superscript.
  Why: Text is reproduced as printed.
- Kept: The 4:3 page at 10 x 7.5 in, the title in Arial 28 pt #2C7C9F, the bullets in 18 and 16 pt #595959, and "August 2015" and the page number in white.
  Why: These values come from the PDF text objects.
- Kept: Diagram outlines at 0.81 pt and the diagram's 14 pt labels at 11.4 pt.
  Why: The diagram was pasted at about 0.81 scale, so its native shapes use the scaled sizes the render shows.
- Kept: The legend's four status colors, #BFBFBF, #92D050, #00B0F0 and #FF4040.
  Why: They match the sampled source swatches.
- Kept: Text at the source's sizes: circle labels at 8.5 pt (9 pt for the Mission apps) on the source's line pitch, and legend labels at 8 pt in the source's legend box.
  Why: A faithful rebuild matches the source. The 10 pt floor in this repo applies to the revised slides.
- Kept: The legend swatches where the source puts them, a little above the middle of their labels.
  Why: Measured from the 200 dpi render. The offset is in the source.

## Considered and rejected

- Rejected: Placing the source diagram picture behind native text.
  Why: It would score better on the overlay and leave every part and label uneditable.
- Rejected: Moving the ellipses off the text.
  Why: That is a design change, so it belongs in the revised slide.
- Rejected: Reusing the template's background image.
  Why: It is a NASA template picture. The native background keeps the deck free of images.
- Rejected: A preset dot pattern fill for the marble boxes.
  Why: LibreOffice draws the 10 percent dot pattern as diagonal hatching, which looks less like the source's speckled texture than a plain light fill.

## Flagged for the author

- Flagged: Three parts have a color that is not in the legend.
  Evidence: The cFE Apps (x5) circles are pale blue (about #AFDBEA), and the OS Abstraction VxWorks and OS Abstraction TSP boxes are near white (about #E5E6E1 to #F9F9F7). The legend lists only gray, green, bright blue (#00B0F0) and red, so the slide does not say what their status is.
- Flagged: The highlight ellipses cross text.
  Evidence: The apps ellipse, (456,228) to (720,336) px at 96 dpi, crosses the end of "Supports advances in technology without changes to the framework" and the first dashed rule. The library ellipse, (216,320) to (344,420) px, crosses the second dashed rule.
- Flagged: "Mission and CFS" in two layer labels, "cFS" everywhere else.
  Evidence: The two top layer labels print "Mission and CFS". The title, the bullets and the parts use "cFS".

## Checks

- Checked: Overlay of the rebuild render on the masked source at 96 dpi (tools/overlay.sh).
  Result: RMSE 0.1328 (ImageMagick, 0 to 1, lower is closer), down from 0.1412 with the circle and legend labels at 10 pt. Edges of boxes, circles, rules and the ellipses line up in the overlay image. The remaining difference is mostly the raster blur of the source diagram, the marble texture and the Liberation Sans glyphs LibreOffice draws for Arial.
- Checked: Title, bullet and footer positions against the source PDF's text layer (tools/textpos.py).
  Result: 24 words matched. Median offset -0.04 pt across and 0.03 pt down. Largest offsets 1.08 pt across and 0.36 pt down.
- Checked: Diagram text against the source picture, by ink line in 32 windows: every part, API bar, circle, layer label and legend label (tools/inklines.py with ink-windows.json, where a circle window reads only inside the circle's outline).
  Result: Every line is within 1.5 pt of the source in position. Widths differ by at most 3.0 pt (the legend's "Open source/NASA Maintained" is narrower in the rebuild). Checked by eye at 200 dpi: every circle label sits inside its circle.
- Checked: Deck inspector (tools/inspect.py).
  Result: Pass: no pictures, nothing off the slide, Arial only, nothing under the 7 pt floor for faithful decks.
- Checked: Published source image.
  Result: source.png is the masked copy, with the insignia, banner and logo removed and every other pixel identical to the plain render (per the source folder's difference check).
