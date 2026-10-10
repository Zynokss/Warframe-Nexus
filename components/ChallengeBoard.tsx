import { Check, Radio, Swords, Clock, Star } from 'lucide-react'
import { TelemetryEmpty } from '@/components/TelemetryPrimitives'

export interface BoardChallenge { id: string; title: string; description?: string; category: string; timer: string; standing?: number; target?: number; done?: boolean }
export default function ChallengeBoard({ kind, challenges, onToggle }: { kind: 'nightwave' | 'conclave'; challenges: BoardChallenge[]; onToggle?: (id: string) => void }) {
  const Emblem = kind === 'nightwave' ? Radio : Swords
  return <div className="intel-view challenge-board"><div className="challenge-signal"><svg className="challenge-wave" viewBox="0 0 140 30" fill="none" aria-hidden="true"><path d="M0 15h10l3-5 4 10 5-18 5 26 5-13h12l5-8 5 16 5-18 5 23 5-13h18l4-6 4 12 4-17 5 22 5-11h30" /></svg><Emblem size={22} aria-hidden="true" /><div><span className="intel-kicker">{kind === 'nightwave' ? 'Nora’s broadcast' : 'Teshin’s arena'}</span><strong>{kind === 'nightwave' ? 'Nightwave acts' : 'Conclave challenges'}</strong></div><span>{challenges.length}<small> active</small></span></div>
    <div className="intel-scroll custom-scrollbar">{!challenges.length ? <TelemetryEmpty message={`No active ${kind === 'nightwave' ? 'Nightwave acts' : 'Conclave challenges'} received.`} /> : challenges.map(challenge => {
      const content = <><div className="challenge-entry-top"><span className="intel-kicker">{challenge.category}</span>{challenge.standing !== undefined && <span className="challenge-standing"><Star size={10} />{challenge.standing.toLocaleString()}</span>}</div><div className="challenge-entry-body">{onToggle && <span className="challenge-check" aria-hidden="true">{challenge.done && <Check size={13} />}</span>}<div><h4>{challenge.title}</h4>{challenge.description && <p>{challenge.description}</p>}</div></div><div className="challenge-entry-footer"><span>{challenge.done ? 'Completed' : challenge.target ? `Target: ${challenge.target}` : onToggle ? 'Mark as complete' : 'Conclave protocol'}</span><span><Clock size={10} />{challenge.timer}</span></div></>
      return onToggle ? <button className="challenge-entry" key={challenge.id} aria-pressed={Boolean(challenge.done)} onClick={() => onToggle(challenge.id)}>{content}</button> : <article className="challenge-entry" key={challenge.id}>{content}</article>
    })}</div>
  </div>
}
