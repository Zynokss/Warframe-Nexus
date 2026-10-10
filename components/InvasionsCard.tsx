'use client'

import InvasionConflict from '@/components/InvasionConflict'
import CardEmblem from '@/components/CardEmblem'

import { Clock, Sparkles } from 'lucide-react';
import { Invasion } from '@/types/warframe';

interface InvasionsCardProps {
  invasions?: Invasion[]
}

export default function InvasionsCard({ invasions = [] }: InvasionsCardProps) {

  const activeInvasions = invasions.filter((i) => !i.completed)

  // Dynamic bar colors based on the exact faction name

  // Dynamic text colors based on the exact faction name

  // Render official WFCD faction emblem with vector fallback

  return (
    <div data-card="invasions" className="nexus-panel bg-[#0b0c12] border border-[#232636] hover:border-red-500/50 rounded-2xl p-3.5 md:p-4 font-sans shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-between">

      {/* Full-Card Foggy Nebula & Starfield Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] bg-red-600/15 blur-[100px] rounded-full transition-all duration-700 opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#ffffff60,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_120px_160px,#ffffff80,rgba(0,0,0,0)),radial-gradient(1px_1px_at_240px_90px,#ffffff50,rgba(0,0,0,0)),radial-gradient(2px_2px_at_330px_210px,#ffffff90,rgba(0,0,0,0))] opacity-80 animate-pulse" />
      </div>

      {/* Header */}
      <div className="nexus-card-header flex items-center justify-between pb-2.5 relative z-10">
        <div className="flex items-center gap-2">
          <CardEmblem kind="invasions" />
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
      <div className="invasion-list space-y-2 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar relative z-10 my-1">
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
            const defenderPercent = Math.max(0, Math.min(100, Math.round(Number.isFinite(invasion.completion) ? invasion.completion : 50)))
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
              <div key={invKey} className="invasion-entry">
                <InvasionConflict node={invasion.node} description={invasion.desc || 'Invasion Conflict'}
                  eta={invasion.eta} attacker={attackingFaction} defender={defendingFaction}
                  attackerPercent={attackerPercent} defenderPercent={defenderPercent}
                  attackerReward={attackerReward} defenderReward={defenderReward} />

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
