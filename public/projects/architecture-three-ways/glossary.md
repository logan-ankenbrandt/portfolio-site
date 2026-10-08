# Glossary: NASA’s core Flight System, in NASA’s words

Every definition below is a quote, word for word, with the page it comes from. The 2021 training memo is cited by its PDF page and by the printed page number on the slide (printed = PDF minus 4). src/check_quotes.py checks every quote against its page.

Sources: the 2021 training memo is NASA/TM-20205000691/REV 1, “Core Flight System (cFS) Training” (NTRS 20205011588). The 2015 deck is McComas, Strege and Wilmot, “Core Flight System (cFS) a Low Cost Solution for SmallSats” (NTRS 20150018075). The 2023 overview is Baker, “core Flight System (cFS) Overview” (NTRS 20230002444). Full credits are in CREDITS.md, and every quote is also a row in citations.csv.

## cFS

Acronym list entry: “CFS Core Flight System” (2015 deck, p19).

> “A platform and project independent reusable software framework and set of reusable software applications”

2021 training memo, PDF p11, printed p7

> “cFS is a general collective term for the framework and the growing set of components”

2021 training memo, PDF p14, printed p10

> “The Core Flight System (cFS) is a generic flight software architecture framework used on flagship spacecraft, human spacecraft, cubesats, and Raspberry Pi.”

nasa/cFS README, opening paragraph

Note: The 2021 memo’s own acronym list expands cFS as “Core Flight Software System” (PDF p213, printed p209), while its title, the 2015 and 2023 decks and the README say core Flight System. cFS names the whole framework and its components. The cFE is one part of it.

## cFE

Acronym list entry: “cFE Core Flight Executive” (2021 training memo, PDF p213, printed p209).

> “The cFE is a portable, platform-independent framework that creates an application runtime environment by providing services that are common to most flight applications.”

2021 training memo, PDF p29, printed p25

> “cFE is the Core Flight Executive services and API”

2021 training memo, PDF p14, printed p10

> “The cFS core layer is the system glue.”

2015 deck, p9

Note: The cFE provides five services: ES, SB, EVS, TIME and TBL (2021 memo, printed p45). The 2015 deck’s diagram calls its layer the cFE Core Layer.

## OSAL

Acronym list entry: “OSAL Operating System Abstraction Layer” (2021 training memo, PDF p215, printed p211).

> “The OS Abstraction Layer (OSAL) is a software library that provides a single Application Program Interface (API) to the core Flight Executive (cFE) regardless of the underlying real-time operating system.”

2021 training memo, PDF p27, printed p23

Note: The 2015 diagram shows OSAL versions for Linux, RTEMS, VxWorks and TSP (p8, inside the image). The memo’s acronym list expands API as “Application Programmer Interface” (printed p209), while this definition says “Application Program Interface”.

## PSP

Acronym list entry: “PSP Platform Support Package” (2021 training memo, PDF p215, printed p211).

> “The Platform Support Package (PSP) is a software library that provides a single Application Program Interface (API) to underlying avionics hardware and board support package.”

2021 training memo, PDF p28, printed p24

Note: In 2015 NASA noted “There are many other PSPs at each center that are not open source” (p23), and the 2015 diagram marks the cFE Platform Support Packages as mission developed (p8, inside the image).

## Software bus (SB)

Acronym list entry: “SB Software Bus” (2021 training memo, PDF p215, printed p211).

> “Provides an application publish/subscribe messaging service”

2021 training memo, PDF p49, printed p45

> “Provides a portable inter-application message service using a publish/subscribe model”

2021 training memo, PDF p89, printed p85

> “Routes messages to all applications that have subscribed to the message (i.e. broadcast model)”

2021 training memo, PDF p89, printed p85

> “Sender does not know who subscribes (i.e. connectionless)”

2021 training memo, PDF p89, printed p85

Note: The current cFE guide, in its section on large messages, says each send copies the message into a bus buffer, which it calls a “drawback”, and offers zero copy calls for when the copy takes too long (section 6.8).

## EVS

Acronym list entry: “EVS Event Services” (2021 training memo, PDF p213, printed p209).

> “Provides a service for sending, filtering, and logging event messages”

2021 training memo, PDF p49, printed p45

> “Provides an interface for sending time-stamped text messages on the software bus”

2021 training memo, PDF p112, printed p108

## TBL

Acronym list entry: “TBL Table Services” (2021 training memo, PDF p215, printed p211).

> “Manages application table images”

2021 training memo, PDF p49, printed p45

> “Tables are logical groups of parameters that are managed as a named entity”

2021 training memo, PDF p149, printed p145

## ES

Acronym list entry: “ES Executive Services” (2021 training memo, PDF p213, printed p209).

> “Manages the software system and creates an application runtime environment”

2021 training memo, PDF p49, printed p45

> “Primary interface to underlying operating system task services”

2021 training memo, PDF p65, printed p61

## TIME

Acronym list entry: “Time Services (TIME)” (2021 training memo, PDF p49, printed p45).

> “Manages spacecraft time”

2021 training memo, PDF p49, printed p45

> “Designing and configuring time is tightly coupled with the mission avionics design”

2021 training memo, PDF p133, printed p129

## Pipe

> “These are queues that can hold SB Messages until they are read out and processed by an application.”

cFE Application Developers Guide, section 6.1.2

> “Apps must create a pipe in order to receive messages”

2021 training memo, PDF p97, printed p93

## Message ID

> “‘Message ID’ (first 16-bits) used to uniquely identify a message”

2021 training memo, PDF p92, printed p88

> “Apps must subscribe to each individual message ID they want to receive”

2021 training memo, PDF p97, printed p93
