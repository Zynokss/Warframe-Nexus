'use client'

import ChallengeBoard from '@/components/ChallengeBoard'
import CardEmblem from '@/components/CardEmblem'
import { Trophy, Sparkles } from 'lucide-react';
import { ConclaveChallenge } from '@/types/warframe';

type ExtendedConclaveChallenge = ConclaveChallenge & {
  id?: string
  description?: string
  title?: string
  category?: string
  amount?: number
  expiry?: string
  eta?: string
}

interface ConclaveCardProps {
  conclaveChallenges?: ExtendedConclaveChallenge[]
}

export default function ConclaveCard({ conclaveChallenges = [] }: ConclaveCardProps) {
  // Safe time remaining calculation
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

  return (
    <div data-card="conclave" className="nexus-panel bg-[#0b0c12] border border-[#232636] hover:border-purple-500/50 rounded-2xl p-3.5 md:p-4 font-sans shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-between">

      {/* Full-Card Foggy Nebula & Starfield Background (Purple Void Theme) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] bg-purple-600/20 blur-[100px] rounded-full transition-all duration-700 opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#ffffff60,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_120px_160px,#ffffff80,rgba(0,0,0,0)),radial-gradient(1px_1px_at_240px_90px,#ffffff50,rgba(0,0,0,0)),radial-gradient(2px_2px_at_330px_210px,#ffffff90,rgba(0,0,0,0))] opacity-80 animate-pulse" />
      </div>

      {/* Header */}
      <div className="nexus-card-header flex items-center justify-between pb-2.5 relative z-10">
        <div className="flex items-center gap-2">
          <CardEmblem kind="conclave" />
          <h2 className="text-xs font-black text-purple-400 uppercase tracking-widest">
            Conclave Challenges
          </h2>
        </div>

        <span className="bg-purple-950/70 text-purple-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-purple-700/60 shadow-inner flex items-center gap-1">
          <Trophy className="w-3 h-3 text-purple-400" />
          {conclaveChallenges.length} Active
        </span>
      </div>

      {/* Soft Fading Divider Line (Top) */}
      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent my-1" />

      <ChallengeBoard kind="conclave" challenges={conclaveChallenges.map((challenge, idx) => ({
        id: `${challenge.id || 'challenge'}-${idx}`, title: challenge.title || challenge.description || 'Conclave Task',
        description: challenge.title ? challenge.description : undefined,
        category: (challenge.category?.toLowerCase().includes('daily') ?? true) ? 'Daily' : 'Weekly',
        timer: getTimeLeft(challenge.expiry, challenge.eta), target: challenge.amount,
      }))} />

      {/* Soft Fading Divider Line (Bottom) */}
      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent mt-1 mb-1.5" />

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 relative z-10 px-1">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-purple-400" /> Teshin’s Arena
        </span>
        <span className="font-bold text-zinc-300">PVP Protocols</span>
      </div>

    </div>
  )
}
