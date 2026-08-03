'use client'

import { useState } from 'react'
import { Flame, Clock, Sparkles } from 'lucide-react'
import { Fissure } from '@/types/warframe'

interface FissuresCardProps {
  fissures?: (Fissure & { timeLeft?: string; imageName?: string })[]
}

type FilterMode = 'ALL' | 'NORMAL' | 'STEEL_PATH'

export default function FissuresCard({ fissures = [] }: FissuresCardProps) {
  const [filter, setFilter] = useState<FilterMode>('ALL')

  // Filter out Railjack Void Storms
  const baseFissures = fissures.filter((f) => !f.isStorm)

  // Apply Normal vs Steel Path filter
  const filteredFissures = baseFissures.filter((f) => {
    if (filter === 'STEEL_PATH') return f.isHard
    if (filter === 'NORMAL') return !f.isHard
    return true
  })

  // Helper for Tier Badge Accent Colors
  const getTierColor = (tier: string) => {
    switch (tier?.toUpperCase()) {
      case 'LITH': return 'text-amber-300 border-amber-500/60 bg-amber-950/40'
      case 'MESO': return 'text-cyan-300 border-cyan-500/60 bg-cyan-950/40'
      case 'NEO': return 'text-yellow-300 border-yellow-500/60 bg-yellow-950/40'
      case 'AXI': return 'text-red-300 border-red-500/60 bg-red-950/40'
      case 'REQUIEM': return 'text-purple-300 border-purple-500/60 bg-purple-950/40'
      case 'OMNIA': return 'text-emerald-300 border-emerald-500/60 bg-emerald-950/40'
      default: return 'text-zinc-300 border-zinc-600 bg-zinc-900/40'
    }
  }

  // Authentic In-Game Relic Target Ring Icon (Left)
  const renderRelicTargetIcon = (tier: string) => {
    const letter = tier?.charAt(0).toUpperCase() || 'V'
    return (
      <div className="w-12 h-12 rounded-full border border-zinc-600/80 bg-zinc-950/90 flex items-center justify-center shrink-0 relative shadow-inner">
        {/* Rotating outer reticle ticks */}
        <div className="absolute inset-0 rounded-full border border-dashed border-zinc-400/40 animate-[spin_30s_linear_infinite]" />
        
        {/* North/South/East/West Reticle Pointers */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white clip-triangle" />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white clip-triangle rotate-180" />

        {/* Tier Letter */}
        <span className="font-mono font-black text-sm text-white tracking-widest z-10 drop-shadow">
          {letter}
        </span>
      </div>
    )
  }

  // Authentic In-Game Faction / Mission Emblem Icon (Right)
  const renderFactionEmblem = (enemy: string) => {
    const e = (enemy || '').toLowerCase()
    
    if (e.includes('grineer')) {
      return (
        <div className="w-12 h-12 rounded-xl bg-red-950/30 border border-red-900/50 flex items-center justify-center shrink-0 p-2 shadow-inner group-hover/row:border-red-500/50 transition">
          {/* Grineer Chevron / Triangle Emblem */}
          <svg viewBox="0 0 24 24" className="w-full h-full text-red-500 filter drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]" fill="currentColor">
            <path d="M12 2L2 22h20L12 2zm0 4l7.5 14h-15L12 6z" opacity="0.3" />
            <path d="M12 8l5 10H7l5-10zm0-3l-7 14h14l-7-14z" />
            <rect x="10" y="11" width="4" height="4" />
          </svg>
        </div>
      )
    }
    if (e.includes('corpus')) {
      return (
        <div className="w-12 h-12 rounded-xl bg-cyan-950/30 border border-cyan-900/50 flex items-center justify-center shrink-0 p-2 shadow-inner group-hover/row:border-cyan-500/50 transition">
          {/* Corpus Circular Target Emblem */}
          <svg viewBox="0 0 24 24" className="w-full h-full text-cyan-400 filter drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="5" />
            <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
          </svg>
        </div>
      )
    }
    if (e.includes('infest')) {
      return (
        <div className="w-12 h-12 rounded-xl bg-emerald-950/30 border border-emerald-900/50 flex items-center justify-center shrink-0 p-2 shadow-inner group-hover/row:border-emerald-500/50 transition">
          {/* Infested Organic Emblem */}
          <svg viewBox="0 0 24 24" className="w-full h-full text-emerald-400 filter drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]" fill="currentColor">
            <path d="M12 2L4 18h16L12 2zm0 5l4.5 9h-9L12 7z" />
            <circle cx="12" cy="14" r="2" fill="#0b0c12" />
          </svg>
        </div>
      )
    }
    // Corrupted / Void Emblem
    return (
      <div className="w-12 h-12 rounded-xl bg-amber-950/30 border border-amber-900/50 flex items-center justify-center shrink-0 p-2 shadow-inner group-hover/row:border-amber-500/50 transition">
        <svg viewBox="0 0 24 24" className="w-full h-full text-amber-400 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
    )
  }

  const getTimeLeft = (fissure: Fissure & { timeLeft?: string }) => {
    if (fissure.eta) return fissure.eta
    if (fissure.timeLeft) return fissure.timeLeft

    if (fissure.expiry) {
      const diff = new Date(fissure.expiry).getTime() - Date.now()
      if (diff <= 0) return 'Expired'

      const mins = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(mins / 60)
      const remainingMins = mins % 60

      if (hours > 0) return `${hours}h ${remainingMins}m`
      return `${remainingMins}m`
    }

    return '--:--'
  }

  return (
    <div className="bg-[#0b0c12] border border-[#232636] hover:border-amber-500/50 rounded-2xl p-3.5 md:p-4 font-sans shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-between">
      
      {/* Background Nebula & Starfield */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] bg-amber-500/15 blur-[100px] rounded-full transition-all duration-700 opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#ffffff60,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_120px_160px,#ffffff80,rgba(0,0,0,0)),radial-gradient(1px_1px_at_240px_90px,#ffffff50,rgba(0,0,0,0)),radial-gradient(2px_2px_at_330px_210px,#ffffff90,rgba(0,0,0,0))] opacity-80 animate-pulse" />
      </div>

      {/* Header & Sorting Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          <h2 className="text-xs font-black text-amber-400 uppercase tracking-widest">
            Void Fissures
          </h2>
        </div>

        <div className="flex items-center bg-[#12131c]/85 backdrop-blur-md p-1 rounded-xl border border-[#232636] text-[10px]">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2 py-0.5 rounded-lg transition font-mono font-bold cursor-pointer ${
              filter === 'ALL' ? 'bg-amber-500 text-zinc-950 shadow-md font-extrabold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => setFilter('NORMAL')}
            className={`px-2 py-0.5 rounded-lg transition font-mono font-bold cursor-pointer ${
              filter === 'NORMAL' ? 'bg-zinc-200 text-zinc-950 shadow-md font-extrabold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            NORMAL
          </button>
          <button
            onClick={() => setFilter('STEEL_PATH')}
            className={`px-2 py-0.5 rounded-lg transition font-mono font-bold cursor-pointer ${
              filter === 'STEEL_PATH' ? 'bg-red-500 text-zinc-950 shadow-md font-extrabold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            SP
          </button>
        </div>
      </div>

      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent my-1" />

      {/* Mission Cards List */}
      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar relative z-10 my-1">
        {filteredFissures.length === 0 ? (
          <p className="text-xs text-zinc-400 py-6 text-center font-medium">
            {filter === 'STEEL_PATH' ? 'No active Steel Path fissures.' : 'No active Void Fissures.'}
          </p>
        ) : (
          filteredFissures.map((fissure, idx) => {
            const isExpired = getTimeLeft(fissure) === 'Expired'

            return (
              <div
                key={fissure.id || `fissure-${idx}`}
                className="bg-[#12131c]/80 backdrop-blur-md p-3 rounded-xl border border-[#232636] hover:border-zinc-500 transition flex items-center justify-between gap-3 group/row shadow-sm relative overflow-hidden"
              >
                {/* Left Side: Relic Target Ring Icon & Mission Data */}
                <div className="flex items-center gap-3 min-w-0">
                  {renderRelicTargetIcon(fissure.tier)}

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-zinc-100 uppercase tracking-wide truncate">
                        {fissure.missionType}
                      </span>
                      {fissure.isHard && (
                        <span className="text-[9px] font-mono font-extrabold text-red-300 bg-red-950/80 px-1.5 py-0.2 rounded border border-red-700/60 shrink-0">
                          SP
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] font-mono font-bold text-amber-300/90 tracking-wide uppercase">
                      {fissure.tier} Fissure
                    </div>

                    <div className="text-[11px] text-zinc-300 font-medium truncate">
                      {fissure.node}
                    </div>

                    <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1 pt-0.5">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span className={isExpired ? 'text-red-400 font-bold' : ''}>
                        {getTimeLeft(fissure)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Authentic Faction Emblem */}
                {renderFactionEmblem(fissure.enemy)}
              </div>
            )
          })
        )}
      </div>

      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent mt-1 mb-1.5" />

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 relative z-10 px-1">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Void Fissure Stream
        </span>
        <span className="font-bold text-zinc-300">{filteredFissures.length} Active Nodes</span>
      </div>

    </div>
  )
}