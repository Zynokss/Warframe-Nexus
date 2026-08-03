'use client'

import { useState } from 'react'
import { Swords, Clock, Sparkles, Shield, Cpu, Skull, Disc } from 'lucide-react'
import { Invasion } from '@/types/warframe'

interface InvasionsCardProps {
  invasions?: Invasion[]
}

export default function InvasionsCard({ invasions = [] }: InvasionsCardProps) {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})
  const activeInvasions = invasions.filter((i) => !i.completed)

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }))
  }

  // Dynamic bar colors based on the exact faction name
  const getFactionBarColor = (faction?: string) => {
    const f = faction?.toLowerCase() || ''
    if (f.includes('grineer')) return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
    if (f.includes('corpus')) return 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
    if (f.includes('infested') || f.includes('infestation') || f.includes('phorid'))
      return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
    if (f.includes('corrupted') || f.includes('void') || f.includes('orokin'))
      return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
    if (f.includes('sentient')) return 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]'
    if (f.includes('narmer')) return 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]'
    return 'bg-zinc-500'
  }

  // Dynamic text colors based on the exact faction name
  const getFactionTextColor = (faction?: string) => {
    const f = faction?.toLowerCase() || ''
    if (f.includes('grineer')) return 'text-red-400'
    if (f.includes('corpus')) return 'text-cyan-300'
    if (f.includes('infested') || f.includes('infestation') || f.includes('phorid'))
      return 'text-emerald-400'
    if (f.includes('corrupted') || f.includes('void') || f.includes('orokin'))
      return 'text-amber-400'
    if (f.includes('sentient')) return 'text-purple-400'
    if (f.includes('narmer')) return 'text-orange-400'
    return 'text-zinc-400'
  }

  // Render official WFCD faction emblem with vector fallback
  const renderFactionEmblem = (faction?: string, key?: string) => {
    const f = (faction || 'grineer').toLowerCase().trim()
    const isFailed = failedImages[`invasion-fac-${key}`]
    const factionIconUrl = `https://wfcd.github.io/warframe-assets/svg/factions/${f}.svg`

    if (!isFailed) {
      return (
        <img
          src={factionIconUrl}
          alt={faction || 'Faction'}
          className="w-4 h-4 object-contain filter drop-shadow brightness-125 opacity-90 inline-block"
          onError={() => handleImageError(`invasion-fac-${key}`)}
        />
      )
    }

    if (f.includes('grineer')) return <Shield className="w-3.5 h-3.5 text-red-500 inline-block" />
    if (f.includes('corpus')) return <Cpu className="w-3.5 h-3.5 text-cyan-400 inline-block" />
    if (f.includes('infest')) return <Skull className="w-3.5 h-3.5 text-emerald-400 inline-block" />
    return <Disc className="w-3.5 h-3.5 text-amber-400 inline-block" />
  }

  return (
    <div className="bg-[#0b0c12] border border-[#232636] hover:border-red-500/50 rounded-2xl p-3.5 md:p-4 font-sans shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-between">
      
      {/* Full-Card Foggy Nebula & Starfield Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] bg-red-600/15 blur-[100px] rounded-full transition-all duration-700 opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#ffffff60,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_120px_160px,#ffffff80,rgba(0,0,0,0)),radial-gradient(1px_1px_at_240px_90px,#ffffff50,rgba(0,0,0,0)),radial-gradient(2px_2px_at_330px_210px,#ffffff90,rgba(0,0,0,0))] opacity-80 animate-pulse" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 relative z-10">
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-red-500 animate-pulse" />
          <h2 className="text-xs font-black text-red-400 uppercase tracking-widest">
            Invasions
          </h2>
        </div>

        <span className="bg-red-950/70 text-red-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-red-700/60 shadow-inner flex items-center gap-1">
          <Clock className="w-3 h-3 text-red-400" />
          {activeInvasions.length} Active
        </span>
      </div>

      {/* Soft Fading Divider Line (Top) */}
      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent my-1" />

      {/* List */}
      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar relative z-10 my-1">
        {activeInvasions.length === 0 ? (
          <p className="text-xs text-zinc-400 py-6 text-center font-medium">
            No active Invasions telemetry.
          </p>
        ) : (
          activeInvasions.map((invasion, idx) => {
            const attackingFaction = invasion.attackingFaction || 'Infested'
            const defendingFaction = invasion.defendingFaction || 'Corpus'
            const invKey = invasion.id || `invasion-${idx}`

            // Tug of war percentage
            const defenderPercent = Math.max(0, Math.min(100, Math.round(invasion.completion || 50)))
            const attackerPercent = 100 - defenderPercent

            const attackerReward =
              invasion.attackerReward?.asString ||
              invasion.attackerReward?.itemString ||
              invasion.attacker?.asString ||
              ''

            const defenderReward =
              invasion.defenderReward?.asString ||
              invasion.defenderReward?.itemString ||
              invasion.defender?.asString ||
              ''

            return (
              <div
                key={invKey}
                className="bg-[#12131c]/80 backdrop-blur-md p-3 rounded-xl border border-[#232636] hover:border-zinc-500 transition space-y-2 shadow-sm relative overflow-hidden"
              >
                {/* Top Line: Node & Outbreak/Siege Description */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-zinc-100 uppercase tracking-wide truncate">
                    {invasion.node}: <span className="text-amber-300 font-bold">{invasion.desc || 'Invasion Conflict'}</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono shrink-0 pl-2">
                    {invasion.eta || 'Active'}
                  </span>
                </div>

                {/* Conflict Progress Bar */}
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden flex border border-zinc-800 shadow-inner">
                  <div
                    className={`h-full transition-all duration-500 ${getFactionBarColor(attackingFaction)}`}
                    style={{ width: `${attackerPercent}%` }}
                  />
                  <div
                    className={`h-full transition-all duration-500 ${getFactionBarColor(defendingFaction)}`}
                    style={{ width: `${defenderPercent}%` }}
                  />
                </div>

                {/* Faction Percentages & Logos */}
                <div className="flex items-center justify-between text-[11px] font-mono font-bold pt-0.5">
                  <div className="flex items-center gap-1.5 truncate">
                    {renderFactionEmblem(attackingFaction, `${invKey}-att`)}
                    <span className={getFactionTextColor(attackingFaction)}>
                      {attackingFaction.toUpperCase()} {attackerPercent.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 truncate">
                    <span className={getFactionTextColor(defendingFaction)}>
                      {defenderPercent.toFixed(1)}% {defendingFaction.toUpperCase()}
                    </span>
                    {renderFactionEmblem(defendingFaction, `${invKey}-def`)}
                  </div>
                </div>

                {/* Optional Battle Pay Rewards Footer */}
                {(attackerReward || defenderReward) && (
                  <div className="flex items-center justify-between text-[10px] font-mono pt-1.5 border-t border-zinc-800/60 text-zinc-400">
                    <span className="truncate max-w-[48%] text-amber-300/90" title={attackerReward}>
                      🎁 {attackerReward}
                    </span>
                    <span className="truncate max-w-[48%] text-right text-cyan-300/90" title={defenderReward}>
                      {defenderReward} 🎁
                    </span>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Soft Fading Divider Line (Bottom) */}
      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent mt-1 mb-1.5" />

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 relative z-10 px-1">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-red-400" /> Star Chart Warfront
        </span>
        <span className="font-bold text-zinc-300">{activeInvasions.length} Active Conflicts</span>
      </div>

    </div>
  )
}