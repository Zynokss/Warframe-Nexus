import type { CSSProperties } from 'react'
import { Clock, Package, Swords } from 'lucide-react'
import MissionEmblem from '@/components/MissionEmblem'

function factionColor(faction: string) {
  const name = faction.toLowerCase()
  if (name.includes('grineer')) return '#d4a291'
  if (name.includes('corpus')) return '#91c7c6'
  if (name.includes('infest') || name.includes('phorid')) return '#a7c297'
  if (name.includes('sentient')) return '#b9a4ce'
  if (name.includes('narmer')) return '#d8b184'
  if (['corrupted', 'void', 'orokin'].some(value => name.includes(value))) return '#ccb581'
  return '#a5b1a8'
}

interface InvasionConflictProps {
  node: string
  description: string
  eta: string
  attacker: string
  defender: string
  attackerPercent: number
  defenderPercent: number
  attackerReward: string
  defenderReward: string
}

export default function InvasionConflict(props: InvasionConflictProps) {
  const { node, description, eta, attacker, defender, attackerPercent, defenderPercent, attackerReward, defenderReward } = props
  const style = { '--attack-color': factionColor(attacker), '--defend-color': factionColor(defender) } as CSSProperties

  return (
    <article className="invasion-conflict" style={style} aria-label={`${node}: ${description}`}>
      <header className="invasion-location">
        <div><h3>{node}</h3><p><Swords size={11} />{description}</p></div>
        <span className="invasion-eta"><Clock size={11} />{eta || 'Active'}</span>
      </header>

      <div className="invasion-sides">
        {[{ name: attacker, percent: attackerPercent, side: 'attacker', label: 'Attacking force' }, { name: defender, percent: defenderPercent, side: 'defender', label: 'Defending force' }].map(faction => (
          <div key={faction.side} className={`invasion-force invasion-${faction.side}`}>
            <MissionEmblem type="faction" value={faction.name} />
            <div className="invasion-force-name"><small>{faction.label}</small><strong>{faction.name}</strong></div>
            <span className="invasion-force-percent">{faction.percent.toFixed(1)}<small>%</small></span>
          </div>
        ))}
      </div>

      <div className="invasion-balance" role="img" aria-label={`Conflict balance: ${attacker} ${attackerPercent}%, ${defender} ${defenderPercent}%`}>
        <span style={{ width: `${attackerPercent}%` }} /><span style={{ width: `${defenderPercent}%` }} />
        <i aria-hidden="true" />
      </div>

      {(attackerReward || defenderReward) && <div className="invasion-battle-pay">
        {[attackerReward, defenderReward].map((reward, index) => (
          <div key={index}><span><Package size={10} />Battle pay</span><p>{reward || 'No reward listed'}</p></div>
        ))}
      </div>}
    </article>
  )
}
