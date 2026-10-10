import { AlertTriangle, Check, Hammer } from 'lucide-react'

export default function FleetConstruction({ fomorian, razorback, fomorianAvailable, razorbackAvailable }: {
  fomorian: number
  razorback: number
  fomorianAvailable: boolean
  razorbackAvailable: boolean
}) {
  const fleets = [
    { id: 'fomorian', name: 'Fomorian', faction: 'Grineer fleet', value: fomorian, available: fomorianAvailable },
    { id: 'razorback', name: 'Razorback', faction: 'Corpus armada', value: razorback, available: razorbackAvailable },
  ]

  return (
    <div className="fleet-construction">
      {fleets.map(fleet => {
        const complete = fleet.available && fleet.value >= 100
        return <article key={fleet.id} className="fleet-report" data-fleet={fleet.id} data-complete={complete}>
          <header><div><span className="fleet-kicker">{fleet.faction}</span><h3>{fleet.name}</h3></div>
            <span className="fleet-phase">{complete ? <AlertTriangle size={11} /> : <Hammer size={11} />}{!fleet.available ? 'No signal' : complete ? 'Ready' : 'Building'}</span>
          </header>
          <div className="fleet-assembly">
            <svg className="fleet-schematic" viewBox="0 0 120 100" fill="none" aria-hidden="true" focusable="false">
              <path className="fleet-blueprint-grid" d="M10 10h100v80H10ZM10 30h100M10 50h100M10 70h100M30 10v80M50 10v80M70 10v80M90 10v80" />
              {fleet.id === 'fomorian' ? <g>
                <path d="M60 12l14 14v42L60 88 46 68V26ZM46 26L25 34 18 64l28 4M74 26l21 8 7 30-28 4M25 34l9 25 12-9M95 34l-9 25-12-9M53 31h14v30H53ZM60 61v18M24 69l6 9M96 69l-6 9" />
                <path className="fleet-reactor" d="M55 38h10v15H55Z" />
              </g> : <g>
                <path d="M44 22h32l7 26-10 17H47L37 48ZM49 14h22v8M44 30L24 40 17 68l14 15h10M76 30l20 10 7 28-14 15H79M47 57L34 70l8 18M73 57l13 13-8 18M44 38h32M49 47h22M53 65v15h14V65" />
                <path className="fleet-reactor" d="M53 27h14v7H53Z" />
              </g>}
              <path className="fleet-blueprint-ticks" d="M60 3v5M60 92v5M2 50h5M113 50h5" />
            </svg>
            <div className="fleet-percentage"><span className="fleet-kicker">Assembly completion</span><strong>{fleet.available ? fleet.value.toFixed(2) : '—'}{fleet.available && <small>%</small>}</strong>
              <p>{!fleet.available ? 'Awaiting construction telemetry' : complete ? 'Construction complete' : 'Assembly in progress'}</p>
            </div>
          </div>
          <div className="fleet-progress" role="progressbar" aria-label={`${fleet.name} construction`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={fleet.available ? fleet.value : undefined} aria-valuetext={!fleet.available ? 'Data unavailable' : undefined}>
            <span style={{ width: `${fleet.available ? fleet.value : 0}%` }} />
          </div>
          <footer><span>{complete ? <Check size={11} /> : <Hammer size={11} />}{complete ? 'Attack imminent' : fleet.available ? 'Fleet construction' : 'Telemetry unavailable'}</span><span>{complete ? '100% complete' : fleet.available ? `${(100 - fleet.value).toFixed(2)}% remaining` : '—'}</span></footer>
        </article>
      })}
    </div>
  )
}
