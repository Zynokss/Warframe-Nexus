const relics: Record<string, string> = {
  LITH: 'M24 8l8 9-3 17-5 6-5-6-3-17ZM24 14l4 7-4 13-4-13ZM16 17l-5 7 5 8M32 17l5 7-5 8',
  MESO: 'M24 7l11 10-3 16-8 8-8-8-3-16ZM13 17l11 6 11-6M24 23v18M19 12l5 6 5-6M17 29l7 5 7-5',
  NEO: 'M24 7l7 6 5 11-5 11-7 6-7-6-5-11 5-11ZM24 14l6 10-6 10-6-10ZM12 24h6M30 24h6M24 7v7M24 34v7',
  AXI: 'M24 6l5 9 9 9-9 9-5 9-5-9-9-9 9-9ZM24 14l5 10-5 10-5-10ZM10 24h9M29 24h9M16 12l-5 5M32 12l5 5M16 36l-5-5M32 36l5-5',
  REQUIEM: 'M24 7l12 8v18l-12 8-12-8V15ZM18 18l6-4 6 4v12l-6 4-6-4ZM18 23h12M24 14v20M12 15l6 3M36 15l-6 3',
  OMNIA: 'M24 6l6 7 9 4-3 13-12 12-12-12-3-13 9-4ZM24 14l9 10-9 10-9-10ZM24 19l5 5-5 5-5-5ZM9 17l6 7M39 17l-6 7',
}
const factions: Record<string, string> = {
  Grineer: 'M12 11l8-4 4 6 4-6 8 4-3 9 2 10-7 8-4-6-4 6-7-8 2-10ZM15 18l6 3-4 3M33 18l-6 3 4 3M21 27h6M20 32v5M28 32v5',
  Corpus: 'M12 9h24v7l-4 4v14l-8 6-8-6V20l-4-4ZM18 13h12M20 19h8v10h-8ZM12 25h4M32 25h4M20 34h8M24 9v4',
  Infested: 'M24 8c-8 4-12 11-9 19 2 7 9 12 9 12s7-5 9-12c3-8-1-15-9-19ZM24 16c-7 4-7 12 0 16 7-4 7-12 0-16ZM15 20l-7-5 3-7M33 20l7-5-3-7M15 29l-7 5M33 29l7 5M24 32v7',
  Corrupted: 'M24 7l14 9v16l-14 9-14-9V16ZM24 14l8 5v10l-8 5-8-5V19ZM24 19l5 5-5 5-5-5ZM24 2v5M24 41v5M3 24h7M38 24h7',
  Sentient: 'M24 6l5 9 10 4-9 7-6 16-6-16-9-7 10-4ZM24 14l5 8-5 10-5-10ZM9 19l-3 10 12-3M39 19l3 10-12-3',
  Unknown: 'M24 10a14 14 0 1 0 0 28a14 14 0 1 0 0-28M24 17v9M24 31v1M24 5v5M24 38v5M5 24h5M38 24h5',
}

export default function MissionEmblem({ type, value }: { type: 'relic' | 'faction'; value: string }) {
  const tier = (value || '').toUpperCase()
  const faction = Object.keys(factions).find(name => name !== 'Unknown' && (value || '').toLowerCase().includes(name === 'Infested' ? 'infest' : name.toLowerCase())) || 'Unknown'
  const identity = type === 'relic' ? tier : faction
  const label = type === 'relic' ? `${value || 'Unknown'} relic tier` : `${value || 'Unknown'} faction`
  const path = type === 'relic' ? (relics[tier] || factions.Unknown) : factions[faction]

  return (
    <>

      <span className={`nexus-mission-emblem nexus-mission-${type}`} data-identity={identity} role="img" aria-label={label} title={label}>
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
          <path className="nexus-mission-frame" d="M17 3h14l14 14v14L31 45H17L3 31V17ZM20 6h8M20 42h8M6 20v8M42 20v8" />
          <path d={path} stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </>
  )
}
