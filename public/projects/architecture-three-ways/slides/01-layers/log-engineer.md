# Log: engineer slide

Title: The OSAL and PSP hide the real-time OS and the board, so the cFE and the apps above it stay platform independent

Source: Core Flight System (cFS) a Low Cost Solution for SmallSats, David McComas, Susanne Strege and Jonathan Wilmot, NASA Goddard Space Flight Center, August 2015. NTRS 20150018075 (GSFC-E-DAA-TN25822). Page 8, cFS Key Features (source.png in this folder, logos masked).

Page cites: the 2015 deck by slide page, the 2023 overview by slide number, the 2021 training memo (NASA/TM-20205000691/REV 1) by the printed page number on the slide, and the cFE guide by section.

## Changed

- Changed: The topic title “cFS Key Features” became the action title “The OSAL and PSP hide the real-time OS and the board, so the cFE and the apps above it stay platform independent”. Why: It states what the diagram shows an engineer. The OSAL gives one API “regardless of the underlying real-time operating system” (2021 memo, printed p23), the PSP gives one API “to underlying avionics hardware and board support package” (printed p24), and the 2015 slide’s own bullet is “Platform Independent” (p8).
- Changed: The pasted raster diagram became native, named PowerPoint shapes, one per box and bar. Why: The source diagram is one image with no text layer. As shapes, every box can be edited, recolored, searched and read by a screen reader.
- Changed: The two red ellipses that covered “Mission App 1”, “Mission App 2”, “Mission App N” and “Mission Library” are gone. Every mission-developed part now has an orange fill and outline. Why: The ellipses ran over text and marked only four of the seven parts the legend calls mission developed. The fill marks all seven alike: three mission apps, the mission library, the platform support packages, the board support package and the PROM boot software.
- Changed: The status colors were recoded: blue tint for open source and NASA maintained, orange for mission developed, a dashed outline for in development, gray for third party. The legend is titled “Status as of August 2015”. Why: The source’s green and red are hard to tell apart for readers with red-green color blindness, and red reads as an error. The title dates the statuses to the 2015 deck.
- Changed: The three API bars (“cFE API”, “OS Abstraction API”, “cFE PSP API”) are dark bars with white labels, numbered to the role list, and the legend names them “Layer API”. Why: In the source they look like any other box. NASA’s rule “Each layer and service has a standard API” (2023 overview, slide 8) is what makes them the point of the diagram.
- Changed: The cFE Core box now shows its five services, ES, SB, EVS, TIME and TBL, as small chips. Why: An engineer needs to see where the software bus lives. The acronyms and their order come from the 2021 memo (printed p45). The 2015 deck lists the same five services, spelled out and in another order, on p9.
- Changed: Four numbered component roles were added beside the diagram: cFE Core services, software bus, OSAL and PSP, each quoted or closely paraphrased from the 2021 memo, with its printed page and “paraphrase” where it applies on the heading line. Why: The diagram names components but never says what they do. Putting the cite on the heading line leaves clear space between the four blocks.
- Changed: All seven numbered badges, on the diagram and in the role column, are near-black. Why: One kind of mark gets one color, and a dark badge stays visible on the blue API bars.
- Changed: Layer names moved from the right edge to a left column and were shortened, for example “Mission and CFS Application Layer” to “Application layer”. Why: Read left to right, each layer’s name now comes before its contents. The colors already say which parts are mission developed, so “Mission and CFS” was dropped.
- Changed: App circles became rounded rectangles, PROM Boot FSW moved beside the real-time OS and board support package inside the same layer, and the three bullets above the diagram were removed. Why: Rounded rectangles hold 11 pt labels without breaking words, and one row keeps the boot layer short. The bullets moved to the executive slide, where each one is cited.
- Changed: The 4:3 page with NASA’s template became a 16:9 white slide in Arial: 28 pt title, 14 pt role text, 10 to 12 pt diagram and legend labels, 10 pt sources. Why: That is the design standard for revised slides in this portfolio, and it leaves room for the role column. No NASA marks appear.

## Kept as is

- Kept: Every box and bar of the 2015 diagram, layer by layer, with its label word for word, including “cFS App n(13)”, “µcFE Core” and “Time & Space Partitioning (TSP) cFE Core”. Why: The engineer slide cleans up NASA’s diagram and adds no new components. The labels were transcribed from the 200 dpi render because the diagram has no text layer.
- Kept: The 2015 statuses, including in development for Software Bus Network, µcFE Core and the TSP cFE Core. Why: They are the source’s facts. They are dated, not updated, because no source here gives a newer status for each part.
- Kept: The stacks behind “cFE Apps (x5)” and “cFE Platform Support Packages”. Why: In the source both stand for many instances, and the stack keeps that meaning.
- Kept: The order of the five services: ES, SB, EVS, TIME, TBL. Why: That is the order of the 2021 memo’s list on printed p45.
- Kept: Diagram labels at 11 pt, under the 14 pt body size. Why: They are labels, not body text. At 11 pt all 23 source boxes fit in their source positions with their full NASA wording. Only the role column is body text, at 14 pt.

## Considered and rejected

- Rejected: Updating statuses to today, for example marking the TSP or µcFE cores as released. Why: None of this project’s sources gives a current status for those parts, so the slide dates the 2015 statuses instead of guessing.
- Rejected: Coloring OS Abstraction VxWorks and OS Abstraction TSP blue like Linux and RTEMS. Why: The source fills them near-white, which matches no legend entry. The slide shows them as “No status color in source” and does not assign a status.
- Rejected: Changing “cFS App n(13)” to 12, the count in the 2021 memo’s “GSFC has released 12 applications” (printed p28). Why: The 13 is the 2015 deck’s own count. It is kept and flagged.
- Rejected: Keeping the red ellipses and moving them off the text. Why: Moved ellipses would still mark only four of the seven mission-developed parts. A fill marks all of them without covering anything.
- Rejected: Folding in the 2023 overview’s isometric layer drawing, with its messaging middleware, device abstraction and device driver layers (slide 8). Why: It slices the stack differently from the 2015 diagram. Mixing the two would create layers that neither source draws.

## Flagged for the source’s authors

- Flagged: The 2015 deck’s count of cFS apps does not match its own app table. Evidence: The diagram says “cFS App n(13)” (p8) and the facts slide says “Components available 13” (p22), but the apps table on p10 lists 15 apps, or 12 without its three Lab apps (Command Ingest Lab, Scheduler Lab, Telemetry Output Lab). The 2021 memo says “GSFC has released 12 applications” (printed p28).
- Flagged: Two OS abstraction boxes have no status. Evidence: OS Abstraction VxWorks and OS Abstraction TSP have a textured near-white fill that averages #EBEBE9 (sampled with ImageMagick from text-free strips of the 96 dpi render), which matches none of the four legend swatches on p8: gray #BFBFBF, green #92D050, blue #00B0F0 and red #FF4040.
- Flagged: Software Bus Network’s transport changed between the sources. Evidence: 2015: “Passes Software Bus messages over Ethernet” (p10). 2021: “Passes Software Bus messages over various ‘plug-in’ network protocols” (printed p34). The slide keeps the 2015 status, dated.

## Checks

- Check: Diagram labels and status styles against the 2015 source (src/check_labels.py). Result: 23 of 23 source boxes and bars are on the slide with their labels word for word and the right status style. All 32 labels (23 boxes and bars, 4 legend entries, 5 layer names) were read at 200 dpi from the masked render.
- Check: Role texts against their cited pages (src/check_quotes.py). Result: The software bus role is the memo’s words, “Provides an application publish/subscribe messaging service” (printed p45). The OSAL and PSP roles are close paraphrases of printed p23 and p24, and the cFE role combines printed p25 and p45. All 105 quotes in the ledger match their cited pages word for word.
- Check: Deck inspector (src/inspect_pptx.py) on engineer.pptx and its LibreOffice PDF. Result: Passed. Arial only, smallest text 10 pt, title 28 pt. Every shape sits inside the 0.5 in margins, no two text boxes overlap, and all 271 words in the LibreOffice render sit inside their own text boxes.
- Check: Render looked at by eye at 96 dpi (engineer.png, 1280 x 720 px). Result: No ellipse or badge covers a label. The numbered badges sit on the cFE Core box, above the SB chip and at the left end of the two abstraction API bars. The renderer substitutes Liberation Sans for Arial. It has Arial’s metrics, so line breaks match a PowerPoint render.
- Check: Single-slide file against the combined deck. Result: engineer.pdf rendered on its own and its page in the combined deck differ by RMSE 0.0000 (0 means identical).
- Check: Overlay against the source. Result: Not published for this item. The slide changes layout on purpose (left layer names, a role column, a 16:9 page), so a 50 percent overlay would show the edits, not the fit. The faithful rebuild of the same page, with its overlay, is in the slide-rebuild-log project.

