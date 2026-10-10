import { Gem, Package, Compass } from 'lucide-react'

const copy = {
  riven: { icon: Gem, index: '02', category: 'TRADE INTELLIGENCE', title: 'Riven Data', subtitle: 'The market, decoded.', description: 'Read the signal behind the trades. Explore aggregated Riven statistics across platforms, weapons, and reroll states.' },
  items: { icon: Package, index: '03', category: 'OROKIN RECORDS', title: 'Item Archive', subtitle: 'Every discovery has a story.', description: 'Weapons, Warframes, mods, and the curiosities of the Origin System. Find your next discovery in the community item index.' },
  about: { icon: Compass, index: '04', category: 'THE NEXUS PROJECT', title: 'About Nexus', subtitle: 'Built for the journey.', description: 'An independent companion for Tenno. Live world-state intelligence, useful archives, and a quieter way to navigate a system in motion.' },
}
export default function ArchiveHero({ kind, metrics = [] }: { kind: keyof typeof copy; metrics?: { label: string; value: string }[] }) {
  const content = copy[kind]; const Icon = content.icon
  return <section className="archive-hero" aria-label={content.title}><div className="archive-hero-copy"><span className="nexus-eyebrow">{content.index} / {content.category}</span><h1>{content.title}</h1><h2>{content.subtitle}</h2><p>{content.description}</p></div><div className="archive-hero-seal" aria-hidden="true"><Icon size={42} strokeWidth={.8} /><span>ORIGIN / NEXUS</span></div>{!!metrics.length && <div className="archive-metrics">{metrics.map(metric=><div key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong></div>)}</div>}</section>
}
