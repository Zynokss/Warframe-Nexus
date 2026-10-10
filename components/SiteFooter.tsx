import Link from 'next/link'
import { ArrowUpRight, Compass } from 'lucide-react'
import { site } from '@/lib/site'

export default function SiteFooter() {
  return <footer className="site-footer"><div className="site-footer-inner">
    <div className="footer-lead"><Link href="/" className="footer-brand"><Compass size={28} strokeWidth={1} /><span>WARFRAME <strong>NEXUS</strong></span></Link><p>Your field companion through the Origin System.</p><span className="footer-independent">INDEPENDENT FAN PROJECT · MOROCCO</span></div>
    <nav className="footer-link-grid" aria-label="Footer navigation">
      <div><h2>Explore</h2><Link href="/">Live console</Link><Link href="/riven-data">Riven data</Link><Link href="/item-archive">Item archive</Link><Link href="/about">About Nexus</Link></div>
      <div><h2>Tenno tools</h2><Link href="/riven">Riven tool</Link><Link href="/color-picker">Color palettes</Link><Link href="/kim">The Hex</Link><Link href="/glyphs">Glyph codes</Link></div>
      <div><h2>Project</h2><Link href="/credits">Sources & credits</Link><Link href="/support">Support the project</Link><Link href="/contact">Contact</Link><a href="https://www.warframe.com" target="_blank" rel="noopener noreferrer">Official Warframe <ArrowUpRight size={11} /></a></div>
    </nav>
    <div className="footer-disclaimer">Warframe Nexus is an independent fan site, not affiliated with, endorsed by, or sponsored by Digital Extremes. Warframe and its associated trademarks and game assets belong to Digital Extremes Ltd. and their respective owners. Data may be delayed or incomplete.</div>
    <div className="footer-bottom"><span>© 2026 {site.operator || 'Warframe Nexus'} · Independent site content</span><nav aria-label="Legal navigation"><Link href="/legal">Legal notice</Link><Link href="/privacy">Privacy & storage</Link><Link href="/terms">Terms of use</Link></nav><a href="#top" className="footer-top">Back to top ↑</a></div>
  </div></footer>
}
