import type { ReactNode } from 'react'
import Link from 'next/link'
import { site } from '@/lib/site'

export default function InfoPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return <><header className="info-page-heading"><span className="nexus-eyebrow">NEXUS / PROJECT INFORMATION</span><h1>{title}</h1><p>{intro}</p><span className="info-page-date">Updated {site.updated}</span></header><div className="info-page-content">{children}</div><nav className="info-page-related" aria-label="Project information"><Link href="/legal">Legal</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/credits">Credits</Link><Link href="/contact">Contact</Link></nav></>
}
