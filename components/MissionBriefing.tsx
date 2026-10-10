import { MapPin, ShieldAlert, Zap } from 'lucide-react'
import type { ArchimedeaModifier } from '@/types/warframe'
import { TelemetryEmpty, ReportSummary } from '@/components/TelemetryPrimitives'

interface BriefingMission { missionType?: string; type?: string; name?: string; title?: string; node?: string; modifier?: string; modifierDescription?: string; modifiers?: ArchimedeaModifier[]; deviation?: ArchimedeaModifier; risks?: ArchimedeaModifier[]; faction?: string }

export default function MissionBriefing({ mode, title, faction, missions = [], reset, personalModifiers = [] }: {
  mode: string; title: string; faction?: string; missions?: BriefingMission[]; reset: string; personalModifiers?: ArchimedeaModifier[]
}) {
  return <div className="intel-view mission-briefing" data-mode={mode}>
    <ReportSummary label={mode === 'SORTIE' ? 'Daily operation' : 'Weekly operation'} title={title} detail={faction} value={`${missions.length} missions`} />
    <div className="intel-scroll custom-scrollbar">
      {!missions.length ? <TelemetryEmpty message="Mission details will appear when telemetry is available." /> : missions.map((mission, index) => <article className="briefing-stage" key={index}>
        <span className="briefing-stage-number">0{index + 1}</span><div><h4>{mission.missionType || mission.type || mission.name || mission.title || 'Mission'}</h4>{mission.node && <p className="intel-location"><MapPin size={11} />{mission.node}</p>}
          {(mission.modifier || mission.modifierDescription) && <p className="briefing-modifier"><Zap size={11} />{mission.modifier || mission.modifierDescription}</p>}
          {mission.deviation && <p className="briefing-modifier" title={mission.deviation.description}><Zap size={11} />Deviation: {mission.deviation.name}</p>}
          {mission.risks?.map((risk, i) => <p className="briefing-modifier" key={`risk-${i}`} title={risk.description}><ShieldAlert size={11} />{risk.isHard ? 'Elite risk' : 'Risk'}: {risk.name}</p>)}
          {mission.modifiers?.map((modifier, i) => <p className="briefing-modifier" key={i} title={modifier.description}><ShieldAlert size={11} />{modifier.name}</p>)}
        </div>
      </article>)}
      {!!personalModifiers.length && <section className="briefing-personal"><h4 className="intel-kicker">Personal modifiers</h4>{personalModifiers.map((modifier, i) => <p className="briefing-modifier" key={i} title={modifier.description}><ShieldAlert size={11} />{modifier.name}</p>)}</section>}
    </div>
    <div className="intel-footnote"><span>{mode === 'SORTIE' ? 'Daily refresh' : 'Weekly refresh'}</span><strong>{reset}</strong></div>
  </div>
}
