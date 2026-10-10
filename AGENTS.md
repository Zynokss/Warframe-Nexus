<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Warframe Nexus — agent entry point

Warframe Nexus is a Warframe companion UI: live PC world-state telemetry, a searchable item archive, aggregated Riven trade data, and small static utilities. Stack: Next.js 16.4.0 App Router, React 19.2.4, strict TypeScript, Tailwind CSS 4, TanStack Query 5, Lucide. Source lives directly in `app/`, `components/`, `lib/`, and `types/`; no database or authentication.

## Start here

1. Read this file, then [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md).
2. Read ONLY task-relevant maps: [ARCHITECTURE](docs/ARCHITECTURE.md), [FEATURES](docs/FEATURES.md), [DESIGN_SYSTEM](docs/DESIGN_SYSTEM.md), [DECISIONS](docs/DECISIONS.md).
3. Inspect relevant source before editing. Do not scan the whole repository unless necessary; generated dumps such as `repomix-output.xml` are not authoritative context.
4. Treat docs as navigation, not implementation truth. Resolve discrepancies against current/intended behavior and update stale docs; do not change working code merely to match documentation.
5. Reuse existing architecture/components/patterns, avoid unrelated refactors, and preserve behavior unless the task intentionally changes it.
6. Refresh affected maps after significant changes; keep CURRENT_STATE compact and move lasting knowledge into stable docs. Do not duplicate knowledge in CLAUDE.md.

Commands: `npm ci`; `npm run dev` (localhost:3000); `npm run build`; `npm start` (after build); `npm run lint`; `npm test` (Node regression tests). See CURRENT_STATE for validation limits.

Preserve browser storage keys/state compatibility. Check query defaults before changing caching: long stale times do not disable polling. Read the installed Next.js guides above before framework code changes.

Orokin / Void is the only theme. Preserve the `nexus-*` styling hooks; see DESIGN_SYSTEM before visual changes.
