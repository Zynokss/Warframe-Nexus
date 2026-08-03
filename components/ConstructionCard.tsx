'use client'

import { Hammer, AlertTriangle } from 'lucide-react'

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

  const fomorianFormatted = fomorianVal.toFixed(2)
  const razorbackFormatted = razorbackVal.toFixed(2)

  // SVG Circular Gauge calculations
  const radius = 30
  const circumference = 2 * Math.PI * radius
  const fomorianOffset = circumference - (fomorianVal / 100) * circumference
  const razorbackOffset = circumference - (razorbackVal / 100) * circumference

  return (
    <div className="bg-[#090a0e] border border-amber-900/30 rounded-xl p-4 space-y-4 font-mono shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300 h-fit">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-red-600/40 via-amber-500/40 to-sky-500/40 opacity-80" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
        <h2 className="text-xs font-bold text-amber-400/90 tracking-[0.2em] uppercase flex items-center gap-2 drop-shadow">
          <Hammer className="w-4 h-4 text-amber-500" />
          <span>CONSTRUCTION PROGRESS</span>
        </h2>

        {(fomorianVal >= 100 || razorbackVal >= 100) && (
          <span className="bg-red-950/60 text-red-400 text-[9px] font-black px-2 py-0.5 rounded border border-red-800/60 animate-pulse flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            ATTACK IMMINENT
          </span>
        )}
      </div>

      {/* Gauges Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Fomorian Gauge */}
        <div className="bg-[#0d0e14] p-3 rounded-xl border border-zinc-800/80 hover:border-red-500/40 transition flex flex-col items-center justify-center space-y-2 relative">
          <div className="relative w-22 h-22 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 72 72">
              <circle
                cx="36"
                cy="36"
                r={radius}
                stroke="currentColor"
                strokeWidth="5.5"
                className="text-zinc-900"
                fill="transparent"
              />
              <circle
                cx="36"
                cy="36"
                r={radius}
                stroke="currentColor"
                strokeWidth="5.5"
                strokeDasharray={circumference}
                strokeDashoffset={fomorianOffset}
                strokeLinecap="round"
                className="text-red-500 transition-all duration-700 ease-out"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xs font-black text-red-400 drop-shadow">
                {fomorianFormatted}%
              </span>
            </div>
          </div>

          <div className="text-center space-y-0.5">
            <span className="text-[10px] font-extrabold text-red-400/90 tracking-wider uppercase block">
              FOMORIAN
            </span>
            <span className="text-[9px] text-zinc-500 font-semibold block">GRINEER FLEET</span>
          </div>
        </div>

        {/* Razorback Gauge */}
        <div className="bg-[#0d0e14] p-3 rounded-xl border border-zinc-800/80 hover:border-sky-500/40 transition flex flex-col items-center justify-center space-y-2 relative">
          <div className="relative w-22 h-22 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 72 72">
              <circle
                cx="36"
                cy="36"
                r={radius}
                stroke="currentColor"
                strokeWidth="5.5"
                className="text-zinc-900"
                fill="transparent"
              />
              <circle
                cx="36"
                cy="36"
                r={radius}
                stroke="currentColor"
                strokeWidth="5.5"
                strokeDasharray={circumference}
                strokeDashoffset={razorbackOffset}
                strokeLinecap="round"
                className="text-sky-400 transition-all duration-700 ease-out"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xs font-black text-sky-400 drop-shadow">
                {razorbackFormatted}%
              </span>
            </div>
          </div>

          <div className="text-center space-y-0.5">
            <span className="text-[10px] font-extrabold text-sky-400/90 tracking-wider uppercase block">
              RAZORBACK
            </span>
            <span className="text-[9px] text-zinc-500 font-semibold block">CORPUS ARMADA</span>
          </div>
        </div>
      </div>
    </div>
  )
}