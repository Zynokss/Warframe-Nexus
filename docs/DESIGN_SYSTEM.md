# Design system

**Orokin / Void** is the only visual theme: obsidian/green-black surfaces, antique gold, ivory typography, teal Void light, fine borders and restrained architectural ornament. There is no theme provider, selector or theme storage.

- **Sources:** `app/globals.css` owns root tokens and global theme rules. Preserve `nexus-page`, `nexus-panel`, `nexus-utility`, `data-card` and header hooks; feature/status colors also use inline Tailwind classes.
- **Typography:** Rajdhani and JetBrains Mono map to sans/mono variables. Large compact hero headings contrast with small tracked labels and monospace telemetry.
- **Layout:** centered dashboard capped at 1560px, cinematic hero and a responsive 12-column sidebar/content grid. Utility pages retain width caps. Container queries adapt card interiors independently of viewport width.
- **Cards:** engraved corners, category-colored edges, small corners and dark green nested surfaces. `CardEmblem.tsx` supplies 14 decorative vector sigils. A masked generated observatory texture supports headers. Card owners retain filters/state/timers; presentation views receive props and callbacks without fetching or persistence.
- **Report views:** `MissionBriefing.tsx` handles operations/modifiers; `VendorManifest.tsx` Baro and Arbitration; `BountyBoard.tsx` bounty contracts; `ChallengeBoard.tsx` Nightwave/Conclave; `MarketManifest.tsx` market/Darvo; `DispatchFeed.tsx` six news links. Shared report primitives: `TelemetryPrimitives.tsx`. `.nexus-selector` styles controls; `.intel-*` styles reports. Wrap important details instead of truncating them.
- **Cycles:** `CycleConsole.tsx` shows phase-aware decorative horizons, next-phase countdown and five-world selection. `EnvironmentsCard.tsx` owns interpretation/selection/ticking. No signal is explicit; horizons are not cycle-progress charts.
- **Weekly objectives:** `WeeklyAgenda.tsx` presents reset/completion summaries, mood, grouped tasks and numbered slots. `WeeklyResetCard.tsx` owns hydration/storage/timing through `lib/weekly-checklist.ts`. Counts come from existing task state.
- **Construction:** `FleetConstruction.tsx` presents decorative schematics, exact percentages and accessible segmented bars. `ConstructionCard.tsx` owns parsing/clamping and attack warnings. Missing telemetry shows No signal.
- **Invasions:** `InvasionConflict.tsx` presents faction sigils, exact balance and paired battle pay. `InvasionsCard.tsx` owns filtering/rewards/percentages; zero completion is valid.
- **Mission badges:** `MissionEmblem.tsx` supplies relic/faction SVGs, accessible names and tooltips. Distinct silhouettes and muted colors carry identity; unknown inputs get a neutral seal.
- **Artwork:** `OrokinHero.tsx` uses `public/images/orokin-void-hero.webp`; status/counts derive from queries. `ArchiveHero.tsx` reuses atmosphere and route-specific seals with real dataset metrics. HTML owns text/buttons; generation provenance is in ARTWORK.md.
- **Project pages:** `SiteFooter.tsx` renders once in the root layout. `InfoPage.tsx` provides readable legal/project pages; About retains clipboard feedback. Archive filters, table and pagination remain their existing feature owners.
- **Interactions/accessibility:** preserve tabs, filters, checklists, collapse controls and copy feedback. The hero exposes sync/customization. Navigation marks the current page; toggles expose state. The customization dialog supports Escape, focus containment/restoration and scroll locking. Visible focus outlines and reduced-motion rules are global. Existing contrast/legacy utility controls still need task-specific review.

Avoid a competing UI kit, unnecessary ornamental motion or spacing that sacrifices telemetry density. Reuse established hooks/views and preserve semantic status colors.
