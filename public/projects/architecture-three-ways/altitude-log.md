# Altitude log

The three views in this repo describe one architecture, NASA's core Flight System (cFS), at three altitudes: an executive slide, an engineer slide, and a one-page brief with its message-path slide. Each view leaves things out on purpose. This log records what each one leaves out and why, so a reader can tell an omission from a gap.

Page cites use the same short names as the rest of the repo. The 2015 deck is NTRS 20150018075, the 2023 overview is NTRS 20230002444, and the 2021 training memo is NASA/TM-20205000691/REV 1 (NTRS 20205011588), cited by its printed page numbers. Full credits are in CREDITS.md.

## Executive slide (slides/01-layers/exec.pptx)

1. Component names below the layer level. ES, SB, EVS, TIME and TBL appear only as words in the framework layer, and OSAL and PSP only as cell names. An executive needs the split between the parts a mission reuses and the parts it builds. The parts list is on the engineer slide.
2. The 2015 statuses (in development, open source, third party). They describe single components as of August 2015. The engineer slide keeps them under "Status as of August 2015".
3. Which single parts NASA's 2015 legend marks as mission developed. The slide shows them only at the layer level: the platform support cell and the board support and boot strip are orange, as the legend marks the platform support packages, the board support package and the boot code (2015 deck, p8). The title says a mission "focuses on custom parts", after NASA's "Teams focus on the custom aspects of their project" (2021 memo, printed p41), and does not say it writes only its own apps. The engineer slide shows each part.
4. The software bus and how messages move. Messaging is a mechanism, not a decision an executive makes from this slide. The brief and the message-path slide cover it.
5. NASA's 2015 claim that the architecture "reduces Non-Recurring Engineering (NRE) up to 90%" (2015 deck, p11). The deck gives no baseline or method, so the number stays in citations.csv.
6. Costs and limits, such as message copies, full pipes and resets. They matter to the people who design against them. The brief lists them, each with a cite.
7. Version numbers. The slide's claims are about structure, which the 2015, 2021 and 2023 sources all describe the same way. The source line points to github.com/nasa/cFS for the current code.

## Engineer slide (slides/01-layers/engineer.pptx)

1. How a message moves between apps. The slide shows the static structure. The message-path slide and the brief show the runtime path.
2. Function names and configuration parameters. The slide's content is dated August 2015, and names have changed since: the 2021 memo sends with CFE_SB_SendMsg (printed p97), while the current cFE guide sends with CFE_SB_TransmitMsg (section 6.6).
3. Any status after August 2015. None of this project's sources gives a current status for each part, so the legend dates the 2015 ones.
4. The 2023 overview's isometric drawing, with its messaging middleware, device abstraction and device driver layers (slide 8). It slices the stack differently from the 2015 diagram, and mixing the two would create layers neither source draws.
5. The list behind "cFS App n(13)". The slide keeps NASA's count and flags that it does not match the 2015 deck's own app table (p10). The table itself stays in the deck.
6. Development tools and ground systems. The 2021 memo's layer diagram draws them beside the flight layers ("Development tools and ground systems are used to test and run the cFS.", printed p27), but the 2015 diagram does not, and they are not flight layers.
7. The three key-feature bullets from the source page. They moved to the executive slide, where each one is cited.

## Brief and message-path slide (brief/brief.pdf, brief/msgpath.pptx)

1. The command path. One packet's path is enough to show publish and subscribe, and NASA notes that "Commands can originate from the ground or from onboard applications" (printed p88) over the same bus.
2. Tables, events and time beyond a line each. glossary.md defines them with quotes, and the brief stays on one page.
3. Routing across processors. The path runs on one processor. NASA notes that "The Software Bus Network application can be used to extend the software bus across multiple processors" (printed p92).
4. Message formats in detail, such as CCSDS headers and the message ID variants. The path needs only "the packet's ID", and the current guide offers two message ID implementations, "MISSION_MSG_V1 and MISSION_MSG_V2" (cFE guide, section 6.1.1).
5. How zero copy works. The brief's tradeoff line names only the cost of the copy for large messages. glossary.md notes that the cFE guide offers zero copy calls for when the copy takes too long, and the guide explains them in section 6.8.
6. Numbers for pipe depth and message limits. NASA says "Pipe depth and message limits are dependent on the entire software system." (cFE guide, section 6.9), so no single number would be right.
7. Any comparison with general-purpose message brokers. None of the sources makes one, and the brief only reports what NASA states.
8. The other-subscriber box in the brief's copy of the diagram. The message-path slide draws it, and the brief leaves it out to stay on one page.
