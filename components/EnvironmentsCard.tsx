'use client'

import CycleConsole from '@/components/CycleConsole'
import CardEmblem from '@/components/CardEmblem'
import { useState, useEffect } from 'react';

type CycleItem = {
  id?: string
  expiry?: string
  eta?: string
  state?: string
  isDay?: boolean
  isWarm?: boolean
  active?: string
}

interface EnvironmentsCardProps {
  cetusCycle?: CycleItem
  earthCycle?: CycleItem
  vallisCycle?: CycleItem
  cambionCycle?: CycleItem
  zarimanCycle?: CycleItem
}

export default function EnvironmentsCard({
  cetusCycle,
  earthCycle,
  vallisCycle,
  cambionCycle,
  zarimanCycle,
}: EnvironmentsCardProps) {
  const [selectedWorld, setSelectedWorld] = useState<number>(0)
  const [, setTick] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getTimeLeft = (expiry?: string, eta?: string) => {
    if (eta && !expiry) return eta

    if (expiry) {
      const diff = new Date(expiry).getTime() - Date.now()
      if (diff <= 0) return '00:00'

      const totalSecs = Math.floor(diff / 1000)
      const hours = Math.floor(totalSecs / 3600)
      const mins = Math.floor((totalSecs % 3600) / 60)
      const secs = totalSecs % 60

      const pad = (n: number) => n.toString().padStart(2, '0')
      if (hours > 0) return `${hours}h ${pad(mins)}m`
      return `${pad(mins)}:${pad(secs)}`
    }

    return '00:00'
  }

  const worlds = [
    {
      id: 'cetus',
      name: 'Plains of Eidolon',
      shortName: 'Plains',
      location: 'Cetus, Earth',
      state: cetusCycle?.state || (cetusCycle?.isDay ? 'Day' : 'Night'),
      timeLeft: getTimeLeft(cetusCycle?.expiry, cetusCycle?.eta),
      accentText: 'text-amber-400',
      accentBorder: 'border-amber-500/50',
      glowBg: 'bg-amber-500/20',
      description: cetusCycle?.isDay
        ? 'Ostron scavengers roam freely under the scorching sun. Safe for mining, fishing, and bounties.'
        : 'The Sentient spirits rise from their ancient tombs. Tread carefully, Tenno—Eidolons roam the night.',
    },
    {
      id: 'earth',
      name: 'Earth Wilderness',
      shortName: 'Earth',
      location: 'Earth Orbit',
      state: earthCycle?.state || (earthCycle?.isDay ? 'Day' : 'Night'),
      timeLeft: getTimeLeft(earthCycle?.expiry, earthCycle?.eta),
      accentText: 'text-emerald-400',
      accentBorder: 'border-emerald-500/50',
      glowBg: 'bg-emerald-500/20',
      description: earthCycle?.isDay
        ? 'Daylight reveals dense Grineer outposts along the overgrown jungle paths.'
        : 'Nightfall covers the canopy in shadow. Moonlight flora and nocturnal species emerge.',
    },
    {
      id: 'vallis',
      name: 'Orb Vallis',
      shortName: 'Orb Vallis',
      location: 'Fortuna, Venus',
      state: vallisCycle?.state || (vallisCycle?.isWarm ? 'Warm' : 'Cold'),
      timeLeft: getTimeLeft(vallisCycle?.expiry, vallisCycle?.eta),
      accentText: 'text-cyan-400',
      accentBorder: 'border-cyan-500/50',
      glowBg: 'bg-cyan-500/20',
      description: vallisCycle?.isWarm
        ? 'Thermal coolant towers vent excess heat, temporarily thawing the frozen tundra.'
        : 'Sub-zero blizzards blanket the valley. Rare Orokinservofish swim through freezing coolant fluids.',
    },
    {
      id: 'deimos',
      name: 'Cambion Drift',
      shortName: 'Cambion',
      location: 'Deimos',
      state: cambionCycle?.active || cambionCycle?.state || 'Fass',
      timeLeft: getTimeLeft(cambionCycle?.expiry, cambionCycle?.eta),
      accentText: 'text-orange-400',
      accentBorder: 'border-orange-500/50',
      glowBg: 'bg-orange-500/20',
      description: (cambionCycle?.active || cambionCycle?.state || '').toLowerCase().includes('vome')
        ? 'Vome slumbers and watches over the Drift with blue luminescence. Infested wyrms remain dormant.'
        : 'Fass strikes down with destructive red beams, empowering hostile Infested worms across Deimos.',
    },
    {
      id: 'zariman',
      name: 'Zariman Ten Zero',
      shortName: 'Zariman',
      location: 'The Fold',
      state: zarimanCycle?.state || 'Grineer',
      timeLeft: getTimeLeft(zarimanCycle?.expiry, zarimanCycle?.eta),
      accentText: 'text-purple-400',
      accentBorder: 'border-purple-500/50',
      glowBg: 'bg-purple-500/20',
      description: (zarimanCycle?.state || '').toLowerCase().includes('grineer')
        ? 'Grineer boarding parties invade the ghost ship, attempting to secure Orokin relics.'
        : 'Corpus expeditionary forces deploy high-tech proxies to purge Void manifestations.',
    },
  ]

  const current = worlds[selectedWorld]

  return (
    <div data-card="cycles" className={`nexus-panel bg-[#0b0c12] border border-[#232636] hover:${current.accentBorder} rounded-2xl p-3.5 md:p-4 font-sans shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-between`}>

      {/* Restored Full-Card Foggy Nebula & Starfield Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        {/* Rich Colored Fog / Nebula */}
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] ${current.glowBg} blur-[100px] rounded-full transition-all duration-700 opacity-80`} />

        {/* Starfield Particles */}
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#ffffff60,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_120px_160px,#ffffff80,rgba(0,0,0,0)),radial-gradient(1px_1px_at_240px_90px,#ffffff50,rgba(0,0,0,0)),radial-gradient(2px_2px_at_330px_210px,#ffffff90,rgba(0,0,0,0))] opacity-80 animate-pulse" />
      </div>

      {/* Header & Quick Selector Tabs */}
      <div className="nexus-card-header flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 relative z-10">
        <div className="flex items-center gap-2">
          <CardEmblem kind="cycles" />
          <h2 className={`text-xs font-black uppercase tracking-widest ${current.accentText}`}>

            <span>World Cycles</span>
          </h2>
        </div>

        {/* World Select Tabs */}

      </div>

      {/* Soft Fading Divider Line (Top) */}
      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent my-1" />

      <CycleConsole worlds={worlds} selected={selectedWorld}
        available={[cetusCycle, earthCycle, vallisCycle, cambionCycle, zarimanCycle].map(Boolean)}
        onSelect={setSelectedWorld} />

      {/* Lore & Tactical Intelligence Card Box */}

      {/* Soft Fading Divider Line (Bottom) */}
      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent my-1.5" />

      {/* Sol System Quick Overview Row */}

    </div>
  )
}
