'use client'

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldAlert, RefreshCw, SlidersHorizontal, Check, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import { readStoredBooleanMap, writeStoredJson } from '@/lib/browser-storage';
import { normalizeArchimedeas } from '@/lib/archimedea';
import { WorldState } from '@/types/warframe';

import Navbar from '@/components/Navbar'
import OrokinHero from '@/components/OrokinHero'
import EnvironmentsCard from '@/components/EnvironmentsCard'
import FissuresCard from '@/components/FissuresCard'
import InvasionsCard from '@/components/InvasionsCard'
import VoidStormsCard from '@/components/VoidStormsCard'
import DarvoDealsCard from '@/components/DarvoDealsCard'
import ConstructionCard from '@/components/ConstructionCard'
import MarketDealsCard from '@/components/MarketDealsCard'
import EndgameCard from '@/components/EndgameCard'
import WeeklyResetCard from '@/components/WeeklyResetCard'
import BountiesCard from '@/components/BountiesCard'
import TradersCard from '@/components/TradersCard'
import NewsCard from '@/components/NewsCard'
import ConclaveCard from '@/components/ConclaveCard'
import NightwaveCard from '@/components/NightwaveCard'

async function fetchWorldState({ signal }: { signal: AbortSignal }): Promise<WorldState> {
  const res = await fetch('/api/worldstate', {
    signal: AbortSignal.any([signal, AbortSignal.timeout(20000)]),
  })
  if (!res.ok) {
    const details = await res.json().catch(() => null)
    throw new Error(details?.error || `Telemetry request failed (HTTP ${res.status})`)
  }
  return res.json()
}

const SIDEBAR_CARDS = [
  { id: 'cycles', label: 'Cycle Timers' },
  { id: 'endgame', label: 'Sorties & Archon Hunts' },
  { id: 'weeklyReset', label: 'Weekly Resets & Duviri' },
  { id: 'traders', label: 'Void Trader & Vendors' },
  { id: 'news', label: 'News & Broadcasts' },
]

const MAIN_CARDS = [
  { id: 'fissuresAndStorms', label: 'Void Fissures & Void Storms' },
  { id: 'invasions', label: 'Faction Invasions' },
  { id: 'construction', label: 'Construction Progress' },
  { id: 'bounties', label: 'Open World Bounties' },
  { id: 'nightwave', label: 'Nightwave Acts' },
  { id: 'marketDeals', label: 'Market Flash Sales' },
  { id: 'darvoDeals', label: "Darvo's Deals" },
  { id: 'conclave', label: 'Conclave Challenges' },
]

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false)
  const customizeDialog = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isCustomizeOpen) return
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const dialog = customizeDialog.current
    dialog?.querySelector<HTMLButtonElement>('button')?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsCustomizeOpen(false)
      if (event.key !== 'Tab' || !dialog) return
      const buttons = dialog.querySelectorAll<HTMLButtonElement>('button')
      const first = buttons[0]
      const last = buttons[buttons.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [isCustomizeOpen])

  // Image fallback states

  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>(() =>
    [...SIDEBAR_CARDS, ...MAIN_CARDS].reduce((acc, card) => ({ ...acc, [card.id]: true }), {})
  )
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setMounted(true)
    const savedVisibility = readStoredBooleanMap('warframe_hub_visible_cards')
    const savedCollapses = readStoredBooleanMap('warframe_hub_collapsed_cards')
    if (savedVisibility) setVisibleCards(savedVisibility)
    if (savedCollapses) setCollapsedCards(savedCollapses)
  }, [])

  const toggleCardVisibility = (id: string) => {
    const updated = { ...visibleCards, [id]: !visibleCards[id] }
    setVisibleCards(updated)
    writeStoredJson('warframe_hub_visible_cards', updated)
  }

  const toggleCardCollapse = (id: string) => {
    const updated = { ...collapsedCards, [id]: !collapsedCards[id] }
    setCollapsedCards(updated)
    writeStoredJson('warframe_hub_collapsed_cards', updated)
  }

  const { data, error, isLoading, refetch, isFetching } = useQuery<WorldState>({
    queryKey: ['worldstate'],
    queryFn: fetchWorldState,
    retry: false,
    refetchInterval: 15000,
  })

  const worldStateAny = data as any

  const renderCollapsibleSection = (id: string, title: string, component: React.ReactNode) => {
    const isCollapsed = collapsedCards[id]
    return (
      <div id={`module-${id}`} className="nexus-module space-y-2">
        <div className="flex items-center justify-between px-1">
          <button
            aria-expanded={!isCollapsed}
            onClick={() => toggleCardCollapse(id)}
            className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 hover:text-white transition uppercase tracking-widest cursor-pointer group/title"
          >
            <span>{title}</span>
            <span className="p-1 rounded bg-[#12131c] border border-zinc-800 group-hover/title:border-amber-500/50 transition">
              {isCollapsed ? <ChevronDown className="w-3.5 h-3.5 text-amber-400" /> : <ChevronUp className="w-3.5 h-3.5 text-amber-400" />}
            </span>
          </button>
        </div>
        <div className={isCollapsed ? 'hidden' : 'block transition-all duration-300'}>
          {component}
        </div>
      </div>
    )
  }

  return (
    <div className="nexus-page min-h-screen bg-[#06080d] text-zinc-200 relative overflow-x-hidden font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0c101d] via-[#07090e] to-[#040507] opacity-90 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#ffffff30,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_120px_160px,#ffffff40,rgba(0,0,0,0))] opacity-40 pointer-events-none" />

      <Navbar />

      <main className="nexus-dashboard p-4 md:p-6 space-y-6 relative z-10 max-w-[1920px] mx-auto">
        <OrokinHero
          onCustomize={() => setIsCustomizeOpen(true)}
          onSync={() => refetch()}
          isFetching={mounted && isFetching}
          status={!mounted || isLoading ? 'connecting' : error ? 'offline' : 'connected'}
          fissureCount={data?.fissures?.filter(f => !f.isStorm).length}
          invasionCount={data?.invasions?.length}
        />

        <div className="nexus-section-heading">
          <div><span className="nexus-eyebrow">02 / LIVE INTELLIGENCE</span><h2>Origin System <span>overview</span></h2></div>
          <span className="nexus-section-note">PC · ENGLISH · 15 SECOND SYNC</span>
        </div>
        {/* Dashboard Grid Content */}
        {!mounted || isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4 text-zinc-500 bg-[#0b0e17]/50 rounded-2xl border border-[#1b1e2b]">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-12 h-12 rounded-full border-2 border-amber-500/20 animate-ping" />
              <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
            </div>
            <p className="text-xs uppercase tracking-widest text-zinc-400 font-mono font-bold">Establishing Link to Warframe API...</p>
          </div>
        ) : error && !data ? (
          <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl text-red-400 text-xs flex items-center gap-3 backdrop-blur shadow-xl font-mono">
            <ShieldAlert className="w-5 h-5 shrink-0 text-red-500" />
            <div className="flex-1"><p>Live telemetry is unavailable.</p><p className="mt-1 text-red-300">{error.message}</p></div>
            <button type="button" onClick={() => refetch()} disabled={isFetching} className="border border-red-800 px-3 py-2 shrink-0 disabled:opacity-50 cursor-pointer">{isFetching ? 'Retrying…' : 'Try again'}</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <aside className="lg:col-span-4 xl:col-span-3 space-y-4">
              {visibleCards['cycles'] !== false &&
                renderCollapsibleSection('cycles', 'Cycle Timers', (
                  <EnvironmentsCard
                    cetusCycle={data?.cetusCycle}
                    earthCycle={worldStateAny?.earthCycle}
                    vallisCycle={data?.vallisCycle}
                    cambionCycle={worldStateAny?.cambionCycle}
                    zarimanCycle={worldStateAny?.zarimanCycle}
                  />
                ))}
              {visibleCards['endgame'] !== false &&
                renderCollapsibleSection('endgame', 'Sorties & Archon Hunts', (
                  <EndgameCard
                    sortie={data?.sortie}
                    archonHunt={data?.archonHunt}
                    archimedeas={normalizeArchimedeas(data?.archimedeas, data?.deepArchimedea)}
                  />
                ))}
              {visibleCards['weeklyReset'] !== false &&
                renderCollapsibleSection('weeklyReset', 'Weekly Resets & Duviri', (
                  <WeeklyResetCard duviriCycle={worldStateAny?.duviriCycle} />
                ))}
              {visibleCards['traders'] !== false &&
                renderCollapsibleSection('traders', 'Void Trader & Vendors', (
                  <TradersCard
                    voidTrader={data?.voidTrader}
                    dailyDeals={data?.dailyDeals}
                    arbitration={data?.arbitration}
                  />
                ))}
              {visibleCards['news'] !== false &&
                renderCollapsibleSection('news', 'News & Broadcasts', (
                  <NewsCard news={data?.news || []} />
                ))}
            </aside>

            <div className="lg:col-span-8 xl:col-span-9 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleCards['fissuresAndStorms'] !== false && (
                  <div className="md:col-span-2 grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {renderCollapsibleSection('fissures', 'Void Fissures', (
                      <FissuresCard fissures={data?.fissures || []} />
                    ))}
                    {renderCollapsibleSection('voidStorms', 'Void Storms', (
                      <VoidStormsCard fissures={data?.fissures || []} />
                    ))}
                  </div>
                )}
                {visibleCards['invasions'] !== false && (
                  <div className="md:col-span-2">
                    {renderCollapsibleSection('invasions', 'Invasions', (
                      <InvasionsCard invasions={data?.invasions || []} />
                    ))}
                  </div>
                )}
                {visibleCards['construction'] !== false && (
                  <div className="md:col-span-2">
                    {renderCollapsibleSection('construction', 'Construction Progress', (
                      <ConstructionCard progress={data?.constructionProgress} />
                    ))}
                  </div>
                )}
                {visibleCards['bounties'] !== false && (
                  <div className="md:col-span-2">
                    {renderCollapsibleSection('bounties', 'Open World Bounties', (
                      <BountiesCard syndicateMissions={data?.syndicateMissions || []} />
                    ))}
                  </div>
                )}
                {visibleCards['nightwave'] !== false && (
                  <div className="md:col-span-2">
                    {renderCollapsibleSection('nightwave', 'Nightwave Acts', (
                      <NightwaveCard nightwave={worldStateAny?.nightwave} />
                    ))}
                  </div>
                )}
                {visibleCards['marketDeals'] !== false &&
                  renderCollapsibleSection('marketDeals', 'Market Flash Sales', (
                    <MarketDealsCard flashSales={data?.flashSales || []} />
                  ))}
                {visibleCards['darvoDeals'] !== false &&
                  renderCollapsibleSection('darvoDeals', "Darvo's Deals", (
                    <DarvoDealsCard dailyDeals={data?.dailyDeals || []} />
                  ))}
                {visibleCards['conclave'] !== false && (
                  <div className="md:col-span-2">
                    {renderCollapsibleSection('conclave', 'Conclave Challenges', (
                      <ConclaveCard conclaveChallenges={worldStateAny?.conclaveChallenges || []} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Customize Modal */}
      {isCustomizeOpen && (
        <div ref={customizeDialog} role="dialog" aria-modal="true" aria-label="Configure dashboard modules" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0e17] border border-amber-900/40 rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl font-mono">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Configure Dashboard Modules</span>
              </h3>
              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-xl border border-zinc-800 hover:border-zinc-700 cursor-pointer"
              >
                ✕ CLOSE
              </button>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Toggle specific tracker cards on or off to tailor your World State view.
            </p>
            <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
              {[...SIDEBAR_CARDS, ...MAIN_CARDS].map((card) => {
                const isVisible = visibleCards[card.id] !== false
                return (
                  <div
                    key={card.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition ${
                      isVisible
                        ? 'bg-amber-950/25 border-amber-800/40 text-amber-300'
                        : 'bg-[#12131c] border-zinc-900 text-zinc-500'
                    }`}
                  >
                    <span className="truncate">{card.label}</span>
                    <button
                      aria-label={`Toggle ${card.label}`}
                      aria-pressed={isVisible}
                      onClick={() => toggleCardVisibility(card.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition shrink-0 cursor-pointer ${
                        isVisible
                          ? 'bg-amber-500 border-amber-400 text-zinc-950 font-black'
                          : 'bg-[#0a0b0e] border-zinc-800 text-transparent'
                      }`}
                    >
                      {isVisible ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-600" />}
                    </button>
                  </div>
                )
              })}
            </div>
            <div className="pt-2 border-t border-zinc-800/80 flex justify-end">
              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs rounded-xl transition cursor-pointer"
              >
                SAVE & CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
