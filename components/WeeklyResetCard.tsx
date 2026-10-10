'use client'

import CardEmblem from '@/components/CardEmblem'
import WeeklyAgenda from '@/components/WeeklyAgenda'
import { useState, useEffect, useRef } from 'react';

import { DuviriCycle } from '@/types/warframe';

import { readStoredJson, writeStoredJson } from '@/lib/browser-storage';
import { CHECKLIST_KEY, freshChecklist, restoreChecklist, resetChecklistIfDue, weeklyResetCountdown } from '@/lib/weekly-checklist';
import type { ChecklistState } from '@/lib/weekly-checklist';
export type { ChecklistState } from '@/lib/weekly-checklist'
const DEFAULT_STATE = freshChecklist(0)

function saveChecklist(state: ChecklistState) {
  writeStoredJson(CHECKLIST_KEY, state)
}

export default function WeeklyResetCard({ duviriCycle }: { duviriCycle?: DuviriCycle }) {
  const [state, setState] = useState<ChecklistState>(DEFAULT_STATE)
  const stateRef = useRef(state)
  const [resetTimer, setResetTimer] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  const normalChoices = duviriCycle?.choices?.find((c) => c.category === 'normal')?.choices || []
  const spChoices = duviriCycle?.choices?.find((c) => c.category === 'hard')?.choices || []

  const normalString = Array.isArray(normalChoices) && normalChoices.length ? normalChoices.join(' · ') : 'Rotation unavailable'
  const spString = Array.isArray(spChoices) && spChoices.length ? spChoices.join(' · ') : 'Rotation unavailable'
  const currentMood = duviriCycle?.state || 'No signal'

  useEffect(() => {
    const saved = readStoredJson(CHECKLIST_KEY)
    const initial = restoreChecklist(saved)
    stateRef.current = initial
    setState(initial)
    saveChecklist(initial)
    setMounted(true)

    function tick() {
      const now = Date.now()
      setResetTimer(weeklyResetCountdown(now))
      const next = resetChecklistIfDue(stateRef.current, now)
      if (next !== stateRef.current) {
        stateRef.current = next
        setState(next)
        saveChecklist(next)
      }
    }
    tick()
    const interval = setInterval(tick, 1000)
    window.addEventListener('focus', tick)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', tick)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [])

  const updateState = (change: (current: ChecklistState) => ChecklistState) => {
    const next = change(resetChecklistIfDue(stateRef.current))
    stateRef.current = next
    setState(next)
    saveChecklist(next)
  }

  const toggleSingle = (key: 'teshin' | 'palladino' | 'clem' | 'maroo' | 'calendar1999' | 'circuitNormal' | 'circuitSP') => {
    updateState(current => ({ ...current, [key]: !current[key] }))
  }

  const toggleMulti = (key: 'netracells' | 'kahl' | 'descendia', index: number) => {
    updateState(current => {
      const updated = [...current[key]]
      updated[index] = !updated[index]
      return { ...current, [key]: updated }
    })
  }

  // Mood color helper for Duviri Moods

  return (
    <div data-card="weekly" className="nexus-panel bg-[#0b0c12] border border-[#232636] hover:border-teal-500/50 rounded-2xl p-3.5 md:p-4 font-sans shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-between">

      {/* Background Nebula & Starfield (Teal Reset Glow) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] bg-teal-600/15 blur-[100px] rounded-full transition-all duration-700 opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#ffffff60,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_120px_160px,#ffffff80,rgba(0,0,0,0)),radial-gradient(1px_1px_at_240px_90px,#ffffff50,rgba(0,0,0,0)),radial-gradient(2px_2px_at_330px_210px,#ffffff90,rgba(0,0,0,0))] opacity-80 animate-pulse" />
      </div>

      {/* Header */}
      <div className="nexus-card-header flex items-center justify-between pb-2.5 relative z-10">
        <div className="flex items-center gap-2">
          <CardEmblem kind="weekly" />
          <h2 className="text-xs font-black text-teal-400 uppercase tracking-widest">

            <span>Weekly Objectives</span>
          </h2>
        </div>

      </div>

      {/* Soft Fading Divider Line (Top) */}
      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent my-1" />

      <WeeklyAgenda state={mounted ? state : DEFAULT_STATE} resetTimer={resetTimer} mood={currentMood}
        normalRotation={normalString} steelRotation={spString} onSingle={toggleSingle} onMulti={toggleMulti} />


      {/* Content Checklist Area */}

      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent mt-1 mb-1.5" />

      {/* Footer */}

    </div>
  )
}
