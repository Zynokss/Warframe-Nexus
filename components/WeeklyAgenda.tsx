import { Check, Clock, Compass, ShoppingBag, Crosshair, Layers } from 'lucide-react'
import type { ChecklistState } from '@/lib/weekly-checklist'

type SingleKey = 'teshin' | 'palladino' | 'clem' | 'maroo' | 'calendar1999' | 'circuitNormal' | 'circuitSP'
type MultiKey = 'netracells' | 'kahl' | 'descendia'

export default function WeeklyAgenda({ state, resetTimer, mood, normalRotation, steelRotation, onSingle, onMulti }: {
  state: ChecklistState
  resetTimer: string
  mood: string
  normalRotation: string
  steelRotation: string
  onSingle: (key: SingleKey) => void
  onMulti: (key: MultiKey, index: number) => void
}) {
  const singleKeys: SingleKey[] = ['teshin', 'palladino', 'clem', 'maroo', 'calendar1999', 'circuitNormal', 'circuitSP']
  const multiKeys: MultiKey[] = ['netracells', 'kahl', 'descendia']
  const completed = singleKeys.filter(key => state[key]).length + multiKeys.reduce((sum, key) => sum + state[key].filter(Boolean).length, 0)
  const total = singleKeys.length + multiKeys.reduce((sum, key) => sum + state[key].length, 0)

  function task(key: SingleKey, title: string, detail?: string) {
    return <button key={key} className="weekly-task" aria-pressed={state[key]} onClick={() => onSingle(key)}>
      <span className="weekly-check" aria-hidden="true">{state[key] && <Check size={12} />}</span>
      <span className="weekly-task-copy"><strong>{title}</strong>{detail && <small>{detail}</small>}</span>
    </button>
  }

  return <div className="weekly-agenda">
    <div className="weekly-reset-summary">
      <span className="weekly-eyebrow"><Clock size={11} />NEXT CHECKLIST RESET</span>
      <strong>{resetTimer || 'Calculating…'}</strong>
      <div><span>Monday · 00:00 UTC</span><span>{completed}<small> / {total} done</small></span></div>
      <div className="weekly-completion" role="progressbar" aria-label="Weekly checklist completion" aria-valuenow={completed} aria-valuemin={0} aria-valuemax={total}><span style={{ width: `${completed / total * 100}%` }} /></div>
    </div>

    <div className="weekly-spiral" data-mood={mood.toLowerCase()}><Compass size={17} /><div><span className="weekly-eyebrow">DUVIRI SPIRAL</span><strong>{mood}</strong></div><svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 5c11 0 19 8 19 19S35 43 24 43 5 35 5 24 13 5 24 5Zm0 7c7 0 12 5 12 12s-5 12-12 12-12-5-12-12 5-12 12-12Zm0 7c3 0 5 2 5 5s-2 5-5 5-5-2-5-5 2-5 5-5Z" /><path d="m24 1 4 7-4 7-4-7Zm0 32 4 7-4 7-4-7" /></svg></div>

    <div className="weekly-agenda-list custom-scrollbar">
      <section className="weekly-group"><h3><ShoppingBag size={12} />Honor vendors<span>{Number(state.teshin) + Number(state.palladino)} / 2</span></h3>
        {task('teshin', 'Steel Path Honors', 'Teshin · 50,000× Kuva')}
        {task('palladino', 'Iron Wake', 'Palladino · Riven Mods / Kuva')}
      </section>
      <section className="weekly-group"><h3><Crosshair size={12} />Weekly missions<span>{Number(state.clem) + Number(state.maroo) + Number(state.calendar1999)} / 3</span></h3>
        {task('clem', 'Help Clem')}{task('maroo', 'Ayatan Treasure Hunt')}{task('calendar1999', '1999 Calendar')}
      </section>
      <section className="weekly-group"><h3><Layers size={12} />Circuit rotations<span>{Number(state.circuitNormal) + Number(state.circuitSP)} / 2</span></h3>
        {task('circuitNormal', 'Normal Circuit', normalRotation)}{task('circuitSP', 'Steel Path Circuit', steelRotation)}
      </section>
      <section className="weekly-group"><h3><Crosshair size={12} />Repeatable objectives</h3>
        {multiKeys.map(key => {
          const title = { netracells: 'Netracells', kahl: 'Break Narmer', descendia: 'Descendia' }[key]
          return <div key={key} className="weekly-repeat"><div><strong>{title}</strong><span>{state[key].filter(Boolean).length} / {state[key].length}</span></div><div className="weekly-slots">{state[key].map((checked, index) => <button key={index} aria-label={`${title} ${index + 1}`} aria-pressed={checked} onClick={() => onMulti(key, index)}>{checked ? <Check size={13} /> : index + 1}</button>)}</div></div>
        })}
      </section>
    </div>
    <p className="weekly-save-note">Checkmarks saved on this device</p>
  </div>
}
