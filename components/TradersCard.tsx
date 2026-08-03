'use client'

import { useState } from 'react'
import { Landmark, Clock, MapPin, Package, ShieldCheck, Sparkles } from 'lucide-react'
import { VoidTrader, DailyDeal, Arbitration } from '@/types/warframe'

type VoidTraderItem = {
  item?: string
  ducats?: number
  credits?: number
}

type ExtendedVoidTrader = VoidTrader & {
  inventory?: VoidTraderItem[]
  eta?: string
  expiry?: string
  activation?: string
}

interface TradersCardProps {
  voidTrader?: ExtendedVoidTrader
  dailyDeals?: DailyDeal[]
  arbitration?: Arbitration & {
    node?: string
    type?: string
    enemy?: string
    expiry?: string
    eta?: string
  }
}

export default function TradersCard({ voidTrader, arbitration }: TradersCardProps) {
  const [activeTab, setActiveTab] = useState<'BARO' | 'ARBITRATION'>('BARO')

  // Precise UTC countdown calculator with max threshold guard
  const getPreciseCountdown = (targetDateString?: string, fallbackEta?: string) => {
    if (!targetDateString) return fallbackEta || 'Active'

    const targetTime = new Date(targetDateString).getTime()
    if (isNaN(targetTime)) return fallbackEta || 'Active'

    const diff = targetTime - Date.now()

    if (diff <= 0 || diff > 1000 * 60 * 60 * 24 * 30) {
      return 'Active'
    }

    const totalSecs = Math.floor(diff / 1000)
    const days = Math.floor(totalSecs / (3600 * 24))
    const hours = Math.floor((totalSecs % (3600 * 24)) / 3600)
    const mins = Math.floor((totalSecs % 3600) / 60)

    if (days > 0) return `${days}d ${hours}h ${mins}m`
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
  }

  const isBaroActive = voidTrader?.active ?? false
  const baroTargetDate = isBaroActive ? voidTrader?.expiry : voidTrader?.activation

  // Check if Arbitration node data is valid
  const hasValidArbitration =
    arbitration &&
    arbitration.node &&
    !arbitration.node.includes('Unknown') &&
    !arbitration.node.startsWith('SolNode')

  return (
    <div className="bg-[#0b0c12] border border-[#232636] hover:border-amber-500/50 rounded-2xl p-3.5 md:p-4 font-sans shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-between">
      
      {/* Background Nebula & Starfield (Gold/Amber Trader Glow) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] bg-amber-500/15 blur-[100px] rounded-full transition-all duration-700 opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#ffffff60,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_120px_160px,#ffffff80,rgba(0,0,0,0)),radial-gradient(1px_1px_at_240px_90px,#ffffff50,rgba(0,0,0,0)),radial-gradient(2px_2px_at_330px_210px,#ffffff90,rgba(0,0,0,0))] opacity-80 animate-pulse" />
      </div>

      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-amber-400 animate-pulse" />
          <h2 className="text-xs font-black text-amber-400 uppercase tracking-widest">
            Special Vendors
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-[#12131c]/85 backdrop-blur-md p-1 rounded-xl border border-[#232636] text-[10px]">
          <button
            onClick={() => setActiveTab('BARO')}
            className={`px-2.5 py-0.5 rounded-lg transition font-mono font-bold cursor-pointer ${
              activeTab === 'BARO'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-extrabold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            BARO KI'TEER
          </button>
          <button
            onClick={() => setActiveTab('ARBITRATION')}
            className={`px-2.5 py-0.5 rounded-lg transition font-mono font-bold cursor-pointer ${
              activeTab === 'ARBITRATION'
                ? 'bg-red-500 text-zinc-950 shadow-md font-extrabold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ARBITRATION
          </button>
        </div>
      </div>

      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent my-1" />

      {/* Content Area */}
      <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar relative z-10 my-1">
        {/* Baro Ki'Teer Tab */}
        {activeTab === 'BARO' && (
          <div className="space-y-2.5">
            {/* Location & Status Banner */}
            <div className="bg-[#12131c]/80 backdrop-blur-md p-3 rounded-xl border border-[#232636] hover:border-zinc-500 transition space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Relay Location
                </span>
                <span
                  className={`text-[9px] font-mono font-black px-2 py-0.5 rounded border uppercase shadow-inner ${
                    isBaroActive
                      ? 'bg-emerald-950/85 text-emerald-300 border-emerald-700/60 animate-pulse'
                      : 'bg-zinc-900/80 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {isBaroActive ? 'Arrived' : 'In Transit'}
                </span>
              </div>

              <div className="bg-[#0a0b0e]/70 p-2.5 rounded-xl border border-zinc-800/80 flex items-center justify-between shadow-inner">
                <span className="text-xs font-bold text-zinc-100 truncate pr-2">
                  {voidTrader?.location || 'Kronia Relay (Saturn)'}
                </span>
                <span className="text-[10px] font-mono text-amber-300 font-bold shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  {getPreciseCountdown(baroTargetDate, voidTrader?.eta)}
                </span>
              </div>
            </div>

            {/* Baro Inventory (if Arrived) */}
            {isBaroActive && voidTrader?.inventory && voidTrader.inventory.length > 0 ? (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold tracking-wider block px-1">
                  Available Manifest ({voidTrader.inventory.length})
                </span>
                {voidTrader.inventory.map((item, idx) => (
                  <div
                    key={`baro-item-${idx}`}
                    className="bg-[#12131c]/80 backdrop-blur-md p-2.5 rounded-xl border border-[#232636] hover:border-zinc-500 transition flex items-center justify-between text-xs shadow-sm"
                  >
                    <span className="font-bold text-zinc-200 truncate pr-2 flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      {item.item || 'Void Wares'}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] shrink-0 font-mono font-bold">
                      {item.ducats ? <span className="text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">{item.ducats} DUCATS</span> : null}
                      {item.credits ? <span className="text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">{item.credits.toLocaleString()} CR</span> : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400 py-6 text-center bg-[#12131c]/50 rounded-xl border border-[#232636] font-medium">
                Void Trader manifest is classified until arrival.
              </p>
            )}
          </div>
        )}

        {/* Arbitration Tab */}
        {activeTab === 'ARBITRATION' && (
          <div className="space-y-2.5">
            <div className="bg-[#12131c]/80 backdrop-blur-md p-3 rounded-xl border border-red-900/40 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                  Arbitration Honor Mission
                </span>
                <span className="text-[10px] font-mono text-zinc-300 font-bold flex items-center gap-1 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/50">
                  <Clock className="w-3 h-3 text-red-400" />
                  {hasValidArbitration ? getPreciseCountdown(arbitration?.expiry, arbitration?.eta) : 'Hourly Reset'}
                </span>
              </div>

              <div className="bg-[#0a0b0e]/70 p-3 rounded-xl border border-zinc-800/80 space-y-1.5 shadow-inner">
                {hasValidArbitration ? (
                  <>
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span className="text-zinc-100 uppercase">{arbitration?.type || 'Arbitration Sector'}</span>
                      <span className="text-amber-300 text-[10px] uppercase">{arbitration?.enemy || 'Corpus'}</span>
                    </div>
                    <p className="text-xs text-zinc-300 font-medium">{arbitration?.node}</p>
                  </>
                ) : (
                  <div className="py-4 text-center space-y-1">
                    <p className="text-xs font-bold text-zinc-200">Arbitration Telemetry Syncing...</p>
                    <p className="text-[10px] text-zinc-400 font-mono">Node details will update when live match data rotates.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent mt-1 mb-1.5" />

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 relative z-10 px-1">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Special Operations
        </span>
        <span className="font-bold text-zinc-300">{activeTab === 'BARO' ? 'Void Trader Stream' : 'Honor Vanguard'}</span>
      </div>

    </div>
  )
}