'use client'

import { useState } from 'react'
import { ShieldAlert, Target, Zap, ChevronRight, Skull, Sparkles } from 'lucide-react'
import { Sortie, ArchonHunt, DeepArchimedea } from '@/types/warframe'

interface EndgameCardProps {
  sortie?: Sortie
  archonHunt?: ArchonHunt
  deepArchimedea?: DeepArchimedea
}

type Mode = 'SORTIE' | 'ARCHON' | 'ARCHIMEDEA'

export default function EndgameCard({ sortie, archonHunt, deepArchimedea }: EndgameCardProps) {
  const [activeTab, setActiveTab] = useState<Mode>('SORTIE')

  // Safe time remaining helper
  const getTimeLeft = (eta?: string, expiry?: string) => {
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

  // Dynamic theme styling based on active mode
  const getTheme = () => {
    switch (activeTab) {
      case 'ARCHON':
        return {
          accentText: 'text-amber-400',
          accentBg: 'bg-amber-500',
          accentBorder: 'border-amber-500/50',
          glowBg: 'bg-amber-500/15',
          badgeStyle: 'bg-amber-950/70 border-amber-700/60 text-amber-300',
          tabActive: 'bg-amber-500 text-zinc-950 shadow-md font-extrabold',
        }
      case 'ARCHIMEDEA':
        return {
          accentText: 'text-purple-400',
          accentBg: 'bg-purple-500',
          accentBorder: 'border-purple-500/50',
          glowBg: 'bg-purple-500/15',
          badgeStyle: 'bg-purple-950/70 border-purple-700/60 text-purple-300',
          tabActive: 'bg-purple-500 text-zinc-950 shadow-md font-extrabold',
        }
      default:
        return {
          accentText: 'text-red-400',
          accentBg: 'bg-red-500',
          accentBorder: 'border-red-500/50',
          glowBg: 'bg-red-600/15',
          badgeStyle: 'bg-red-950/70 border-red-700/60 text-red-300',
          tabActive: 'bg-red-500 text-zinc-950 shadow-md font-extrabold',
        }
    }
  }

  const theme = getTheme()

  return (
    <div className={`bg-[#0b0c12] border border-[#232636] hover:${theme.accentBorder} rounded-2xl p-3.5 md:p-4 font-sans shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-between`}>
      
      {/* Full-Card Foggy Nebula & Starfield Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] ${theme.glowBg} blur-[100px] rounded-full transition-all duration-700 opacity-80`} />
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#ffffff60,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_120px_160px,#ffffff80,rgba(0,0,0,0)),radial-gradient(1px_1px_at_240px_90px,#ffffff50,rgba(0,0,0,0)),radial-gradient(2px_2px_at_330px_210px,#ffffff90,rgba(0,0,0,0))] opacity-80 animate-pulse" />
      </div>

      {/* Header & Activity Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <ShieldAlert className={`w-4 h-4 ${theme.accentText} animate-pulse`} />
          <h2 className={`text-xs font-black uppercase tracking-widest ${theme.accentText}`}>
            Tactical Operations
          </h2>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-[#12131c]/80 backdrop-blur-md p-1 rounded-xl border border-[#232636] text-[10px]">
          <button
            onClick={() => setActiveTab('SORTIE')}
            className={`px-2 py-0.5 rounded-lg transition font-mono font-bold cursor-pointer ${
              activeTab === 'SORTIE' ? theme.tabActive : 'text-zinc-400 hover:text-white'
            }`}
          >
            SORTIE
          </button>
          <button
            onClick={() => setActiveTab('ARCHON')}
            className={`px-2 py-0.5 rounded-lg transition font-mono font-bold cursor-pointer ${
              activeTab === 'ARCHON' ? theme.tabActive : 'text-zinc-400 hover:text-white'
            }`}
          >
            ARCHON
          </button>
          {deepArchimedea && (
            <button
              onClick={() => setActiveTab('ARCHIMEDEA')}
              className={`px-2 py-0.5 rounded-lg transition font-mono font-bold cursor-pointer ${
                activeTab === 'ARCHIMEDEA' ? theme.tabActive : 'text-zinc-400 hover:text-white'
              }`}
            >
              DA
            </button>
          )}
        </div>
      </div>

      {/* Soft Fading Divider Line (Top) */}
      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent my-1" />

      {/* Tab 1: Daily Sortie */}
      {activeTab === 'SORTIE' && (
        <div className="space-y-2 relative z-10 my-1">
          <div className="flex items-center justify-between text-xs bg-[#12131c]/80 backdrop-blur-md p-2.5 rounded-xl border border-[#232636] shadow-sm">
            <div className="space-y-0.5 min-w-0">
              <span className="text-[9px] text-red-400 font-mono font-bold uppercase tracking-widest block">
                TARGET BOSS
              </span>
              <span className="font-bold text-zinc-100 flex items-center gap-1.5 truncate">
                <Skull className="w-3.5 h-3.5 text-red-500 shrink-0" />
                {sortie?.boss || 'Unknown Threat'}
              </span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[9px] text-zinc-400 font-mono block font-bold">FACTION</span>
              <span className="text-[11px] font-mono font-bold text-amber-400">{sortie?.faction || 'Grineer'}</span>
            </div>
          </div>

          {/* Missions Checklist */}
          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
            {sortie?.variants?.map((mission: Record<string, any>, idx: number) => {
              const missionName = mission.missionType || mission.type || 'Mission'
              const nodeName = mission.node || ''
              const modifierName = mission.modifier || mission.modifierDescription || ''

              return (
                <div
                  key={`sortie-m-${idx}`}
                  className="bg-[#12131c]/80 backdrop-blur-md p-2.5 rounded-xl border border-[#232636] hover:border-zinc-500 transition space-y-1 shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-100 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-md bg-red-950/80 text-red-300 border border-red-700/60 text-[10px] font-mono flex items-center justify-center font-black shrink-0">
                        {idx + 1}
                      </span>
                      {missionName}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium truncate max-w-[40%]">
                      {nodeName}
                    </span>
                  </div>

                  {modifierName && (
                    <div className="flex items-center gap-1 text-[10px] text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-800/50 font-mono">
                      <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">{modifierName}</span>
                    </div>
                  )}
                </div>
              )
            }) || <p className="text-xs text-zinc-400 py-3 text-center font-medium">No active Sortie telemetry.</p>}
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 pt-1.5 border-t border-zinc-800/60 font-semibold px-1">
            <span>DAILY REFRESH</span>
            <span className="text-red-400 font-bold">{getTimeLeft(sortie?.eta, sortie?.expiry)}</span>
          </div>
        </div>
      )}

      {/* Tab 2: Archon Hunt */}
      {activeTab === 'ARCHON' && (
        <div className="space-y-2 relative z-10 my-1">
          <div className="flex items-center justify-between text-xs bg-[#12131c]/80 backdrop-blur-md p-2.5 rounded-xl border border-[#232636] shadow-sm">
            <div className="space-y-0.5 min-w-0">
              <span className="text-[9px] text-amber-400 font-mono font-bold uppercase tracking-widest block">
                ARCHON TARGET
              </span>
              <span className="font-bold text-zinc-100 flex items-center gap-1.5 truncate">
                <Target className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                {archonHunt?.boss || 'Archon Nira'}
              </span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[9px] text-zinc-400 font-mono block font-bold">FACTION</span>
              <span className="text-[11px] font-mono font-bold text-amber-400">{archonHunt?.faction || 'Narmer'}</span>
            </div>
          </div>

          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
            {archonHunt?.missions?.map((mission: Record<string, any>, idx: number) => {
              const missionName = mission.type || mission.missionType || 'Mission'
              const nodeName = mission.node || ''

              return (
                <div
                  key={`archon-m-${idx}`}
                  className="bg-[#12131c]/80 backdrop-blur-md p-2.5 rounded-xl border border-[#232636] hover:border-zinc-500 transition space-y-1 shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-100 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-md bg-amber-950/80 text-amber-300 border border-amber-700/60 text-[10px] font-mono flex items-center justify-center font-black shrink-0">
                        {idx + 1}
                      </span>
                      {missionName}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium truncate max-w-[40%]">
                      {nodeName}
                    </span>
                  </div>
                </div>
              )
            }) || <p className="text-xs text-zinc-400 py-3 text-center font-medium">No active Archon Hunt telemetry.</p>}
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 pt-1.5 border-t border-zinc-800/60 font-semibold px-1">
            <span>WEEKLY REFRESH</span>
            <span className="text-amber-400 font-bold">{getTimeLeft(archonHunt?.eta, archonHunt?.expiry)}</span>
          </div>
        </div>
      )}

      {/* Tab 3: Deep Archimedea */}
      {activeTab === 'ARCHIMEDEA' && deepArchimedea && (
        <div className="space-y-2 relative z-10 my-1">
          <div className="bg-[#12131c]/80 backdrop-blur-md p-2.5 rounded-xl border border-[#232636] space-y-0.5 shadow-sm">
            <span className="text-[9px] text-purple-400 font-mono font-bold uppercase tracking-widest block">
              ALBRECHT'S LABORATORY
            </span>
            <p className="text-xs font-bold text-zinc-100">Cavia Deep Archimedea Sector</p>
          </div>

          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
            {deepArchimedea.missions?.map((mission: Record<string, any>, idx: number) => {
              const missionName = mission.missionType || mission.type || mission.name || 'Mission'
              const nodeName = mission.node || ''

              return (
                <div
                  key={`da-m-${idx}`}
                  className="bg-[#12131c]/80 backdrop-blur-md p-2 rounded-xl border border-[#232636] hover:border-zinc-500 transition flex items-center justify-between text-xs shadow-sm"
                >
                  <span className="font-bold text-purple-300 flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                    {missionName}
                  </span>
                  {nodeName && <span className="text-[10px] text-zinc-400 font-mono">{nodeName}</span>}
                </div>
              )
            })}
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 pt-1.5 border-t border-zinc-800/60 font-semibold px-1">
            <span>WEEKLY RESET</span>
            <span className="text-purple-400 font-bold">{getTimeLeft(deepArchimedea.eta, deepArchimedea.expiry)}</span>
          </div>
        </div>
      )}

      {/* Soft Fading Divider Line (Bottom) */}
      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent mt-1 mb-1" />

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 relative z-10 px-1">
        <span className="flex items-center gap-1">
          <Sparkles className={`w-3 h-3 ${theme.accentText}`} /> Endgame Operations
        </span>
        <span className="font-bold text-zinc-300">High Threat Protocol</span>
      </div>

    </div>
  )
}