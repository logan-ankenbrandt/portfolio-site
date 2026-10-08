# Log: architecture brief

Title: cFS hides the OS and the hardware behind layered APIs, and its apps talk over a software bus

Source: no single source page. The brief draws on the sources in CREDITS.md, cited inline by number.

Page cites: the 2015 deck by slide page, the 2023 overview by slide number, the 2021 training memo (NASA/TM-20205000691/REV 1) by the printed page number on the slide, and the cFE guide by section.

## Changed

- Changed: About 15 slides of NASA’s software bus training (2021 memo, printed pp. 85 to 99) were condensed into one six-step path for one housekeeping packet. Why: One worked path shows publish/subscribe, pipes and routing in the order they happen, and each step cites the slide it comes from.
- Changed: The path is drawn as a bus diagram (msgpath.pptx) with the apps above a single bus bar. Why: It matches how NASA draws the bus, as an “Inter-app Message Router (Software Bus)” with apps around it (2021 memo, printed p29), and it shows one packet reaching every subscriber at a glance. The slide adds a dashed box for other subscribers, such as Data Storage. The brief’s smaller copy leaves that box out to stay on one page, and its step 5 names only the subscribed pipes.
- Changed: Step 1’s gray badge became blue like the other five, and badge 3 moved onto the sending app’s top-right corner. Why: Nothing on the page explained the gray, and the dashed arrow already marks subscribing as a startup step. In the gap between two apps, badge 3 could be read as belonging to Telemetry Output.
- Changed: Layer definitions are quoted, not paraphrased. Why: cFS and cFE are easy to mix up, so NASA’s own words carry each definition (2021 memo, printed pp. 7, 10 and 22 to 25).
- Changed: The function names carry a dated note: the memo’s CFE_SB_SendMsg and CFE_SB_RcvMsg (printed p97) next to the current guide’s CFE_SB_TransmitMsg and CFE_SB_ReceiveBuffer (sections 6.6 and 6.7). On the slide the note is part of the source line, and in the brief it is a line under the steps. Why: The memo is from January 2021, and the current cFE guide no longer uses the old names. A separate note box on the slide made a second message between the diagram and the steps, so it moved into the source line and the diagram took the space.
- Changed: The message-path slide’s footer reads “Portfolio diagram drawn from public NASA documents. Not a NASA document.” Why: The slide is a new diagram drawn from the memo’s text, not a rebuilt NASA slide, so the footer the two layer slides carry would misstate where it came from.
- Changed: The page is 10 x 12.94 in, letter proportions. Why: Its 96 dpi render is then 960 px wide like the other images on the portfolio site, and the PDF prints on letter paper at 85 percent.

## Kept as is

- Kept: The README’s caveat that the open bundle “has not been fully verified as an operational system”. Why: It limits what the six steps show: a lab setup, not a flight configuration.
- Kept: NASA’s own word “drawback” for the copy each send makes, and the guide’s condition on it (cFE guide, section 6.8). Why: The tradeoff is stated in NASA’s terms. Section 6.8 is about large messages and offers zero copy for when the copy takes too long, so the line reads “Copies slow large messages.” and does not present the copy as a cost on every send.
- Kept: The GPM lesson from 2015, “Addition of PSP changed build infrastructure midstream” (p14). Why: It is the one cost of the abstraction layers that NASA reports from a flight project in these sources.

## Considered and rejected

- Rejected: A comparison with general-purpose message brokers. Why: None of the sources makes one, so it would be the brief’s claim, not NASA’s.
- Rejected: The command path, tables and events as further walk-throughs. Why: One path keeps the brief to one page. glossary.md defines EVS and TBL, and the altitude log records what was left out.
- Rejected: A step for runtime rerouting, from the memo’s “Message routing can be added/removed at runtime” (printed p85). Why: Rerouting is not part of a housekeeping packet’s normal path. The quote stays in citations.csv.
- Rejected: A Mermaid sequence diagram. Why: A native PowerPoint diagram can be edited and reused in a deck. The numbered steps in brief.md serve as its text version.
- Rejected: Raising the brief’s 10 pt reference list to 11 pt. Why: The page has 0.05 in to spare below the footer, and 10 pt meets the floor at the page’s own size. Printed on letter paper at 85 percent it reads at about 8.5 pt, so the PDF and PNG on screen are the reading copies.

## Flagged for the source’s authors

- Flagged: API is expanded two ways in the same memo. Evidence: “Application Program Interface” in the OSAL and PSP definitions (printed p23 and p24) and “API Application Programmer Interface” in the acronym list (printed p209). The 2015 deck also says “API Application Programmer Interface” (p19).
- Flagged: Telemetry Output in the open bundle is a lab app. Evidence: The 2021 memo lists “Telemetry Output Lab” (printed p34), and the nasa/cFS README says “the "lab" apps are intended as examples only”. The current cFE guide says the ingest and telemetry apps are “adapted as needed to fit the mission” (section 6).

## Checks

- Check: Quotes in the brief, msgpath.pptx and brief.md against their cited pages (src/check_quotes.py --outputs). Result: All 105 quotes in the ledger match their cited pages word for word. All 181 quoted fragments in the published slides and Markdown trace to the ledger, a transcribed diagram label, a source title or the slides’ own text.
- Check: Deck inspector on brief.pptx and its LibreOffice PDF. Result: Passed. Arial only, smallest text 10 pt, title 22 pt. Every shape sits inside the 0.5 in margins, no two text boxes overlap, and all 565 words in the LibreOffice render sit inside their own text boxes.
- Check: Deck inspector on msgpath.pptx and its LibreOffice PDF. Result: Passed. Arial only, smallest text 10 pt, title 28 pt. Every shape sits inside the 0.5 in margins, no two text boxes overlap, and all 230 words in the LibreOffice render sit inside their own text boxes.
- Check: One page. Result: brief.pdf has 1 page, 720 x 931.748 pt (10 x 12.94 in).
- Check: Length. Result: 360 words of body text, plus 70 words in the source list. The diagram labels are not counted.
- Check: Render looked at by eye at 96 dpi (brief.png, 960 px wide). Result: Every block fits its box, the table rows hold their text, and the diagram badges sit beside their arrows without covering labels. The renderer substitutes Liberation Sans for Arial. It has Arial’s metrics, so line breaks match a PowerPoint render.

