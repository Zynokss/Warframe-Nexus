'use client'

import { useState } from 'react'
import { ShoppingCart, Flame, Clock, Coins, Eye, Sparkles } from 'lucide-react'
import { FlashSale } from '@/types/warframe'

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
    <div className="bg-[#0b0c12] border border-[#232636] hover:border-cyan-500/50 rounded-2xl p-3.5 md:p-4 font-sans shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-between">
      
      {/* Background Nebula & Starfield (Cyan Platinum Glow) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] bg-cyan-500/15 blur-[100px] rounded-full transition-all duration-700 opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#ffffff60,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_120px_160px,#ffffff80,rgba(0,0,0,0)),radial-gradient(1px_1px_at_240px_90px,#ffffff50,rgba(0,0,0,0)),radial-gradient(2px_2px_at_330px_210px,#ffffff90,rgba(0,0,0,0))] opacity-80 animate-pulse" />
      </div>

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h2 className="text-xs font-black text-cyan-400 uppercase tracking-widest">
            Market Flash Sales
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Show Credit Items Toggle */}
          <button
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

      {/* Items List */}
      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar relative z-10 my-1">
        {filteredSales.length === 0 ? (
          <p className="text-xs text-zinc-400 py-6 text-center font-medium">
            {showCredits ? 'No active Market Flash Sales.' : 'No active Platinum Flash Sales.'}
          </p>
        ) : (
          filteredSales.map((sale, idx) => {
            const discountPercent = sale.discount || 0
            const isPopular = sale.isPopular || discountPercent >= 50
            const { amount, isCredit } = getDealPricing(sale)

            return (
              <div
                key={sale.id || `sale-${idx}`}
                className="bg-[#12131c]/80 backdrop-blur-md p-3 rounded-xl border border-[#232636] hover:border-zinc-500 transition flex items-center justify-between gap-3 group/row shadow-sm relative overflow-hidden"
              >
                {/* Left Side: Item Details & Pricing */}
                <div className="min-w-0 space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-zinc-100 uppercase tracking-wide truncate group-hover/row:text-cyan-300 transition">
                      {sale.item}
                    </span>
                    {isPopular && (
                      <span className="text-[9px] font-mono font-extrabold text-amber-300 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-700/60 shrink-0 flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5 text-amber-400" />
                        HOT
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono">
                    {isCredit ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-emerald-400" />
                        {amount.toLocaleString()} CREDITS
                      </span>
                    ) : (
                      <span className="text-cyan-300 font-extrabold tracking-wide">
                        {amount} <span className="text-[10px] text-zinc-400">PLT</span>
                      </span>
                    )}

                    {sale.originalPrice && sale.originalPrice !== amount ? (
                      <span className="line-through text-zinc-600 font-semibold text-[10px]">
                        {sale.originalPrice} PLT
                      </span>
                    ) : null}
                  </div>

                  <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1 pt-0.5">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{getTimeLeft(sale.expiry, sale.eta)}</span>
                  </div>
                </div>

                {/* Right Side: Discount Badge */}
                {discountPercent > 0 && (
                  <div className="shrink-0 bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-mono font-black px-2.5 py-1.5 rounded-xl shadow-inner">
                    -{discountPercent}%
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

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