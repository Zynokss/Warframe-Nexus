import type { Metadata } from 'next'
import type { ReactNode } from 'react'
export const metadata: Metadata = { title: 'Item Archive — Warframe Nexus', description: 'Search community records for Warframe weapons, mods, gear and collectibles.' }
export default function Layout({ children }: { children: ReactNode }) { return children }
