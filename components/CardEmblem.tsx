const sigils = {
  cycles: 'M20 6V34M6 20H34M20 10a10 10 0 1 0 0 20a10 10 0 1 0 0-20M20 14l4 6-4 6-4-6Z',
  fissures: 'M20 7l7 8-3 5 3 5-7 8-7-8 3-5-3-5ZM20 12l3 8-3 8-3-8ZM9 12l-3 8 3 8M31 12l3 8-3 8',
  storms: 'M20 7l4 13 10 7-11-3-3 10-3-10-11 3 10-7ZM12 12l-5 4M28 12l5 4M20 13v9',
  invasions: 'M10 8l16 20M30 8L14 28M8 7l5 2-3 4ZM32 7l-5 2 3 4ZM10 26l6 6M30 26l-6 6M10 32l4-4M30 32l-4-4',
  endgame: 'M20 6l12 5-2 14-10 9-10-9-2-14ZM20 12l5 5-5 10-5-10ZM12 17l3 3M28 17l-3 3',
  weekly: 'M20 7a13 13 0 1 1-11 6M7 7v8h8M20 12v8l6 4M17 31l3 3 3-3',
  bounties: 'M20 6l4 8 9 2-6 7 1 10-8-5-8 5 1-10-6-7 9-2ZM20 14l4 6-4 6-4-6Z',
  traders: 'M20 7l13 7v13L20 34 7 27V14ZM7 14l13 7 13-7M20 21v13M14 11l13 7M16 7h8',
  news: 'M9 10h22v20H9ZM14 15h6v6h-6ZM24 15h3M24 19h3M14 25h13M5 14v20h22',
  nightwave: 'M20 8v24M15 13v14M25 13v14M10 17v6M30 17v6M6 20H3M34 20h3M14 7a15 15 0 0 1 12 0M14 33a15 15 0 0 0 12 0',
  construction: 'M20 7l11 6v14l-11 6-11-6V13ZM20 13l6 3v8l-6 3-6-3v-8ZM20 13v14M14 16l12 8M26 16l-12 8',
  market: 'M8 13h24l-3 17H11ZM14 13l3-6h6l3 6M15 20h10M17 25h6',
  darvo: 'M8 8h13l12 12-13 13L8 21ZM14 13a2 2 0 1 0 0 4a2 2 0 1 0 0-4M21 17l6 6M18 20l6 6',
  conclave: 'M20 6l5 8 9 2-7 7 1 10-8-5-8 5 1-10-7-7 9-2ZM14 15l12 12M26 15L14 27',
} as const

export type CardEmblemKind = keyof typeof sigils

/** Decorative theme identity only; the card heading provides the accessible name. */
export default function CardEmblem({ kind }: { kind: CardEmblemKind }) {
  return (
    <>

      <span className="nexus-card-emblem" aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none" focusable="false">
          <circle className="nexus-emblem-orbit" cx="20" cy="20" r="18.5" />
          <path d={sigils[kind]} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <path className="nexus-emblem-ticks" d="M20 0v3M20 37v3M0 20h3M37 20h3" />
        </svg>
      </span>
    </>
  )
}
