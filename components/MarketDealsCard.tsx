'use client'

import MarketManifest from '@/components/MarketManifest'
import CardEmblem from '@/components/CardEmblem'
import { useState } from 'react';
import { Eye, Sparkles } from 'lucide-react';
import { FlashSale } from '@/types/warframe';

type FlashSaleItem = FlashSale & {
  id?: string
  expiry?: string
  eta?: string
  isPopular?: boolean
  salePrice?: number
  originalPrice?: number
  premiumOverride?: number
  platinum?: number
  credits?: number
  isCredits?: boolean
}

interface MarketDealsCardProps {
  flashSales?: FlashSaleItem[]
}

export default function MarketDealsCard({ flashSales = [] }: MarketDealsCardProps) {
  const [showCredits, setShowCredits] = useState(false)

  // Safe time remaining calculation with Days support
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

  // Helper function to resolve price and currency properly
  const getDealPricing = (sale: FlashSaleItem) => {
    if (sale.isCredits || (sale.credits && sale.credits > 0)) {
      return {
        amount: sale.credits || 0,
        isCredit: true,
      }
    }

    const platCandidates = [
      sale.salePrice,
      sale.premiumOverride,
      sale.platinum,
      sale.originalPrice,
    ].filter((p): p is number => typeof p === 'number' && p > 0)

    const platPrice = platCandidates.length > 0 ? platCandidates[0] : 0

    if (platPrice === 0 && sale.credits) {
      return {
        amount: sale.credits,
        isCredit: true,
      }
    }

    return {
      amount: platPrice,
      isCredit: false,
    }
  }

  // Filter out credit / 0 plat items unless showCredits is enabled
  const filteredSales = flashSales.filter((sale) => {
    if (showCredits) return true
    const { amount, isCredit } = getDealPricing(sale)
    return !isCredit && amount > 0
  })

  return (
    <div data-card="market" className="nexus-panel bg-[#0b0c12] border border-[#232636] hover:border-cyan-500/50 rounded-2xl p-3.5 md:p-4 font-sans shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-between">

      {/* Background Nebula & Starfield (Cyan Platinum Glow) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] bg-cyan-500/15 blur-[100px] rounded-full transition-all duration-700 opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#ffffff60,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_120px_160px,#ffffff80,rgba(0,0,0,0)),radial-gradient(1px_1px_at_240px_90px,#ffffff50,rgba(0,0,0,0)),radial-gradient(2px_2px_at_330px_210px,#ffffff90,rgba(0,0,0,0))] opacity-80 animate-pulse" />
      </div>

      {/* Header & Controls */}
      <div className="nexus-card-header flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <CardEmblem kind="market" />
          <h2 className="text-xs font-black text-cyan-400 uppercase tracking-widest">
            Market Flash Sales
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Show Credit Items Toggle */}
          <button
            aria-pressed={showCredits}
            onClick={() => setShowCredits(!showCredits)}
            className={`flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-xl border font-mono font-bold transition cursor-pointer ${
              showCredits
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 shadow-md'
                : 'bg-[#12131c]/85 text-zinc-400 border-[#232636] hover:text-white'
            }`}
            title="Toggle Credit-only and 0 Plat items visibility"
          >
            <Eye className="w-3 h-3" />
            <span>CREDITS</span>
          </button>

          <span className="bg-[#12131c]/85 text-cyan-300 text-[10px] font-mono font-bold px-2 py-1 rounded-xl border border-[#232636] shadow-inner">
            {filteredSales.length}
          </span>
        </div>
      </div>

      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent my-1" />

      <MarketManifest emptyMessage={showCredits ? 'No active Market Flash Sales.' : 'No active Platinum Flash Sales.'}
        deals={filteredSales.map((sale, idx) => {
          const pricing = getDealPricing(sale)
          return { id: sale.id || `sale-${idx}`, item: sale.item || 'Market item', price: pricing.amount, currency: pricing.isCredit ? 'CREDITS' as const : 'PLT' as const,
            originalPrice: sale.originalPrice, discount: sale.discount || 0, popular: sale.isPopular || (sale.discount || 0) >= 50,
            timer: getTimeLeft(sale.expiry, sale.eta) }
        })} />

      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent mt-1 mb-1.5" />

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 relative z-10 px-1">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> In-Game Market Stream
        </span>
        <span className="font-bold text-zinc-300">{filteredSales.length} Active Deals</span>
      </div>

    </div>
  )
}
