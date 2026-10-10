import { ChevronLeft, ChevronRight, Moon, Sun, ArrowUpRight } from 'lucide-react'

interface WorldCycle {
  id: string
  name: string
  shortName: string
  location: string
  state: string
  timeLeft: string
  description: string
}

const nextPhases: Record<string, string> = { day: 'Night', night: 'Day', warm: 'Cold', cold: 'Warm', fass: 'Vome', vome: 'Fass', grineer: 'Corpus', corpus: 'Grineer' }

export default function CycleConsole({ worlds, selected, available, onSelect }: {
  worlds: WorldCycle[]
  selected: number
  available: boolean[]
  onSelect: (index: number) => void
}) {
  const world = worlds[selected]
  const phase = world.state.toLowerCase()
  const isCool = ['night', 'cold', 'vome', 'corpus'].includes(phase)
  const next = nextPhases[phase]
  const PhaseIcon = isCool ? Moon : Sun

  return (
    <div className="cycle-console" data-phase={isCool ? 'cool' : 'warm'}>
      <div className="cycle-location">
        <div><span className="cycle-kicker">{world.location}</span><h3>{world.name}</h3></div>
        <span className="cycle-phase"><PhaseIcon size={12} />{available[selected] ? world.state : 'No signal'}</span>
      </div>

      <div className="cycle-scene">
        <svg className="cycle-horizon" viewBox="0 0 320 140" fill="none" aria-hidden="true" focusable="false">
          <path className="cycle-sky-orbit" d="M-20 130Q160-95 340 130M-20 145Q160-80 340 145" />
          <circle className="cycle-celestial-glow" cx="253" cy="42" r="28" />
          {isCool ? <path className="cycle-celestial" d="M261 26a18 18 0 1 0 10 30 19 19 0 0 1-10-30Z" /> : <circle className="cycle-celestial" cx="253" cy="42" r="17" />}
          <path className="cycle-distant-land" d="M0 112l25-10 18 3 30-22 22 13 25-4 35 16 32-8 28 6 26-23 19 11 28-5 32 16v35H0Z" />
          <path className="cycle-near-land" d="M0 125l34-7 24 5 39-9 34 9 33-6 38 8 26-9 34 5 24-7 34 9v17H0Z" />
          <path className="cycle-horizon-line" d="M0 139h320" />
        </svg>
        <div className="cycle-countdown">
          <span className="cycle-kicker">{available[selected] ? next ? `Until ${next}` : 'Until rotation' : 'Awaiting telemetry'}</span>
          <strong aria-label="Time remaining">{available[selected] ? world.timeLeft : '— —'}</strong>
          <span className="cycle-timer-caption">{available[selected] ? 'Time remaining' : 'Cycle data unavailable'}</span>
        </div>
        <div className="cycle-step-controls">
          <button aria-label="Previous world" onClick={() => onSelect((selected + worlds.length - 1) % worlds.length)}><ChevronLeft size={15} /></button>
          <button aria-label="Next world" onClick={() => onSelect((selected + 1) % worlds.length)}><ChevronRight size={15} /></button>
        </div>
      </div>

      {available[selected] && <p className="cycle-field-note">{world.description}</p>}

      <div className="cycle-world-list" aria-label="World cycles">
        {worlds.map((item, index) => (
          <button key={item.id} aria-pressed={selected === index} onClick={() => onSelect(index)} className="cycle-world-row">
            <span className="cycle-world-index">0{index + 1}</span>
            <span className="cycle-world-name">{item.shortName}<small>{available[index] ? item.state : 'No signal'}</small></span>
            <span className="cycle-world-timer">{available[index] ? item.timeLeft : '—'}</span>
            <ArrowUpRight size={12} className="cycle-world-arrow" />
          </button>
        ))}
      </div>
    </div>
  )
}
