'use client'

import VendorManifest from '@/components/VendorManifest'
import CardEmblem from '@/components/CardEmblem'
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { VoidTrader, DailyDeal, Arbitration } from '@/types/warframe';

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
    <div data-card="traders" className="nexus-panel bg-[#0b0c12] border border-[#232636] hover:border-amber-500/50 rounded-2xl p-3.5 md:p-4 font-sans shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-between">

      {/* Background Nebula & Starfield (Gold/Amber Trader Glow) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] bg-amber-500/15 blur-[100px] rounded-full transition-all duration-700 opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#ffffff60,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_120px_160px,#ffffff80,rgba(0,0,0,0)),radial-gradient(1px_1px_at_240px_90px,#ffffff50,rgba(0,0,0,0)),radial-gradient(2px_2px_at_330px_210px,#ffffff90,rgba(0,0,0,0))] opacity-80 animate-pulse" />
      </div>

      {/* Header & Tabs */}
      <div className="nexus-card-header flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <CardEmblem kind="traders" />
          <h2 className="text-xs font-black text-amber-400 uppercase tracking-widest">
            Special Vendors
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="nexus-selector flex items-center bg-[#12131c]/85 backdrop-blur-md p-1 rounded-xl border border-[#232636] text-[10px]">
          <button
            aria-pressed={activeTab === 'BARO'}
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
            aria-pressed={activeTab === 'ARBITRATION'}
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

      <VendorManifest mode={activeTab} active={isBaroActive} location={voidTrader?.location}
        timer={activeTab === 'BARO' ? getPreciseCountdown(baroTargetDate, voidTrader?.eta) : hasValidArbitration ? getPreciseCountdown(arbitration?.expiry, arbitration?.eta) : 'Hourly reset'}
        inventory={voidTrader?.inventory} validArbitration={Boolean(hasValidArbitration)} arbitration={arbitration} />

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
