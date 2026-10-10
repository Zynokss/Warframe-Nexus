'use client'

import ChallengeBoard from '@/components/ChallengeBoard'
import CardEmblem from '@/components/CardEmblem'
import { useState } from 'react';
import { Sparkles } from 'lucide-react';

type NightwaveChallengeItem = {
  id?: string
  title?: string
  description?: string
  standing?: number
  isDaily?: boolean
  isElite?: boolean
  expiry?: string
  eta?: string
}

type NightwaveData = {
  season?: number
  tag?: string
  activeChallenges?: NightwaveChallengeItem[]
  expiry?: string
  eta?: string
}

interface NightwaveCardProps {
  nightwave?: NightwaveData
}

export default function NightwaveCard({ nightwave }: NightwaveCardProps) {
  const [filter, setFilter] = useState<'ALL' | 'DAILY' | 'WEEKLY'>('ALL')
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({})

  const toggleChallenge = (id: string) => {
    setCompletedIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const getTimeLeft = (expiry?: string, eta?: string) => {
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

  const challenges = nightwave?.activeChallenges || []

  // Filter challenges based on tab selection
  const filteredChallenges = challenges.filter((c) => {
    if (filter === 'DAILY') return c.isDaily
    if (filter === 'WEEKLY') return !c.isDaily
    return true
  })

  return (
    <div data-card="nightwave" className="nexus-panel bg-[#0b0c12] border border-[#232636] hover:border-pink-500/50 rounded-2xl p-3.5 md:p-4 font-sans shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-between">

      {/* Background Nebula & Starfield (Nora Pink Amethyst Glow) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] bg-pink-600/15 blur-[100px] rounded-full transition-all duration-700 opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#ffffff60,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_120px_160px,#ffffff80,rgba(0,0,0,0)),radial-gradient(1px_1px_at_240px_90px,#ffffff50,rgba(0,0,0,0)),radial-gradient(2px_2px_at_330px_210px,#ffffff90,rgba(0,0,0,0))] opacity-80 animate-pulse" />
      </div>

      {/* Header & Filter Tabs */}
      <div className="nexus-card-header flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <CardEmblem kind="nightwave" />
          <h2 className="text-xs font-black text-pink-400 uppercase tracking-widest">
            NIGHTWAVE
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="nexus-selector flex items-center bg-[#12131c]/85 backdrop-blur-md p-1 rounded-xl border border-[#232636] text-[10px]">
          {(['ALL', 'DAILY', 'WEEKLY'] as const).map((tab) => (
            <button
              key={tab}
              aria-pressed={filter === tab}
              onClick={() => setFilter(tab)}
              className={`px-2 py-0.5 rounded-lg transition font-mono font-bold cursor-pointer ${
                filter === tab
                  ? 'bg-pink-500 text-zinc-950 shadow-md font-extrabold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent my-1" />

      <ChallengeBoard kind="nightwave" onToggle={toggleChallenge} challenges={filteredChallenges.map((act, idx) => ({
        id: act.id || `act-${idx}`, title: act.title || 'Nightwave Act', description: act.description,
        category: act.isDaily ? 'Daily act' : act.isElite ? 'Elite weekly' : 'Weekly act',
        standing: act.standing || (act.isDaily ? 1000 : act.isElite ? 7000 : 4500),
        timer: getTimeLeft(act.expiry, act.eta), done: Boolean(completedIds[act.id || `act-${idx}`]),
      }))} />

      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent mt-1 mb-1.5" />

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 relative z-10 px-1">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-pink-400" /> Nora&apos;s Broadcasts
        </span>
        <span className="font-bold text-zinc-300">{filteredChallenges.length} Active Acts</span>
      </div>

    </div>
  )
}
