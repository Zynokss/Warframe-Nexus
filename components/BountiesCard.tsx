'use client'

import BountyBoard from '@/components/BountyBoard'
import CardEmblem from '@/components/CardEmblem'
import { useState } from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { SyndicateMission } from '@/types/warframe';

type BountiesCardProps = {
  syndicateMissions?: (SyndicateMission & {
    id?: string
    eta?: string
    expiry?: string
    jobs?: Array<{
      id?: string
      rewardPool?: string[]
      type?: string
      enemyLevels?: number[]
      standingStages?: number[]
      minMR?: number
    }>
  })[]
}

type SyndicateKey = 'cetus' | 'fortuna' | 'deimos' | 'cavia'

const SYNDICATE_MAP: Record<
  SyndicateKey,
  {
    name: string
    shortName: string
    keyName: string
    accentText: string
    accentBg: string
    accentBorder: string
    glowBg: string
    pillStyle: string
  }
> = {
  cetus: {
    name: 'Cetus (Ostron)',
    shortName: 'Cetus',
    keyName: 'Ostrons',
    accentText: 'text-amber-400',
    accentBg: 'bg-amber-500',
    accentBorder: 'border-amber-500/50',
    glowBg: 'bg-amber-500/20',
    pillStyle: 'bg-amber-950/70 border-amber-700/60 text-amber-300',
  },
  fortuna: {
    name: 'Fortuna (Solaris)',
    shortName: 'Fortuna',
    keyName: 'Solaris United',
    accentText: 'text-cyan-400',
    accentBg: 'bg-cyan-500',
    accentBorder: 'border-cyan-500/50',
    glowBg: 'bg-cyan-500/20',
    pillStyle: 'bg-cyan-950/70 border-cyan-700/60 text-cyan-300',
  },
  deimos: {
    name: 'Necralisk (Entrati)',
    shortName: 'Deimos',
    keyName: 'Entrati',
    accentText: 'text-orange-400',
    accentBg: 'bg-orange-500',
    accentBorder: 'border-orange-500/50',
    glowBg: 'bg-orange-500/20',
    pillStyle: 'bg-orange-950/70 border-orange-700/60 text-orange-300',
  },
  cavia: {
    name: 'Sanctum (Cavia)',
    shortName: 'Cavia',
    keyName: 'Cavia',
    accentText: 'text-purple-400',
    accentBg: 'bg-purple-500',
    accentBorder: 'border-purple-500/50',
    glowBg: 'bg-purple-500/20',
    pillStyle: 'bg-purple-950/70 border-purple-700/60 text-purple-300',
  },
}

export default function BountiesCard({ syndicateMissions = [] }: BountiesCardProps) {
  const [activeTab, setActiveTab] = useState<SyndicateKey>('cetus')
  const currentHub = SYNDICATE_MAP[activeTab]

  // Helper function to resolve active syndicate mission
  const activeMission = syndicateMissions.find((m) => {
    const targetName = currentHub.keyName.toLowerCase()
    const syndicateName = (m.syndicate || m.id || '').toLowerCase()
    return syndicateName.includes(targetName)
  })

  // Safe time remaining calculation
  const getTimeLeft = (expiry?: string, eta?: string) => {
    if (eta) return eta

    if (expiry) {
      const diff = new Date(expiry).getTime() - Date.now()
      if (diff <= 0) return 'Expired'

      const totalMins = Math.floor(diff / (1000 * 60))
      const totalHours = Math.floor(totalMins / 60)
      const days = Math.floor(totalHours / 24)
      const hours = totalHours % 24
      const mins = totalMins % 60

      if (days > 0) return `${days}d ${hours}h`
      if (hours > 0) return `${hours}h ${mins}m`
      return `${mins}m`
    }

    return '--:--'
  }

  const jobs = activeMission?.jobs || []

  return (
    <div data-card="bounties" className={`nexus-panel bg-[#0b0c12] border border-[#232636] hover:${currentHub.accentBorder} rounded-2xl p-3.5 md:p-4 font-sans shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-between`}>

      {/* Full-Card Foggy Nebula & Starfield Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] ${currentHub.glowBg} blur-[100px] rounded-full transition-all duration-700 opacity-80`} />
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#ffffff60,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_120px_160px,#ffffff80,rgba(0,0,0,0)),radial-gradient(1px_1px_at_240px_90px,#ffffff50,rgba(0,0,0,0)),radial-gradient(2px_2px_at_330px_210px,#ffffff90,rgba(0,0,0,0))] opacity-80 animate-pulse" />
      </div>

      {/* Header & Expiry */}
      <div className="nexus-card-header flex items-center justify-between pb-2.5 relative z-10">
        <div className="flex items-center gap-2">
          <CardEmblem kind="bounties" />
          <h2 className={`text-xs font-black uppercase tracking-widest ${currentHub.accentText}`}>
            Open World Bounties
          </h2>
        </div>

        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border shadow-inner flex items-center gap-1 ${currentHub.pillStyle}`}>
          <Clock className="w-3 h-3" />
          {getTimeLeft(activeMission?.expiry, activeMission?.eta)}
        </span>
      </div>

      {/* Syndicate Selector Tabs */}
      <div className="nexus-selector grid grid-cols-4 gap-1.5 bg-[#12131c]/70 backdrop-blur-md p-1 rounded-xl border border-[#232636] text-[10px] relative z-10 mb-2">
        {(Object.keys(SYNDICATE_MAP) as SyndicateKey[]).map((key) => {
          const isActive = activeTab === key
          const info = SYNDICATE_MAP[key]
          return (
            <button
              key={key}
              aria-pressed={isActive}
              onClick={() => setActiveTab(key)}
              className={`py-1 rounded-lg font-bold transition text-center truncate cursor-pointer ${
                isActive
                  ? `${info.accentBg} text-zinc-950 shadow-md font-extrabold`
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {info.shortName}
            </button>
          )
        })}
      </div>

      {/* Soft Fading Divider Line (Top) */}
      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent my-1" />

      <BountyBoard hub={currentHub.name} jobs={jobs} timer={getTimeLeft(activeMission?.expiry, activeMission?.eta)} />

      {/* Soft Fading Divider Line (Bottom) */}
      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent mt-1 mb-2" />

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 relative z-10 px-1">
        <span className="flex items-center gap-1">
          <Sparkles className={`w-3 h-3 ${currentHub.accentText}`} /> Hub Active
        </span>
        <span className="font-bold text-zinc-300">{jobs.length} Bounties Available</span>
      </div>

    </div>
  )
}
