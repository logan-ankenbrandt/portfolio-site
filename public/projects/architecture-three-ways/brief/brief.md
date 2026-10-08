# cFS hides the OS and the hardware behind layered APIs, and its apps talk over a software bus

_Architecture brief on NASA’s core Flight System (cFS), documented from NASA’s public materials, 2015 to 2023._

![The six-step path of one housekeeping packet across the cFS software bus](msgpath.png)

## Context

NASA’s Goddard Space Flight Center created cFS [2, p2], and its Flight Software Systems Branch maintains it as open source under Apache 2.0 [4]. NASA defines it as “a platform and project independent reusable software framework and set of reusable software applications” [1, p7]. Current code and docs: github.com/nasa/cFS, release v7.0.1 as of Oct. 6, 2026 [4].

## What each layer hides from the one above

| Layer | What NASA says it provides | What the layer above does not see |
|---|---|---|
| **cFE services: ES, SB, EVS, TIME, TBL** | “services that are common to most flight applications” [1, p25, p45] | OS task services, behind ES [1, p61], and who receives a message [1, p85] |
| **OSAL** | One API to the cFE “regardless of the underlying real-time operating system” [1, p23] | Which real-time OS runs underneath |
| **PSP** | One API “to underlying avionics hardware and board support package” [1, p24] | The board and its support package |
| **RTOS and boot** | The “software interface between the processor and the FSW” [1, p22] | The processor |

NASA’s rule for every layer: “Each layer ‘hides’ its implementation and technology details.” [3, slide 8]

## One housekeeping packet, six steps across the software bus

1. **Subscribe.** At startup, TO creates a pipe and subscribes it to the packet’s ID [1, p85, p93].
2. **Request.** The Scheduler app sends a housekeeping request over the bus [1, p86, p34].
3. **Build.** The app fills its packet and stamps the time in the header [1, p88, p98].
4. **Send.** The app sends it on the bus without knowing who subscribes [1, p85, p97].
5. **Route.** The bus delivers it to every pipe subscribed to its ID [1, p85].
6. **Downlink.** TO reads its pipe and sends the packet over UDP/IP [1, p95, p34].

2021 names: CFE_SB_SendMsg, CFE_SB_RcvMsg [1, p97]. Current guide: CFE_SB_TransmitMsg, CFE_SB_ReceiveBuffer [5, 6.6, 6.7].

## Tradeoffs NASA states

- **Copies slow large messages.** Each send copies the message into a bus buffer, which NASA calls a “drawback” [5, 6.8].
- **A full pipe rejects new messages,** so one slow app cannot hold up routing to the others [5, 6.1.2.1].
- **A reset clears the bus.** “Any packet in transit at the time of the reset is discarded” [1, p90].
- **The abstraction has edges.** Time design “is tightly coupled with the mission avionics design” [1, p129], and on GPM the “Addition of PSP changed build infrastructure midstream” [2, p14].
- **The open bundle is a starting point.** It “has not been fully verified as an operational system” [4].

## Sources

[1] NASA/TM-20205000691/REV 1, "Core Flight System (cFS) Training," NASA Goddard, Jan. 2021, NTRS 20205011588 (printed pages).  
[2] McComas et al., "Core Flight System (cFS) a Low Cost Solution for SmallSats," NASA Goddard, Aug. 2015, NTRS 20150018075.  
[3] Baker, "core Flight System (cFS) Overview," NASA Goddard, 2023, NTRS 20230002444. [4] nasa/cFS README, read Oct. 6, 2026.  
[5] "cFE Application Developers Guide," nasa/cFE docs on GitHub, read Oct. 6, 2026 (section numbers).  

_Portfolio brief drawn from public NASA documents. Not a NASA document. The diagram above is msgpath.png, rendered from msgpath.pptx. The PDF is brief.pdf._
