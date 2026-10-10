# Feature map

| Feature / route | Location and behavior | Limits / interactions |
| --- | --- | --- |
| Dashboard `/` | `app/page.tsx` + `components/*Card.tsx`: cycles, sorties/Archon/Deep and Temporal Archimedea, fissures/Railjack storms, invasions, construction, bounties, vendors/deals, news, Nightwave, Conclave | Shared PC world-state payload; optional data often has empty/default views. Polling/manual sync and persistent visibility/collapse controls. |
| Weekly tasks / Duviri | `components/WeeklyResetCard.tsx`: checklist and rotation display | Local completion with guarded storage; missing mood/rotation data is labelled unavailable. Reset mechanics in ARCHITECTURE.md. |
| Nightwave | `components/NightwaveCard.tsx`: daily/weekly filters and checkmarks | Completion is memory-only, not in-game sync. |
| Riven data `/riven-data` | `app/riven-data/page.tsx` + API handler: platform/weapon/type/rolled filters, statistics, 50-row pages | Aggregated trade data via WFCD, not live market listings; depends on normalization. |
| Archive `/item-archive` | `app/item-archive/page.tsx`: name/description search, type/category/tradable/masterable filters, expandable rows, wiki links, 50-row pages | Full catalog downloaded and filtered locally; no periodic polling; still a large download. |
| Riven tool `/riven` | `app/riven/page.tsx`: weapon selection, theoretical disposition-scaled stats | Five hardcoded weapons; separate from trade viewer; no complete catalog or user-entered grading. |
| Palette matching `/color-picker` | `app/color-picker/page.tsx`: hex input, ranked similarity | Ten hardcoded sampled palettes; RGB distance, not a complete/verified palette database. |
| Hex/KIM `/kim` | `app/kim/page.tsx`: affinity/status/gift/dialogue display and member selection | Static sample content, no game connection or saved progression. |
| Glyphs `/glyphs` | `app/glyphs/page.tsx`: code list, clipboard copy | Hardcoded; validity/expiration unverified. |
| About `/about` | `app/about/page.tsx`: creator/project info, copyable platform suffix examples | Static/browser clipboard. |
| Project information | `app/(info)/`: `/privacy`, `/terms`, `/legal`, `/credits`, `/contact`, `/support`; shared footer on all routes | Confirmed operator/contact in `lib/site.ts`. Support is informational; ad/payment providers and hosting processing details remain unresolved. |
| Arbitration prototype | `app/arbitration/app.tsx`: six hardcoded prediction rows | No `page.tsx`, so `/arbitration` is not registered; no live prediction service. |

Navbar links Live, Riven Data, Item Archive and About. The dashboard hero links the registered Riven tool, palette matcher, Hex and glyph utilities. Orokin / Void is the only visual theme.

Navbar alerts request Notification permission and play a test tone; the toggle is local state. `lib/alerts.ts` includes a notification helper, but no world-event detection or desktop notification caller is wired up. This is not yet functioning event alerts.
