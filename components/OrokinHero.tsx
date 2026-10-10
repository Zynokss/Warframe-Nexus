'use client'

import Link from 'next/link'
import { ArrowUpRight, RefreshCw, SlidersHorizontal, Crosshair, Radio } from 'lucide-react'

interface OrokinHeroProps {
  onCustomize: () => void
  onSync: () => void
  isFetching: boolean
  status: 'connecting' | 'offline' | 'connected'
  fissureCount?: number
  invasionCount?: number
}

export default function OrokinHero({ onCustomize, onSync, isFetching, status, fissureCount, invasionCount }: OrokinHeroProps) {
  return (
    <section className="orokin-hero" aria-labelledby="orokin-heading">
      <div className="orokin-hero-art" aria-hidden="true" />
      <div className="orokin-hero-grain" aria-hidden="true" />
      <div className="orokin-hero-content">
        <div className="nexus-eyebrow"><span className="nexus-diamond" /> THE TENNO’S FIELD COMPANION</div>
        <h1 id="orokin-heading">A system in motion.<br /><span>A Tenno prepared.</span></h1>
        <p>Beyond the Void, every moment matters.<br />Your missions, rotations, and rewards. One command center.</p>
        <div className="orokin-hero-actions">
          <button className="nexus-button nexus-button-gold" onClick={onCustomize}><SlidersHorizontal size={14} /> Customize console <ArrowUpRight size={15} /></button>
          <button className="nexus-button nexus-button-outline" onClick={onSync} disabled={isFetching}><RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} /> {isFetching ? 'Syncing…' : 'Sync world state'}</button>
        </div>
      </div>
      <div className="orokin-art-caption" aria-hidden="true"><span>OROKIN ARCHIVE / 001</span><strong>Echoes of the Void</strong></div>
      <div className="orokin-hero-footer">
        <div className="orokin-connection" role="status"><Radio size={14} /><span className={`nexus-status-dot ${status}`} /><span>{status === 'connected' ? 'WORLD STATE CONNECTED' : status === 'offline' ? 'SIGNAL INTERRUPTED' : 'ESTABLISHING UPLINK'}</span></div>
        <div className="orokin-live-count"><Crosshair size={13} /><strong>{fissureCount ?? '—'}</strong> FISSURES <span>/</span><strong>{invasionCount ?? '—'}</strong> INVASIONS</div>
        <span className="orokin-coordinate">ORIGIN SYSTEM · PC</span>
      </div>
      <nav className="orokin-utility-nav" aria-label="Tenno utilities">
        <span>EXPLORE THE ARCHIVE</span>
        <Link href="/riven">Riven tool <ArrowUpRight size={12} /></Link>
        <Link href="/color-picker">Color palettes <ArrowUpRight size={12} /></Link>
        <Link href="/kim">The Hex <ArrowUpRight size={12} /></Link>
        <Link href="/glyphs">Glyph codes <ArrowUpRight size={12} /></Link>
      </nav>
    </section>
  )
}
