# Architecture

## Map and boundaries

- `app/layout.tsx`: server root layout, metadata/fonts, global CSS, client Query provider, and shared `SiteFooter.tsx`. Individual pages include `components/Navbar.tsx`; navigation is not in the root layout.
- `app/page.tsx`: client dashboard, single world-state query, customization controls, feature-card composition.
- `app/*/page.tsx`: independent client feature screens; route inventory in FEATURES.md. `app/(info)/` shares a server layout and `InfoPage.tsx` for project/legal pages. `ArchiveHero.tsx` shares presentation across the Riven, item and About screens.
- `app/api/`: two server GET handlers proxy/normalize public upstream data. No separate backend, database, authentication, or account sync.
- `components/*Card.tsx`: prop-driven Orokin dashboard views with local filters/timers. `WarframeCard.tsx` exists but is not imported by current cards; most own their shells. `CardEmblem.tsx` provides presentation-only Orokin sigils; card metadata and header hooks select category styling.
- Presentation views (briefings, vendor/bounty/challenge boards, market manifests, dispatches) live beside their `*Card.tsx` owners and share `TelemetryPrimitives.tsx`. Cards still own state/queries-to-props handling; views do not fetch or introduce persistence. DESIGN_SYSTEM.md maps the view names.
- `components/OrokinHero.tsx` is presentation-only, receiving real status/counts and callbacks from the dashboard.
- `lib/archimedea.ts` adapts current `archimedeas` (Deep/Temporal, including untranslated CT_LAB/CT_HEX labels), mission deviations/risks and personal modifiers; accepts legacy `deepArchimedea` without duplicating modes. `EndgameCard.tsx` owns mode selection.
- `components/Providers.tsx`: one QueryClient per mounted provider. `lib/`: countdown and browser alert helpers. `types/warframe.ts`: world-state interfaces, not runtime validation; some consumers use `any` and extra fields.
- `public/images/`: banner/logos. Root config: `next.config.ts` defines baseline security headers (framing, MIME, referrer, restricted browser permissions and object/base CSP; HSTS in production), strict TypeScript with `@/*` mapped to repository root, Tailwind PostCSS plugin, Next ESLint presets.

## Data flows

```text
warframestat.us PC world state + browse.wf incursions
  → /api/worldstate → dashboard Query cache → card props
warframestat.us platform Riven data
  → /api/rivens?platform=… → normalized rows → Riven table
warframestat.us/items → browser Query cache → archive filters/pagination
dashboard preferences / weekly checklist → localStorage
```

World state is PC/English only, fetched uncached and returned with no-store headers. Incursions use `browse.wf/live` first, syndicate missions as fallback, and are attached as `steelPathIncursions: { eta, list }`. Main upstream failure returns HTTP 502 with a useful message; auxiliary failure allows fallback. Main requests have a 12-second timeout and optional browse.wf requests 3 seconds. The dashboard bounds requests to 20 seconds, skips automatic query retries, keeps the 15-second polling, and retains existing data on background failures.

Riven handler accepts PC/PS4/XB1/SWITCH (unknown values fall back to PC), requests six-hour upstream revalidation, and recursively finds trade-stat leaves to normalize differing payload shapes. Item data is fetched directly in the browser; images use the warframestat CDN. No API credentials are used. `lib/site.ts` holds confirmed public operator/contact details; optional `NEXT_PUBLIC_SITE_OPERATOR` and `NEXT_PUBLIC_CONTACT_EMAIL` override them at build time.

## State and persistence

Query defaults: 15-second polling, immediately stale, refetch on window focus. Dashboard explicitly polls every 15 seconds. Riven uses a 12-hour stale time and disables polling; focus/mount refetch only when stale. Archive uses Infinity and disables polling/focus refetch. Cache is memory-only and inactive queries can be garbage-collected.

Local React state holds filters, pagination, selections, alert toggle, and Nightwave checkmarks. Browser persistence:

| Key | Owner |
| --- | --- |
| `warframe_hub_visible_cards` | Dashboard visibility |
| `warframe_hub_collapsed_cards` | Dashboard collapse state |
| `wf_weekly_checklist` | WeeklyResetCard tasks and reset timestamp |

Weekly checklist uses Monday 00:00 UTC through `lib/weekly-checklist.ts`. Version 2 state preserves the storage key and task fields; recent legacy Sunday records migrate conservatively once (DECISIONS.md). Expired progress resets on mount, timer ticks, focus/visibility and before toggles. `lib/browser-storage.ts` guards dashboard/checklist reads/writes and validates dashboard flags; denied storage retains memory-only behavior. Storage is browser/device-local; no cross-device sync. Countdowns use the client clock, not extra API calls.
