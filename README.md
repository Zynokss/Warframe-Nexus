# Warframe Nexus // World State Tracker

> **Your ultimate companion through the depths of the Origin System.**

Warframe Nexus is a real-time telemetry dashboard for Warframe players. Built with Next.js, TypeScript, and Tailwind CSS, it provides up-to-the-second tracking of open-world cycles, void fissures, active invasions, weekly resets, vendor stock, and endgame operations with a customizable sci-fi interface.

---

## Features

- **Real-Time WorldState Telemetry:** Automated background synchronization using TanStack Query (15s refetch interval).
- **Void Fissures & Railjack Void Storms:** Side-by-side active mission streams complete with difficulty tier tags (Lith, Meso, Neo, Axi, Requiem, Omnia) and faction emblem badges.
- **Weekly Progression & Checklist:** Interactive reset tracker for Duviri Spirals, Teshin / Palladino honor vendors, Netracells, Kahl missions, Clem, Maroo, and 1999 calendar tasks with automatic UTC reset logic.
- **Open World & Environmental Cycles:** Live day/night and mood cycles for Cetus, Orb Vallis, Cambion Drift, Earth, and Zariman.
- **Fleet Construction Progress:** Active defense progress bars for the Grineer Fomorian Fleet and Corpus Razorback Armada.
- **Tactical & Endgame Operations:** Live telemetry for Sorties, Archon Hunts, Deep Archimedea, Nightwave acts, and Conclave challenges.
- **Customizable & Collapsible Layout:**
  - Toggle specific cards on or off via the **Customize** menu.
  - Expand or collapse individual dashboard sections.
  - Layout preferences saved automatically in `localStorage`.
- **Alert Notification System:** Optional browser audio & notification alerts for active events.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State & Data Fetching:** TanStack Query (React Query v5)
- **Icons:** Lucide React
- **Asset Integration:** Community SVG assets from Warframe Community Developers (WFCD)

---
Acknowledgments & Credits

    Game data provided by Digital Extremes via the official Warframe WorldState API.

    SVG assets and community icons provided by the Warframe Community Developers (WFCD).
