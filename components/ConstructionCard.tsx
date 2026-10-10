'use client'

import FleetConstruction from '@/components/FleetConstruction'
import CardEmblem from '@/components/CardEmblem'
import { AlertTriangle } from 'lucide-react';

interface ConstructionCardProps {
  progress?: {
    fomorianProgress?: string
    razorbackProgress?: string
    unknownProgress?: string
  }
}

export default function ConstructionCard({ progress }: ConstructionCardProps) {
  const fomorianVal = Math.min(100, Math.max(0, parseFloat(progress?.fomorianProgress || '0')))
  const razorbackVal = Math.min(100, Math.max(0, parseFloat(progress?.razorbackProgress || '0')))


  return (
    <div data-card="construction" className="nexus-panel bg-[#090a0e] border border-amber-900/30 rounded-xl p-4 space-y-4 font-mono shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300 h-fit">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-red-600/40 via-amber-500/40 to-sky-500/40 opacity-80" />

      {/* Header */}
      <div className="nexus-card-header flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
        <h2 className="text-xs font-bold text-amber-400/90 tracking-[0.2em] uppercase flex items-center gap-2 drop-shadow">
          <CardEmblem kind="construction" />
          <span>CONSTRUCTION PROGRESS</span>
        </h2>

        {(fomorianVal >= 100 || razorbackVal >= 100) && (
          <span className="bg-red-950/60 text-red-400 text-[9px] font-black px-2 py-0.5 rounded border border-red-800/60 animate-pulse flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            ATTACK IMMINENT
          </span>
        )}
      </div>

      <FleetConstruction
        fomorian={fomorianVal} razorback={razorbackVal}
        fomorianAvailable={Number.isFinite(parseFloat(progress?.fomorianProgress || ''))}
        razorbackAvailable={Number.isFinite(parseFloat(progress?.razorbackProgress || ''))} />


    </div>
  )
}
