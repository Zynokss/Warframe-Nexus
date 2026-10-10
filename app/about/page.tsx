'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Radio, Gem, ShieldCheck, Copy, Check, ArrowUpRight, Compass } from 'lucide-react'
import Navbar from '@/components/Navbar'
import ArchiveHero from '@/components/ArchiveHero'
import { site } from '@/lib/site'

const PLATFORM_TAGS = [
  { platform: 'PC / Cross-Play', suffix: '#000', example: 'Tenno#000' },
  { platform: 'PlayStation', suffix: '#100', example: 'Tenno#100' },
  { platform: 'Xbox', suffix: '#200', example: 'Tenno#200' },
  { platform: 'Nintendo Switch', suffix: '#300', example: 'Tenno#300' },
]

export default function AboutPage() {
  const [copiedSuffix, setCopiedSuffix] = useState<string | null>(null)
  const [copyMessage, setCopyMessage] = useState('')
  async function handleCopy(suffix: string) {
    try {
      await navigator.clipboard.writeText(suffix)
      setCopiedSuffix(suffix)
      setCopyMessage('Copied to clipboard.')
      setTimeout(() => setCopiedSuffix(null), 2000)
    } catch { setCopyMessage('Clipboard access was unavailable. You can copy the displayed suffix manually.') }
  }
  return <div className="nexus-page nexus-utility archive-page archive-about min-h-screen"><Navbar /><main className="archive-about-main">

    <ArchiveHero kind="about" metrics={[{ label: 'Created by', value: site.creator }, { label: 'Access', value: 'Free for Tenno' }, { label: 'Project', value: 'Independent' }]} />
    <div className="about-introduction"><span className="nexus-eyebrow">A FIELD COMPANION, MADE WITH PURPOSE</span><h2>Less searching.<br /><span>More time in the Origin System.</span></h2><p>Nexus brings world-state feeds, item records, and Riven trade statistics into one place. Built by {site.creator}, operated by {site.operator} from Morocco, and designed for players who want useful information without losing the atmosphere of Warframe.</p></div>
    <section className="about-capabilities" aria-label="What Nexus offers">{[{ icon: Radio, title: 'Live intelligence', text: 'PC world-state cycles, missions, vendors, and rotations from community feeds.' }, { icon: Gem, title: 'Useful archives', text: 'Searchable item records and aggregated Riven trade statistics across platforms.' }, { icon: ShieldCheck, title: 'Your own console', text: 'Dashboard preferences and weekly checkmarks saved in your browser.' }].map(({icon:Icon,title,text})=><article key={title}><Icon size={25} strokeWidth={1} /><h3>{title}</h3><p>{text}</p></article>)}</section>
    <div className="about-detail-grid"><section className="about-source-panel"><span className="intel-kicker">Community-powered information</span><h2>The signal behind Nexus</h2><p>WarframeStat and WFCD provide the world-state, item, and Riven datasets. Feeds may be delayed or incomplete; historical Riven statistics are not current market listings.</p><p>Nexus is not connected to your Warframe account. Some secondary tools contain limited or sample data.</p><Link href="/credits">Meet the data sources <ArrowUpRight size={13} /></Link><Link href="/contact">Contact {site.creator} <ArrowUpRight size={13} /></Link></section>
    <section className="about-suffix-panel"><span className="intel-kicker">Preserved reference tool</span><h2>Platform suffix examples</h2><p>Copy a suffix from the existing reference list. Confirm the full player identifier in-game before using it.</p>{PLATFORM_TAGS.map(tag=><div className="about-suffix-row" key={tag.platform}><div><strong>{tag.platform}</strong><span>{tag.example}</span></div><button onClick={() => handleCopy(tag.suffix)} aria-label={`Copy ${tag.platform} suffix`}>{copiedSuffix===tag.suffix ? <Check size={12} /> : <Copy size={12} />}{copiedSuffix===tag.suffix ? 'Copied' : tag.suffix}</button></div>)}<p role="status" className="about-copy-status">{copyMessage}</p></section></div>
    <section className="about-independent"><Compass size={26} strokeWidth={1} /><div><h2>An independent fan project</h2><p>Nexus is not affiliated with or endorsed by Digital Extremes. Warframe and its game assets belong to their respective owners.</p></div><Link href="/legal">Legal notice <ArrowUpRight size={13} /></Link></section>
  </main></div>
}
