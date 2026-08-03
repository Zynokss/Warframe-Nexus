'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { MessageSquare, Heart, Gift, Sparkles, UserCheck } from 'lucide-react'

interface HexMember {
  id: string
  name: string
  role: string
  affinityLevel: number
  maxAffinity: number
  status: 'Online' | 'In Mission' | 'Away'
  favGifts: string[]
  currentDialogue: string
}

const HEX_MEMBERS: HexMember[] = [
  {
    id: 'arthur',
    name: 'Arthur Nightingale',
    role: 'Excalibur / Frontline',
    affinityLevel: 4,
    maxAffinity: 5,
    status: 'Online',
    favGifts: ['Cassette Tape', 'Vintage Lighter', 'Mechanic Tools'],
    currentDialogue: 'Hey kid, Techrot activity in Solstice Square is spiking. Keep your guard up.',
  },
  {
    id: 'eleanor',
    name: 'Eleanor',
    role: 'Nyx / Tech Specialist',
    affinityLevel: 3,
    maxAffinity: 5,
    status: 'In Mission',
    favGifts: ['Encrypted Floppy Disk', 'Rare Herbs', 'Journal'],
    currentDialogue: 'The Scaldra signals are overlapping... I need a moment to isolate their frequency.',
  },
  {
    id: 'lettie',
    name: 'Lettie',
    role: 'Trinity / Combat Medic',
    affinityLevel: 5,
    maxAffinity: 5,
    status: 'Online',
    favGifts: ['First Aid Patch', 'Clean Water', 'Medical Manual'],
    currentDialogue: 'If you are going out there without extra medical supplies, do not come crying to me when you get shot.',
  },
  {
    id: 'amir',
    name: 'Amir',
    role: 'Volt / Energy Engineer',
    affinityLevel: 2,
    maxAffinity: 5,
    status: 'Online',
    favGifts: ['Spare Circuitry', 'Energy Drink', 'Soldering Iron'],
    currentDialogue: 'I managed to boost the grid capacity by 12%! Well... before the breaker blew.',
  },
  {
    id: 'quincy',
    name: 'Quincy',
    role: 'Cyte-09 / Marksman',
    affinityLevel: 1,
    maxAffinity: 5,
    status: 'Away',
    favGifts: ['Precision Scope', 'Polishing Cloth', 'Cigarette Case'],
    currentDialogue: 'One shot, one Techrot unit down. Simple math.',
  },
  {
    id: 'aoi',
    name: 'Aoi',
    role: 'Mag / Vanguard',
    affinityLevel: 4,
    maxAffinity: 5,
    status: 'Online',
    favGifts: ['Magnetic Core', 'Arcade Token', 'Custom Keychain'],
    currentDialogue: 'Who wants to hit the arcade after this sweep? Loser buys drinks.',
  },
]

export default function KimPage() {
  const [selectedMember, setSelectedMember] = useState<HexMember>(HEX_MEMBERS[0])

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 font-mono">
      <Navbar />

      <main className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wider uppercase flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-sky-400" /> KIM Messenger // 1999 Affinity Tracker
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time status, relationship affinity tiers, and favorite gift tracking for The Hex.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Members List */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded p-4 space-y-2">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
              The Hex Syndicate
            </h2>

            <div className="space-y-1.5">
              {HEX_MEMBERS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMember(m)}
                  className={`w-full text-left p-2.5 rounded text-xs transition border ${
                    selectedMember.id === m.id
                      ? 'bg-sky-950/60 border-sky-800 text-sky-300 font-bold'
                      : 'bg-zinc-950 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{m.name}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded ${
                        m.status === 'Online'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : m.status === 'In Mission'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-zinc-900 text-zinc-500'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-1">
                    <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                    <span>
                      Affinity Rank {m.affinityLevel} / {m.maxAffinity}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Member Chat & Gift Details */}
          <div className="col-span-1 md:col-span-2 bg-zinc-900/60 border border-zinc-800 rounded p-4 space-y-4">
            <div className="border-b border-zinc-800 pb-3 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">{selectedMember.name}</h2>
                <div className="text-xs text-zinc-400">{selectedMember.role}</div>
              </div>

              <div className="flex items-center gap-1">
                {Array.from({ length: selectedMember.maxAffinity }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 ${
                      i < selectedMember.affinityLevel
                        ? 'text-red-500 fill-red-500'
                        : 'text-zinc-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Simulated KIM Chat Log */}
            <div className="bg-zinc-950 p-3 rounded border border-zinc-800 space-y-2">
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-sky-400" /> Latest Communication
              </div>
              <p className="text-xs text-zinc-200 italic bg-zinc-900/80 p-3 rounded border border-zinc-800/80">
                "{selectedMember.currentDialogue}"
              </p>
            </div>

            {/* Favorite Gifts */}
            <div className="bg-zinc-950 p-3 rounded border border-zinc-800 space-y-2">
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <Gift className="w-3 h-3 text-amber-400" /> Recommended Affinity Gifts
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedMember.favGifts.map((gift, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-amber-950/40 text-amber-300 border border-amber-900/60 px-2.5 py-1 rounded font-bold"
                  >
                    {gift}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}