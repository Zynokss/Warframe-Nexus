# Current state

Updated 2026-10-10. Current focus: reliability and release readiness after the Orokin redesign. Orokin / Void is the only theme; DESIGN_SYSTEM.md maps the views. Shared footer, project/legal pages, and themed Riven/Item/About are implemented. Public identity/contact is in `lib/site.ts` (Ashraf / Zynoks); ads/donation providers remain undecided.

Recent work: the theme selector/provider, duplicate Original Nexus layouts, old icon fallbacks and unused rendering helpers have been removed. Old browser theme values are ignored; dashboard/checklist storage is unchanged. Single-theme browser checks pass at 1440px/390px/320px for cards and archive/project pages, report filters/tabs, checklist interaction, customization/collapse persistence and empty states.

Reliability work:

- Next.js and matching ESLint config upgraded to 16.4.0; compatible transitive security updates applied. Production audit: **0 findings**. Full audit: **5 high**, all in the development ESLint → fast-glob/micromatch/braces chain. No published patched braces version found; do not apply npm’s suggested Next-14 tooling downgrade blindly.
- Baseline headers in `next.config.ts`: MIME, framing, referrer, browser permissions, object/base CSP; HSTS for production. This is not a full script/nonce CSP. Verify proxy/Cloudflare headers after deployment.
- Checklist now resets Monday 00:00 UTC, including open-tab rollover. Recent legacy Sunday records retain marks once; ambiguity and schema migration are in DECISIONS.md. Dashboard/checklist storage is guarded and missing Duviri telemetry no longer displays invented rotations.
- Both Deep and Temporal Archimedea use current `archimedeas`, including untranslated live type keys, deviations, normal/elite risks and personal modifiers. Legacy Deep payloads remain supported.
- Archive/Riven polling is disabled; dashboard stays at 15 seconds. Archive still downloads the full catalog.
- World-state error/retry/timeouts remain; background failures preserve loaded cards. WarframeStat returned 404 earlier, then HTTP 200 during the latest check; external uptime is not guaranteed.

## Validation and remaining work

Production build and TypeScript pass. `npm test` passes 10 regression tests covering reset boundaries/migration, malformed settings, blocked storage and Archimedea normalization. Browser checks cover responsive cards/pages, checklist migration/open-tab rollover, denied storage and controls. Archive/Riven each stayed at one request across 16 seconds; live Deep/Temporal each rendered three missions and four personal modifiers. Fixture checks remain distinct from external health. Existing lint issues remain (**33 errors / 8 warnings**); new pure helpers/tests lint cleanly. There is no CI yet.

Next priorities: resolve remaining lint/render-time pagination issues; reduce catalog transfer size; finish or accurately label event alerts and sample utilities; image/clipboard/input fallbacks and accessibility checks; sitemap/canonical/social metadata. FEATURES.md records static-tool limitations. Security/monetization and self-hosted release checks: SITE_AUDIT.md. Logo permissions, actual hosting processing details, applicable operator/CNDP requirements and provider/consent work remain unresolved; information pages do not certify compliance.

Changes are local; production deployment/revision still needs verification. Ignore `.next/` and `repomix-output.xml` as context sources.
