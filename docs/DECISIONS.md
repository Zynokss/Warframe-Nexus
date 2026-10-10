# Decisions and constraints

These entries record observed architecture on 2026-10-10, not reconstructed historical intent. Revise deliberately when requirements change.

## 2026-10-10 — Public upstream data with a thin Next.js backend

Decision: World state and Riven normalization use App Router GET handlers; archive fetches directly in the browser.

Reason: Historical rationale unknown.

Implications: External reliability/payload shapes matter; archive also depends on browser access to upstream. World state is PC-only, Riven data supports platform selection.

Do not: Assume private game access, database, login, or account sync exists.

## 2026-10-10 — Browser-local user state

Decision: Dashboard preferences and weekly tasks use localStorage; most other UI state is ephemeral.

Reason: Historical rationale unknown.

Implications: Preserve stored-state compatibility and hydration handling. Reset behavior is app code, not a backend job.

Do not: Rename storage keys/change shapes casually, or describe local completion as in-game progress.

## 2026-10-10 — Compact shared agent context

Decision: AGENTS.md and CLAUDE.md lead to shared focused docs; CURRENT_STATE is the small session starting point.

Reason: Enable fresh sessions with low token usage, as requested for this repository.

Implications: Read relevant maps, verify source, refresh temporary state after meaningful changes.

Do not: Copy source inventories, conversation history, or generated repo dumps into context docs.

## 2026-10-10 — Single Orokin / Void presentation

Decision: Orokin / Void is the only theme; remove selection, theme persistence, duplicate Original Nexus views and fallback icon renderers.

Reason: The project now requires one visual direction and a smaller presentation codebase.

Implications: Global theme styles use the existing `nexus-*` hooks; feature owners retain query/state/persistence behavior. Old browser theme values are ignored.

Do not: Reintroduce duplicate presentation paths or alter dashboard/checklist storage as part of visual changes.

## 2026-10-10 — Monday reset with conservative legacy migration

Decision: Checklist version 2 resets Monday 00:00 UTC. Preserve checkmarks in recent legacy Sunday records once, keeping the existing storage key and task fields.

Reason: Official schedules use Monday (sources in SITE_AUDIT.md). Legacy records contain a reset boundary, not per-task completion times; clearing them immediately could erase valid progress.

Implications: Migration may retain an ambiguous mark until the next Monday. New-format records reset exactly on the boundary, including an open/background tab when it resumes.

Do not: Claim migration can reconstruct completion times or recover marks already erased by the old Sunday reset.
