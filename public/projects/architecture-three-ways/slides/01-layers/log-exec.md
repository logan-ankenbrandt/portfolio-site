# Log: executive slide

Title: Each layer hides its implementation behind a standard API, so a mission reuses the framework and focuses on custom parts

Source: Core Flight System (cFS) a Low Cost Solution for SmallSats, David McComas, Susanne Strege and Jonathan Wilmot, NASA Goddard Space Flight Center, August 2015. NTRS 20150018075 (GSFC-E-DAA-TN25822). Page 8, cFS Key Features (source.png in this folder, logos masked).

Page cites: the 2015 deck by slide page, the 2023 overview by slide number, the 2021 training memo (NASA/TM-20205000691/REV 1) by the printed page number on the slide, and the cFE guide by section.

## Changed

- Changed: The topic title “cFS Key Features” became the action title “Each layer hides its implementation behind a standard API, so a mission reuses the framework and focuses on custom parts”. Why: An executive should get the point from the title alone. The first half restates two of NASA’s own bullets, “Each layer and service has a standard API” and “Each layer ‘hides’ its implementation and technology details.” (2023 overview, slide 8, repeated in the 2021 training memo, printed p39). The second half follows the memo’s “Teams focus on the custom aspects of their project” (printed p41).
- Changed: The 23 boxes and bars of the 2015 diagram became three layers and a base strip: community apps beside mission apps, framework services (cFE), OS abstraction (OSAL) beside platform support (PSP), and a strip that splits the third-party real-time OS from the board support and boot code. Why: Three layers carry the structure an executive needs, and the same 2015 deck draws three on its page 2: “Application Layer”, “FSW Service Layer” and “Platform Abstraction Layer”. Splitting the top layer, the abstraction layer and the strip keeps visible which parts a mission reuses and which it builds.
- Changed: The two boundaries between layers are drawn as dark bars labeled “standard API”. Why: The bars are the mechanism the title names: “Each layer and service has a standard API” (2023 overview, slide 8).
- Changed: The three key features on the 2015 slide became three benefit cards, each pairing NASA’s feature with one NASA sentence that explains it, with both cited. Why: A feature name such as “Reusable components” tells an executive little on its own. The paired sentence says what the mission gains, for example “Reuse of tested, certified components supplies savings in each phase of the software development cycle.” (2021 memo, printed p41).
- Changed: Four status colors became two plus a neutral gray, with a three-entry legend: blue for reused, NASA-maintained parts, orange for parts the mission builds, gray for the third-party real-time OS. Why: The executive point is the split between what a mission reuses and what it builds. The colors follow the 2015 legend (p8), which marks the platform support packages, the board support package and the PROM boot software as mission developed, and the deck notes “There are many other PSPs at each center that are not open source” (p23). The in-development status describes single components as of August 2015 and stays on the engineer slide, dated.
- Changed: The third key feature, “Supports advances in technology without changes to the framework”, became the card label “New technology without framework changes”. Why: A card label has to fit one line at 16 pt. The card pairs it with the 2023 overview’s sentence on changing a layer, and its cite points to the feature on p8.
- Changed: The 4:3 page with NASA’s template became a 16:9 white slide in Arial: 30 pt title, 14 to 16 pt layer and card text, 12 to 13 pt kicker, legend and bar labels, 10 pt sources, 0.5 in margins. Why: That is the design standard for revised slides in this portfolio. The NASA insignia, the Goddard banner and the cFS logo stay out of every output.

## Kept as is

- Kept: NASA’s terms: framework, cFE, OSAL, PSP, standard API and “hides”. Why: Domain terms stay as NASA defines them, so every word on the slide can be checked against glossary.md. Only the cell captions are plain English.
- Kept: Two of the three key features of the 2015 slide, word for word, as card labels: “Reusable components” and “Platform independent”. Why: They are the benefits NASA chose to state on the slide being reworked (2015 deck, p8). The third is shortened, as recorded above.
- Kept: The double hyphen inside the quote “Internals of a layer can be changed -- without affecting other layers’ internals and components.” Why: Quotes stay word for word, punctuation included (2023 overview, slide 8).

## Considered and rejected

- Rejected: Saying in the title that a mission writes only its own apps. Why: NASA’s own 2015 legend marks the board support package, the boot code and the platform support packages as mission developed (p8), and GPM’s code was 38.9 percent heritage clone and own (p14). The title says a mission “focuses on custom parts”, after NASA’s “Teams focus on the custom aspects of their project” (2021 memo, printed p41), and the slide colors those parts orange.
- Rejected: Coloring the whole abstraction layer and the base strip as reused framework. Why: An earlier draft did this, and it understated the porting work a mission does. The PSP cell and the board support and boot strip are orange, as in the 2015 legend.
- Rejected: Adding the 2015 claim that the architecture “reduces Non-Recurring Engineering (NRE) up to 90%” (p11). Why: The deck gives no baseline or method for the figure, and on an executive slide it would become the headline. It stays in citations.csv and off the slide.
- Rejected: Listing the five cFE services by acronym (ES, SB, EVS, TIME, TBL) in the framework layer. Why: Acronyms cost an executive time. The layer names the services in words, and the engineer slide carries the acronyms.
- Rejected: Showing each component’s 2015 status, including in development, on this slide. Why: They are dated component facts from August 2015. This slide keeps only the legend’s split between reused, mission-built and third-party parts at the layer level, and the engineer slide keeps every status under “Status as of August 2015”.

## Flagged for the source’s authors

- Flagged: The middle layer has three names across NASA’s documents. Evidence: The 2015 deck calls it “FSW Service Layer” on p2 and “cFE Core Layer” in the p8 diagram, and the 2021 memo’s layer diagram labels it Core Flight Executive (printed p8). The slide uses “Framework services (cFE)” and cites the memo’s definition.
- Flagged: The 2015 deck writes the system name two ways. Evidence: The p8 diagram labels read “Mission and CFS Application Layer” and p11 says “The CFS architecture”, while the rest of the deck writes cFS. The 2021 memo also expands cFS as “Core Flight Software System” in its acronym list (printed p209) against “Core Flight System” in its title.

## Checks

- Check: Quotes on the slide against their cited pages (src/check_quotes.py). Result: All 105 quotes in the ledger match their cited pages word for word. All 181 quoted fragments in the published slides and Markdown trace to the ledger, a transcribed diagram label, a source title or the slides’ own text.
- Check: Deck inspector (src/inspect_pptx.py) on exec.pptx and its LibreOffice PDF. Result: Passed. Arial only, smallest text 10 pt, title 30 pt. Every shape sits inside the 0.5 in margins, no two text boxes overlap, and all 265 words in the LibreOffice render sit inside their own text boxes.
- Check: Render looked at by eye at 96 dpi (exec.png, 1280 x 720 px). Result: Title on two lines, the layer stack and the cards end level at the bottom, the legend sits above the stack, no clipped or colliding text. The renderer substitutes Liberation Sans for Arial. It has Arial’s metrics, so line breaks match a PowerPoint render.
- Check: Single-slide file against the combined deck. Result: exec.pdf rendered on its own and its page in the combined deck differ by RMSE 0.0000 (0 means identical).
- Check: Marks and footer. Result: No NASA insignia, logotype, Goddard banner or cFS logo on the slide. The footer “Portfolio reconstruction of a public NASA slide. Not a NASA document.” is present. The published source image is the masked copy from the sources folder.

