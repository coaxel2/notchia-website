# NotchIA (software) — English Wikipedia Draft

> **WARNING — Do not submit to English Wikipedia yet.** English Wikipedia enforces strict [Notability (software)](https://en.wikipedia.org/wiki/Wikipedia:Notability_(software)) and [WP:GNG](https://en.wikipedia.org/wiki/Wikipedia:Notability) requirements: at least two reliable, independent, secondary sources with substantial coverage. As of 2026-05-27, NotchIA has no confirmed tier-1 tech press coverage (no MacStories, 9to5Mac, The Verge, Macworld, Six Colors, Daring Fireball, or equivalent reviews). Submitting this draft now via [Articles for Creation](https://en.wikipedia.org/wiki/Wikipedia:Articles_for_creation) will almost certainly be **declined for lack of notability**, and could create a "draftspace tombstone" that complicates later resubmission. **Recommended path:** wait until at least two substantial editorial reviews from established tech publications exist, then revise this draft to cite them as primary supporting references before resubmitting.

---

{{Infobox software
| name                   = NotchIA
| logo                   = 
| developer              = Axel Courty (sole proprietorship, [[Talence]], [[France]])
| released               = 2026
| latest release version = 2.8.0 "Wise Owl"
| latest release date    = {{Start date and age|2026|05|15}}
| operating system       = [[macOS]] 15 or later; [[Apple silicon]] and [[Intel]]
| platform               = [[Mac (computer)|Mac]]
| size                   = ~30&nbsp;MB
| language               = English, French, Spanish, German
| genre                  = [[Utility software]] / productivity
| license                = Proprietary ([[freemium]])
| website                = {{URL|https://notchia.app}}
}}

'''NotchIA''' is a proprietary [[macOS]] [[utility software|utility]] developed by Axel Courty, operating as a French sole proprietorship registered with the [[Registre du commerce et des sociétés]] of [[Bordeaux]] under number 105 093 058.<ref name="insee">{{Cite web|url=https://www.sirene.fr/sirene/public/recherche?sirenSearch=105093058|title=Company record, SIREN 105 093 058|website=Sirene — [[INSEE]]|access-date=2026-05-27}}</ref> The application uses the [[MacBook]] [[Display notch|notch]], or a virtual area in the [[menu bar (computing)|menu bar]] on Macs without a physical notch, as a persistent interaction surface for several productivity modules.<ref name="official">{{Cite web|url=https://notchia.app/|title=Official website|publisher=NotchIA|access-date=2026-05-27}}</ref>

According to its developer, NotchIA is the first notch-utility application to integrate live monitoring of command-line [[Artificial intelligence|AI]] assistants, including [[Claude (language model)|Claude Code]] by [[Anthropic]], ChatGPT Codex by [[OpenAI]], and [[GitHub Copilot]] CLI.<ref name="features">{{Cite web|url=https://notchia.app/#features|title=Features|publisher=NotchIA|access-date=2026-05-27}}</ref>

== Overview ==

NotchIA is distributed outside the [[Mac App Store]], directly from the developer's website, as a signed and notarized binary. The application is positioned as an aggregator for recurring macOS interactions — media controls, calendar, ephemeral notes, file handling, and developer-assistant monitoring — in a single overlay anchored to the notch.<ref name="official"/> The binary is approximately 30&nbsp;[[megabyte]]s, and the developer states that the application collects no [[telemetry]].<ref name="features"/> Automatic updates are delivered through the [[Sparkle (software)|Sparkle]] framework with [[EdDSA]] signatures.<ref name="sparkle">{{Cite web|url=https://sparkle-project.org|title=Sparkle — open source software update framework for macOS|access-date=2026-05-27}}</ref>

== Features ==

According to the developer's documentation, NotchIA includes fourteen primary modules:<ref name="features"/>

* '''Media player''' — multi-source media controls ([[Spotify]], [[Apple Music]], browsers).
* '''Calendar''' — display of system calendar events and reminders.
* '''Shelf''' — temporary [[drag and drop]] area for files.
* '''Focus''' — [[Pomodoro Technique|Pomodoro]]-style focus timer.
* '''Clipboard''' — [[clipboard (computing)|clipboard]] history.
* '''System HUD''' — replacement of native macOS HUDs (volume, brightness).
* '''Sneak Peek Engine''' — contextual previews on hover.
* '''Convert''' — file-format conversion (image, audio, document).
* '''RSS Digest''' — local summarization of [[RSS]] and [[Atom (web standard)|Atom]] feeds via [[Apple Intelligence]] ''Foundation Models''.
* '''PDF Summarizer''' — local summarization of [[PDF]] documents using the same on-device models.
* Live tracking of multiple command-line AI assistants (see dedicated section).
* System status display (battery, network, [[AirDrop]]).
* Ephemeral notes.
* Customizable shortcuts.

=== AI command-line assistant tracking ===

The developer describes NotchIA as the first notch-utility application to integrate real-time monitoring of command-line AI assistants.<ref name="features"/> The module reads local session files for [[Claude (language model)|Claude Code]], ChatGPT Codex, and [[GitHub Copilot]] CLI, displays ten distinct real-time states (idle, generating, awaiting tool, etc.), the number of [[Lexical analysis#Token|tokens]] consumed, and rolling [[rate limiting|quota]] windows over five hours and seven days.<ref name="features"/>

=== Apple Intelligence integration ===

Two modules — ''RSS Digest'' and ''PDF Summarizer'' — rely on the ''Foundation Models'' provided by [[Apple Intelligence]] on compatible Macs.<ref name="apple-foundation">{{Cite web|url=https://developer.apple.com/documentation/foundationmodels|title=Foundation Models|publisher=Apple Developer Documentation|access-date=2026-05-27}}</ref> According to the developer, inference runs entirely on-device. On macOS 15, these two modules degrade to a mode without [[generative artificial intelligence|generative]] summarization.<ref name="features"/>

== History ==

* 19 May 2026: registration of Axel Courty's sole proprietorship with the [[Registre du commerce et des sociétés]] of [[Bordeaux]], under number 105 093 058, [[NAF (industry classification)|APE]] code 4791B, intra-EU [[VAT identification number|VAT]] number FR86105093058.<ref name="insee"/>
* May 2026: public launch and opening of online payments. Version 2.8.0 "Wise Owl", released on 15 May 2026, introduced the ''RSS Digest'' module and document summarization in ''Shelf''.<ref name="official"/>

== Technology ==

The application is developed natively for [[macOS]] in [[Swift (programming language)|Swift]] and [[SwiftUI]].<ref name="features"/> Embedded [[artificial intelligence]] features rely on the ''Foundation Models'' framework from [[Apple Intelligence|Apple]], which runs [[Statistical inference|inference]] on-device on the [[Apple silicon|Neural Engine]].<ref name="apple-foundation"/> Distribution and automatic updates use the [[Sparkle (software)|Sparkle]] framework with [[EdDSA]] cryptographic signatures.<ref name="sparkle"/> Because the application is distributed outside the [[Mac App Store]], it requires Apple signing and [[notarization (Apple)|notarization]] but not the App Store editorial review.<ref name="apple-notarize">{{Cite web|url=https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution|title=Notarizing macOS Software Before Distribution|publisher=Apple Developer Documentation|access-date=2026-05-27}}</ref>

== Business model ==

NotchIA follows a [[freemium]] model. According to the pricing published by the developer:<ref name="pricing">{{Cite web|url=https://notchia.app/#pricing|title=Pricing|publisher=NotchIA|access-date=2026-05-27}}</ref>

* '''Essential''' — free, base features.
* '''Pro''' — €2.99 per month, advanced modules and AI-assistant tracking.
* '''Lifetime Pro''' — €24.99 one-time purchase for two Macs, lifetime access to Pro features and major updates.

Payments are processed through [[Stripe]]. License delivery uses [[Ed25519]] cryptographic signatures backed by a [[Cloudflare]] D1 database, as stated by the developer.<ref name="official"/>

== Positioning ==

Several applications occupy an equivalent [[niche market|niche]] on [[macOS]]: ''NotchNook'' (Touchscreen Studio), ''MediaMate'', ''Alcove'', ''TopNotch'', and the [[open-source software|open-source]] project ''Boring.Notch''. According to its developer, NotchIA differentiates itself by combining live AI-assistant tracking with modules built on top of ''Apple Intelligence''.<ref name="features"/>

== Reception ==

As of 27 May 2026, no substantial independent secondary sources covering NotchIA have been identified. This article draws primarily on primary sources (the developer's website, [[INSEE]] registry) and on secondary technical sources (Apple developer documentation, the ''Sparkle'' project). The section will be expanded as consumer-software publications cover the application.

== See also ==

* [[Display notch]]
* [[Apple Intelligence]]
* [[MacBook Pro]]
* [[Sparkle (software)]]
* [[List of Mac software]]
* [[Freemium]]

== References ==

{{Reflist}}

== External links ==

* {{Official website|https://notchia.app/}}
* [https://notchia.app/#pricing Pricing published by the developer]
* [https://www.sirene.fr/sirene/public/recherche?sirenSearch=105093058 INSEE / Sirene company record]

{{DEFAULTSORT:NotchIA}}
[[Category:MacOS-only software]]
[[Category:Utility software for macOS]]
[[Category:Proprietary software]]
[[Category:2026 software]]
