import type { Metadata } from 'next'
import type { ReactNode } from 'react'
export const metadata: Metadata = { title: 'About — Warframe Nexus', description: 'Meet the independent Warframe companion project, its creator and its community data sources.' }
export default function Layout({ children }: { children: ReactNode }) { return children }
