'use client'

import { ReactNode } from 'react'

interface WarframeCardProps {
  title: string
  timer?: string
  icon?: ReactNode
  children: ReactNode
}

export default function WarframeCard({ title, timer, icon, children }: WarframeCardProps) {
  return (
    <div className="nexus-panel bg-[#090a0d]/90 border border-zinc-800/80 rounded-xl p-4 space-y-3 font-mono shadow-2xl relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300 backdrop-blur-md">
      {/* Subtle Top Gold Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2.5">
        <h2 className="text-xs font-bold text-amber-400/90 tracking-[0.2em] uppercase flex items-center gap-2 drop-shadow-sm">
          {icon}
          <span>{title}</span>
        </h2>

        {timer && (
          <span className="bg-amber-950/40 text-amber-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-amber-800/50 shadow-inner">
            {timer}
          </span>
        )}
      </div>

      {/* Card Content Body */}
      <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
        {children}
      </div>
    </div>
  )
}
