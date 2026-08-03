'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon, ThermometerSnowflake, Eye, Globe, Compass, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'

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
      icon: cetusCycle?.isDay ? Sun : Moon,
      accentText: 'text-amber-400',
      accentBg: 'bg-amber-500',
      accentBorder: 'border-amber-500/50',
      glowBg: 'bg-amber-500/20',
      pillStyle: 'bg-amber-950/70 border-amber-700/60 text-amber-300',
      dotGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.9)] bg-amber-400',
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
      icon: earthCycle?.isDay ? Sun : Moon,
      accentText: 'text-emerald-400',
      accentBg: 'bg-emerald-500',
      accentBorder: 'border-emerald-500/50',
      glowBg: 'bg-emerald-500/20',
      pillStyle: 'bg-emerald-950/70 border-emerald-700/60 text-emerald-300',
      dotGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.9)] bg-emerald-400',
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
      icon: ThermometerSnowflake,
      accentText: 'text-cyan-400',
      accentBg: 'bg-cyan-500',
      accentBorder: 'border-cyan-500/50',
      glowBg: 'bg-cyan-500/20',
      pillStyle: 'bg-cyan-950/70 border-cyan-700/60 text-cyan-300',
      dotGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.9)] bg-cyan-400',
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
      icon: Eye,
      accentText: 'text-orange-400',
      accentBg: 'bg-orange-500',
      accentBorder: 'border-orange-500/50',
      glowBg: 'bg-orange-500/20',
      pillStyle: 'bg-orange-950/70 border-orange-700/60 text-orange-300',
      dotGlow: 'shadow-[0_0_15px_rgba(249,115,22,0.9)] bg-orange-400',
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
      icon: Globe,
      accentText: 'text-purple-400',
      accentBg: 'bg-purple-500',
      accentBorder: 'border-purple-500/50',
      glowBg: 'bg-purple-500/20',
      pillStyle: 'bg-purple-950/70 border-purple-700/60 text-purple-300',
      dotGlow: 'shadow-[0_0_15px_rgba(168,85,247,0.9)] bg-purple-400',
      description: (zarimanCycle?.state || '').toLowerCase().includes('grineer')
        ? 'Grineer boarding parties invade the ghost ship, attempting to secure Orokin relics.'
        : 'Corpus expeditionary forces deploy high-tech proxies to purge Void manifestations.',
    },
  ]

  const current = worlds[selectedWorld]
  const CurrentIcon = current.icon

  const handlePrev = () => {
    setSelectedWorld((prev) => (prev === 0 ? worlds.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedWorld((prev) => (prev === worlds.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className={`bg-[#0b0c12] border border-[#232636] hover:${current.accentBorder} rounded-2xl p-3.5 md:p-4 font-sans shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-between`}>
      
      {/* Restored Full-Card Foggy Nebula & Starfield Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        {/* Rich Colored Fog / Nebula */}
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] ${current.glowBg} blur-[100px] rounded-full transition-all duration-700 opacity-80`} />
        
        {/* Starfield Particles */}
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#ffffff60,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_120px_160px,#ffffff80,rgba(0,0,0,0)),radial-gradient(1px_1px_at_240px_90px,#ffffff50,rgba(0,0,0,0)),radial-gradient(2px_2px_at_330px_210px,#ffffff90,rgba(0,0,0,0))] opacity-80 animate-pulse" />
      </div>

      {/* Header & Quick Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 relative z-10">
        <div className="flex items-center gap-2">
          <Compass className={`w-4 h-4 ${current.accentText} animate-pulse`} />
          <h2 className={`text-xs font-black uppercase tracking-widest ${current.accentText}`}>
            Orbital Dial
          </h2>
        </div>

        {/* World Select Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          {worlds.map((w, idx) => (
            <button
              key={w.id}
              onClick={() => setSelectedWorld(idx)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all shrink-0 cursor-pointer ${
                selectedWorld === idx
                  ? `${w.accentBg} text-zinc-950 shadow-md scale-105`
                  : 'bg-[#12131c]/80 backdrop-blur text-zinc-300 hover:text-white border border-[#232636]'
              }`}
            >
              {w.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Soft Fading Divider Line (Top) */}
      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent my-1" />

      {/* Main Astronomical Dial Display with Arrow Controls */}
      <div className="py-2 flex items-center justify-between relative z-10 px-1 md:px-4 my-1">
        
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          className="p-2 rounded-xl bg-[#12131c]/70 backdrop-blur-md border border-[#232636] text-zinc-300 hover:text-white hover:border-zinc-500 transition cursor-pointer shrink-0 z-20 shadow-lg"
          title="Previous World"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Center Orbital Dial */}
        <div className="relative w-40 h-40 md:w-44 md:h-44 flex items-center justify-center shrink-0 z-10">
          
          {/* Decorative Rings */}
          <div className="absolute inset-0 rounded-full border border-dashed border-zinc-600/40 animate-[spin_60s_linear_infinite] pointer-events-none" />
          <div className="absolute inset-2 rounded-full border border-zinc-700/60 pointer-events-none" />
          <div className={`absolute inset-4 rounded-full border ${current.accentBorder} pointer-events-none transition-colors duration-500`} />

          {/* Orbiting Celestial Pulse Node */}
          <div className="absolute inset-0 animate-[spin_20s_linear_infinite] pointer-events-none">
            <div className={`w-3 h-3 rounded-full ${current.dotGlow} absolute top-1 left-1/2 -translate-x-1/2`} />
          </div>

          {/* Center Info Payload */}
          <div className="text-center space-y-1 z-10 px-2">
            <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] font-mono font-extrabold uppercase tracking-wider shadow-inner ${current.pillStyle}`}>
              <CurrentIcon className="w-3 h-3" />
              <span>{current.state}</span>
            </div>

            <h3 className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold truncate max-w-[110px]">
              {current.name}
            </h3>

            {/* Bright Ticking Countdown */}
            <div className="text-2xl md:text-3xl font-mono font-black text-white tracking-wider drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
              {current.timeLeft}
            </div>

            <p className="text-[9px] text-zinc-400 font-mono tracking-wider">
              {current.location}
            </p>
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          className="p-2 rounded-xl bg-[#12131c]/70 backdrop-blur-md border border-[#232636] text-zinc-300 hover:text-white hover:border-zinc-500 transition cursor-pointer shrink-0 z-20 shadow-lg"
          title="Next World"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Lore & Tactical Intelligence Card Box */}
      <div className="bg-[#12131c]/80 backdrop-blur-md border border-[#232636] rounded-xl p-2.5 relative z-10 space-y-1 shadow-lg">
        <div className="flex items-center justify-between text-[9px] font-mono font-bold uppercase">
          <span className={`flex items-center gap-1 ${current.accentText}`}>
            <Sparkles className="w-3 h-3" /> Tactical Intelligence
          </span>
          <span className="text-zinc-400">{current.state} Active</span>
        </div>
        <p className="text-[11px] text-zinc-100 leading-snug font-sans line-clamp-2 font-medium">
          {current.description}
        </p>
      </div>

      {/* Soft Fading Divider Line (Bottom) */}
      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent my-1.5" />

      {/* Sol System Quick Overview Row */}
      <div className="relative z-10 grid grid-cols-5 gap-1.5">
        {worlds.map((w, idx) => (
          <button
            key={`mini-${w.id}`}
            onClick={() => setSelectedWorld(idx)}
            className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer group backdrop-blur-md ${
              selectedWorld === idx
                ? `${w.accentBorder} bg-[#141622]/90 shadow-md`
                : 'bg-[#0a0b0e]/70 border-[#232636] hover:border-zinc-600'
            }`}
          >
            <div className="text-[9px] font-bold text-zinc-300 group-hover:text-white truncate">
              {w.shortName}
            </div>
            <div className={`text-[11px] font-mono font-bold ${w.accentText} mt-0.5 truncate`}>
              {w.timeLeft}
            </div>
          </button>
        ))}
      </div>

    </div>
  )
}