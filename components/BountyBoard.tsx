import { Crosshair, Award, Layers } from 'lucide-react'
import { TelemetryEmpty, ReportSummary } from '@/components/TelemetryPrimitives'

interface BoardJob { id?: string; type?: string; enemyLevels?: number[]; rewardPool?: string[]; standingStages?: number[]; minMR?: number }
export default function BountyBoard({ hub, jobs, timer }: { hub: string; jobs: BoardJob[]; timer: string }) {
  return <div className="intel-view bounty-board"><ReportSummary label="Syndicate contracts" title={hub} value={timer} />
    <div className="intel-scroll custom-scrollbar">{!jobs.length ? <TelemetryEmpty message={`No active bounty telemetry for ${hub}.`} /> : jobs.map((job, index) => <article key={job.id || index} className="bounty-contract"><div className="bounty-contract-icon"><Crosshair size={21} aria-hidden="true" /><small>0{index + 1}</small></div><div className="bounty-contract-copy"><h4>{job.type || 'Syndicate Bounty'}</h4><div className="bounty-tags"><span>{job.enemyLevels?.[1] ? `Level ${job.enemyLevels[0] ?? 0}–${job.enemyLevels[1]}` : 'Standard'}</span>{!!job.minMR && <span>MR {job.minMR}+</span>}{!!job.standingStages?.length && <span><Award size={10} />{job.standingStages.reduce((a, b) => a + b, 0).toLocaleString()} standing</span>}</div>{!!job.rewardPool?.length && <p className="bounty-rewards"><Layers size={11} /><span>{job.rewardPool.slice(0, 3).join(' · ')}</span></p>}</div></article>)}</div>
  </div>
}
