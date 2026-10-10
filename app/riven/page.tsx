'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Calculator, Sparkles, Search } from 'lucide-react'

interface RivenWeapon {
  name: string
  disposition: number
  type: string
  baseDamage: number
  critChance: number
}

const RIVEN_DATABASE: RivenWeapon[] = [
  { name: 'Nataruk', disposition: 0.6, type: 'Bow', baseDamage: 900, critChance: 50 },
  { name: 'Drakgoon', disposition: 1.35, type: 'Shotgun', baseDamage: 700, critChance: 7.5 },
  { name: 'Torid', disposition: 1.3, type: 'Rifle', baseDamage: 500, critChance: 21 },
  { name: 'Dual Toxocyst', disposition: 1.25, type: 'Pistol', baseDamage: 150, critChance: 15 },
  { name: 'Dual Ichor', disposition: 1.15, type: 'Melee', baseDamage: 210, critChance: 25 },
]

export default function RivenPage() {
  const [search, setSearch] = useState('')
  const [selectedWeapon, setSelectedWeapon] = useState<RivenWeapon>(RIVEN_DATABASE[0])

  const filtered = RIVEN_DATABASE.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="nexus-page nexus-utility min-h-screen bg-[#07070a] text-zinc-100 font-mono">
      <Navbar />

      <main className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wider uppercase flex items-center gap-2">
            <Calculator className="w-6 h-6 text-emerald-400" /> Riven Disposition & Grade Tool
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Calculate theoretical Riven mod stat multipliers based on disposition scaling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search List */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search weapon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 w-full"
              />
            </div>

            <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
              {filtered.map((w, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedWeapon(w)}
                  className={`w-full text-left p-2 rounded text-xs transition border ${
                    selectedWeapon.name === w.name
                      ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 font-bold'
                      : 'bg-zinc-950 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{w.name}</span>
                    <span className="text-[10px] text-zinc-500">{w.type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Stat Multipliers Output */}
          <div className="col-span-1 md:col-span-2 bg-zinc-900/60 border border-zinc-800 rounded p-4 space-y-4">
            <div className="border-b border-zinc-800 pb-3 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">{selectedWeapon.name}</h2>
                <div className="text-xs text-zinc-400">Weapon Category: {selectedWeapon.type}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-400">Disposition</div>
                <div className="text-emerald-400 font-bold text-lg">
                  {'★'.repeat(Math.round(selectedWeapon.disposition * 3))} ({selectedWeapon.disposition}x)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-zinc-950 p-3 rounded border border-zinc-800">
                <div className="text-zinc-500 text-[10px] font-bold uppercase">Estimated Damage Range</div>
                <div className="text-white font-bold text-sm mt-1">
                  +{Math.round(120 * selectedWeapon.disposition)}% to +{Math.round(165 * selectedWeapon.disposition)}%
                </div>
              </div>

              <div className="bg-zinc-950 p-3 rounded border border-zinc-800">
                <div className="text-zinc-500 text-[10px] font-bold uppercase">Estimated Multishot Range</div>
                <div className="text-white font-bold text-sm mt-1">
                  +{Math.round(70 * selectedWeapon.disposition)}% to +{Math.round(95 * selectedWeapon.disposition)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
