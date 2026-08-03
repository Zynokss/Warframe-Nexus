'use client'

import { useState, useEffect } from 'react'
import { Calendar, ShoppingBag, CheckSquare, Clock, Compass, Sparkles } from 'lucide-react'
import { DuviriCycle } from '@/types/warframe'

interface ChecklistState {
  lastReset: number
  teshin: boolean
  palladino: boolean
  clem: boolean
  maroo: boolean
  calendar1999: boolean
  circuitNormal: boolean
  circuitSP: boolean
  netracells: boolean[]
  kahl: boolean[]
  descendia: boolean[]
}

const DEFAULT_STATE: ChecklistState = {
  lastReset: 0,
  teshin: false,
  palladino: false,
  clem: false,
  maroo: false,
  calendar1999: false,
  circuitNormal: false,
  circuitSP: false,
  netracells: [false, false, false, false, false],
  kahl: [false, false, false, false, false, false, false],
  descendia: [false, false],
}

function getLastWeeklyResetDate(): Date {
  const now = new Date()
  const day = now.getUTCDay() // 0 = Sunday
  const lastReset = new Date(now)

  lastReset.setUTCDate(now.getUTCDate() - day)
  lastReset.setUTCHours(0, 0, 0, 0)

  return lastReset
}

function getWeeklyResetCountdown() {
  const now = new Date()
  const nextReset = new Date(now)

  const daysUntilSunday = (7 - now.getUTCDay()) % 7
  nextReset.setUTCDate(
    now.getUTCDate() + (daysUntilSunday === 0 && (now.getUTCHours() > 0 || now.getUTCMinutes() > 0) ? 7 : daysUntilSunday)
  )
  nextReset.setUTCHours(0, 0, 0, 0)

  const diff = nextReset.getTime() - now.getTime()
  if (diff <= 0) return 'Resetting...'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  const d = Math.floor(hours / 24)
  const h = hours % 24

  return d > 0 ? `${d}d ${h}h ${minutes}m` : `${h}h ${minutes}m ${seconds}s`
}

export default function WeeklyResetCard({ duviriCycle }: { duviriCycle?: DuviriCycle | any }) {
  const [state, setState] = useState<ChecklistState>(DEFAULT_STATE)
  const [resetTimer, setResetTimer] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  const normalChoices = duviriCycle?.choices?.find((c: any) => c.category === 'normal')?.choices || ['Nekros', 'Valkyr', 'Oberon']
  const spChoices = duviriCycle?.choices?.find((c: any) => c.category === 'hard')?.choices || ['Torid', 'Dual Toxocyst', 'Dual Ichor', 'Miter', 'Atomos']

  const normalString = Array.isArray(normalChoices) ? normalChoices.join(' · ') : 'Active Rotation'
  const spString = Array.isArray(spChoices) ? spChoices.join(' · ') : 'Active Incarnons'
  const currentMood = duviriCycle?.state || 'Joy'

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('wf_weekly_checklist')
    const currentWeeklyResetTime = getLastWeeklyResetDate().getTime()

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const savedResetTime = parsed.lastReset || 0

        if (savedResetTime < currentWeeklyResetTime) {
          const freshState = { ...DEFAULT_STATE, lastReset: currentWeeklyResetTime }
          setState(freshState)
          localStorage.setItem('wf_weekly_checklist', JSON.stringify(freshState))
        } else {
          setState({
            lastReset: currentWeeklyResetTime,
            teshin: typeof parsed.teshin === 'boolean' ? parsed.teshin : DEFAULT_STATE.teshin,
            palladino: typeof parsed.palladino === 'boolean' ? parsed.palladino : DEFAULT_STATE.palladino,
            clem: typeof parsed.clem === 'boolean' ? parsed.clem : DEFAULT_STATE.clem,
            maroo: typeof parsed.maroo === 'boolean' ? parsed.maroo : DEFAULT_STATE.maroo,
            calendar1999: typeof parsed.calendar1999 === 'boolean' ? parsed.calendar1999 : DEFAULT_STATE.calendar1999,
            circuitNormal: typeof parsed.circuitNormal === 'boolean' ? parsed.circuitNormal : DEFAULT_STATE.circuitNormal,
            circuitSP: typeof parsed.circuitSP === 'boolean' ? parsed.circuitSP : DEFAULT_STATE.circuitSP,
            netracells: Array.isArray(parsed.netracells) && parsed.netracells.length === 5 ? parsed.netracells : DEFAULT_STATE.netracells,
            kahl: Array.isArray(parsed.kahl) && parsed.kahl.length === 7 ? parsed.kahl : DEFAULT_STATE.kahl,
            descendia: Array.isArray(parsed.descendia) && parsed.descendia.length === 2 ? parsed.descendia : DEFAULT_STATE.descendia,
          })
        }
      } catch (e) {
        console.error('Failed to parse checklist state', e)
      }
    } else {
      const initialState = { ...DEFAULT_STATE, lastReset: currentWeeklyResetTime }
      setState(initialState)
      localStorage.setItem('wf_weekly_checklist', JSON.stringify(initialState))
    }

    setResetTimer(getWeeklyResetCountdown())
    const interval = setInterval(() => {
      setResetTimer(getWeeklyResetCountdown())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const updateState = (newState: ChecklistState) => {
    setState(newState)
    localStorage.setItem('wf_weekly_checklist', JSON.stringify(newState))
  }

  const toggleSingle = (key: 'teshin' | 'palladino' | 'clem' | 'maroo' | 'calendar1999' | 'circuitNormal' | 'circuitSP') => {
    updateState({ ...state, [key]: !state[key] })
  }

  const toggleMulti = (key: 'netracells' | 'kahl' | 'descendia', index: number) => {
    const updated = [...state[key]]
    updated[index] = !updated[index]
    updateState({ ...state, [key]: updated })
  }

  // Mood color helper for Duviri Moods
  const getMoodStyle = (mood?: string) => {
    switch (mood?.toLowerCase()) {
      case 'joy': return 'text-amber-300 border-amber-500/60 bg-amber-950/40'
      case 'anger': return 'text-red-400 border-red-500/60 bg-red-950/40'
      case 'envy': return 'text-emerald-300 border-emerald-500/60 bg-emerald-950/40'
      case 'sorrow': return 'text-sky-300 border-sky-500/60 bg-sky-950/40'
      case 'fear': return 'text-purple-300 border-purple-500/60 bg-purple-950/40'
      default: return 'text-teal-300 border-teal-500/60 bg-teal-950/40'
    }
  }

  return (
    <div className="bg-[#0b0c12] border border-[#232636] hover:border-teal-500/50 rounded-2xl p-3.5 md:p-4 font-sans shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-between">
      
      {/* Background Nebula & Starfield (Teal Reset Glow) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] bg-teal-600/15 blur-[100px] rounded-full transition-all duration-700 opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#ffffff60,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_120px_160px,#ffffff80,rgba(0,0,0,0)),radial-gradient(1px_1px_at_240px_90px,#ffffff50,rgba(0,0,0,0)),radial-gradient(2px_2px_at_330px_210px,#ffffff90,rgba(0,0,0,0))] opacity-80 animate-pulse" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 relative z-10">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-400 animate-pulse" />
          <h2 className="text-xs font-black text-teal-400 uppercase tracking-widest">
            Weekly Reset & Checklist
          </h2>
        </div>

        <span className="bg-teal-950/70 text-teal-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-teal-700/60 shadow-inner flex items-center gap-1">
          <Clock className="w-3 h-3 text-teal-400" />
          {resetTimer || 'Calculating...'}
        </span>
      </div>

      {/* Soft Fading Divider Line (Top) */}
      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent my-1" />

      {/* Duviri Mood Banner */}
      <div className="bg-[#12131c]/80 backdrop-blur-md p-3 rounded-xl border border-[#232636] flex items-center justify-between relative z-10 my-1 shadow-sm">
        <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-teal-400" />
          Duviri Spiral
        </span>
        <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-xl border uppercase shadow-inner ${getMoodStyle(currentMood)}`}>
          {currentMood}
        </span>
      </div>

      {/* Content Checklist Area */}
      <div className="space-y-2.5 text-xs max-h-[320px] overflow-y-auto pr-1 custom-scrollbar relative z-10 my-1">
        {/* Honor Vendors */}
        <div className="p-3 rounded-xl border bg-[#12131c]/80 backdrop-blur-md border-[#232636] space-y-2 shadow-sm">
          <div className="text-[11px] font-mono font-bold text-amber-400 flex items-center gap-1.5 border-b border-zinc-800/60 pb-1.5 uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5" /> Honor Vendors
          </div>

          <div className="space-y-1.5 pt-0.5">
            <button
              onClick={() => toggleSingle('teshin')}
              className={`w-full flex items-center justify-between p-2 rounded-xl border text-left transition cursor-pointer font-mono ${
                mounted && state.teshin
                  ? 'bg-emerald-950/40 border-emerald-800/50 text-zinc-500 line-through'
                  : 'bg-[#0a0b0e]/70 border-zinc-800/80 text-zinc-200 hover:border-zinc-600'
              }`}
            >
              <span className="font-bold">Steel Path Honors (Teshin)</span>
              <span className="text-[10px] text-emerald-400 font-extrabold no-underline">
                {mounted && state.teshin ? '✓ Claimed' : '50,000x Kuva'}
              </span>
            </button>

            <button
              onClick={() => toggleSingle('palladino')}
              className={`w-full flex items-center justify-between p-2 rounded-xl border text-left transition cursor-pointer font-mono ${
                mounted && state.palladino
                  ? 'bg-emerald-950/40 border-emerald-800/50 text-zinc-500 line-through'
                  : 'bg-[#0a0b0e]/70 border-zinc-800/80 text-zinc-200 hover:border-zinc-600'
              }`}
            >
              <span className="font-bold">Iron Wake (Palladino)</span>
              <span className="text-[10px] text-amber-400 font-extrabold no-underline">
                {mounted && state.palladino ? '✓ Claimed' : 'Riven Mods / Kuva'}
              </span>
            </button>
          </div>
        </div>

        {/* Weekly Missions Checklist */}
        <div className="p-3 rounded-xl border bg-[#12131c]/80 backdrop-blur-md border-[#232636] space-y-2 shadow-sm">
          <div className="text-[11px] font-mono font-bold text-sky-400 flex items-center gap-1.5 border-b border-zinc-800/60 pb-1.5 uppercase tracking-wider">
            <CheckSquare className="w-3.5 h-3.5" /> Weekly Missions
          </div>

          <div className="space-y-1.5 pt-0.5 font-mono">
            <button
              onClick={() => toggleSingle('clem')}
              className={`w-full flex items-center justify-between p-2 rounded-xl border text-left transition cursor-pointer ${
                mounted && state.clem
                  ? 'bg-emerald-950/40 border-emerald-800/50 text-zinc-500 line-through'
                  : 'bg-[#0a0b0e]/70 border-zinc-800/80 text-zinc-200 hover:border-zinc-600'
              }`}
            >
              <span className="font-bold">Help Clem</span>
              <span className="text-xs font-black no-underline">{mounted && state.clem ? '☑' : '☐'}</span>
            </button>

            <button
              onClick={() => toggleSingle('maroo')}
              className={`w-full flex items-center justify-between p-2 rounded-xl border text-left transition cursor-pointer ${
                mounted && state.maroo
                  ? 'bg-emerald-950/40 border-emerald-800/50 text-zinc-500 line-through'
                  : 'bg-[#0a0b0e]/70 border-zinc-800/80 text-zinc-200 hover:border-zinc-600'
              }`}
            >
              <span className="font-bold">Ayatan Treasure Hunt</span>
              <span className="text-xs font-black no-underline">{mounted && state.maroo ? '☑' : '☐'}</span>
            </button>

            <button
              onClick={() => toggleSingle('calendar1999')}
              className={`w-full flex items-center justify-between p-2 rounded-xl border text-left transition cursor-pointer ${
                mounted && state.calendar1999
                  ? 'bg-emerald-950/40 border-emerald-800/50 text-zinc-500 line-through'
                  : 'bg-[#0a0b0e]/70 border-zinc-800/80 text-zinc-200 hover:border-zinc-600'
              }`}
            >
              <span className="font-bold">1999 Calendar</span>
              <span className="text-xs font-black no-underline">{mounted && state.calendar1999 ? '☑' : '☐'}</span>
            </button>

            <button
              onClick={() => toggleSingle('circuitNormal')}
              className={`w-full flex items-center justify-between p-2 rounded-xl border text-left transition cursor-pointer ${
                mounted && state.circuitNormal
                  ? 'bg-emerald-950/40 border-emerald-800/50 text-zinc-500 line-through'
                  : 'bg-[#0a0b0e]/70 border-zinc-800/80 text-zinc-200 hover:border-zinc-600'
              }`}
            >
              <div className="truncate pr-2">
                <span className="text-zinc-400 font-bold">Circuit (Normal): </span>
                <span className="font-bold text-zinc-100">{normalString}</span>
              </div>
              <span className="text-xs font-black shrink-0 no-underline">{mounted && state.circuitNormal ? '☑' : '☐'}</span>
            </button>

            <button
              onClick={() => toggleSingle('circuitSP')}
              className={`w-full flex items-center justify-between p-2 rounded-xl border text-left transition cursor-pointer ${
                mounted && state.circuitSP
                  ? 'bg-emerald-950/40 border-emerald-800/50 text-zinc-500 line-through'
                  : 'bg-[#0a0b0e]/70 border-zinc-800/80 text-zinc-200 hover:border-zinc-600'
              }`}
            >
              <div className="truncate pr-2">
                <span className="text-zinc-400 font-bold">Circuit (SP): </span>
                <span className="font-bold text-teal-300">{spString}</span>
              </div>
              <span className="text-xs font-black shrink-0 no-underline">{mounted && state.circuitSP ? '☑' : '☐'}</span>
            </button>

            {/* Netracells */}
            <div className="p-2 rounded-xl border bg-[#0a0b0e]/70 border-zinc-800/80 flex items-center justify-between">
              <span className="text-zinc-200 font-bold">Netracells</span>
              <div className="flex items-center gap-1">
                {state.netracells.map((checked, i) => (
                  <button
                    key={`netracell-${i}`}
                    onClick={() => toggleMulti('netracells', i)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition border cursor-pointer ${
                      mounted && checked
                        ? 'bg-emerald-950/80 border-emerald-700 text-emerald-400 font-black'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-600 hover:text-zinc-300'
                    }`}
                  >
                    {mounted && checked ? '✓' : '☐'}
                  </button>
                ))}
              </div>
            </div>

            {/* Break Narmer */}
            <div className="p-2 rounded-xl border bg-[#0a0b0e]/70 border-zinc-800/80 flex items-center justify-between">
              <span className="text-zinc-200 font-bold">Break Narmer</span>
              <div className="flex items-center gap-1">
                {state.kahl.map((checked, i) => (
                  <button
                    key={`kahl-${i}`}
                    onClick={() => toggleMulti('kahl', i)}
                    className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold transition border cursor-pointer ${
                      mounted && checked
                        ? 'bg-emerald-950/80 border-emerald-700 text-emerald-400 font-black'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-600 hover:text-zinc-300'
                    }`}
                  >
                    {mounted && checked ? '✓' : '☐'}
                  </button>
                ))}
              </div>
            </div>

            {/* Descendia */}
            <div className="p-2 rounded-xl border bg-[#0a0b0e]/70 border-zinc-800/80 flex items-center justify-between">
              <span className="text-zinc-200 font-bold">Descendia</span>
              <div className="flex items-center gap-1">
                {state.descendia.map((checked, i) => (
                  <button
                    key={`descendia-${i}`}
                    onClick={() => toggleMulti('descendia', i)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition border cursor-pointer ${
                      mounted && checked
                        ? 'bg-emerald-950/80 border-emerald-700 text-emerald-400 font-black'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-600 hover:text-zinc-300'
                    }`}
                  >
                    {mounted && checked ? '✓' : '☐'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent mt-1 mb-1.5" />

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 relative z-10 px-1">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-teal-400" /> Weekly Progression Sync
        </span>
        <span className="font-bold text-zinc-300">Resets Sundays UTC</span>
      </div>

    </div>
  )
}