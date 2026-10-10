import type { Metadata } from 'next'
import type { ReactNode } from 'react'
export const metadata: Metadata = { title: 'Riven Data — Warframe Nexus', description: 'Explore aggregated Warframe Riven trade statistics by platform, weapon and reroll status.' }
export default function Layout({ children }: { children: ReactNode }) { return children }
