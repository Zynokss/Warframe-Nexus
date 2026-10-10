'use client'

import Navbar from '@/components/Navbar'
import { Calendar, ShieldAlert, Award } from 'lucide-react'

interface ArbitrationNode {
  time: string
  node: string
  planet: string
  type: string
  faction: string
  tier: 'S Tier' | 'A Tier' | 'B Tier' | 'C Tier'
}

const SCHEDULE_PREDICTIONS: ArbitrationNode[] = [
  { time: 'Current', node: 'Stephano', planet: 'Uranus', type: 'Defense', faction: 'Grineer', tier: 'C Tier' },
  { time: '+1 Hour', node: 'Sechura', planet: 'Pluto', type: 'Defense', faction: 'Infested', tier: 'S Tier' },
  { time: '+2 Hours', node: 'Apollo', planet: 'Lua', type: 'Disruption', faction: 'Corpus', tier: 'S Tier' },
  { time: '+3 Hours', node: 'Tycho', planet: 'Lua', type: 'Survival', faction: 'Corpus', tier: 'A Tier' },
  { time: '+4 Hours', node: 'Akkad', planet: 'Eris', type: 'Defense', faction: 'Infested', tier: 'A Tier' },
  { time: '+5 Hours', node: 'Caelus', planet: 'Uranus', type: 'Interception', faction: 'Grineer', tier: 'B Tier' },
]

export default function ArbitrationPage() {
  return (
    <div className="nexus-page nexus-utility min-h-screen bg-[#07070a] text-zinc-100 font-mono">
      <Navbar />

      <main className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wider uppercase flex items-center gap-2">
            <Calendar className="w-6 h-6 text-red-500" /> Arbitration Rotation Schedule
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Predicted upcoming Arbitration mission rotations and Vitus Essence efficiency tiers.
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SCHEDULE_PREDICTIONS.map((item, idx) => (
              <div
                key={idx}
                className="bg-zinc-950/80 border border-zinc-800/80 p-3 rounded flex items-center justify-between hover:border-zinc-700 transition"
              >
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase font-bold">{item.time}</div>
                  <div className="font-bold text-sm text-zinc-200 mt-0.5">
                    {item.type} <span className="text-zinc-400 font-normal">@ {item.node} ({item.planet})</span>
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">Faction: {item.faction}</div>
                </div>

                <span
                  className={`px-2 py-1 rounded text-xs font-bold border ${
                    item.tier === 'S Tier'
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                      : item.tier === 'A Tier'
                      ? 'bg-sky-950/80 text-sky-400 border-sky-800/60'
                      : item.tier === 'B Tier'
                      ? 'bg-amber-950/80 text-amber-400 border-amber-800/60'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                  }`}
                >
                  {item.tier}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
