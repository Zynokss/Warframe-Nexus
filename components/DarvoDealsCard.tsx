'use client'

import { Tag, ShoppingBag, Clock, Sparkles } from 'lucide-react'
import { DailyDeal } from '@/types/warframe'

interface DarvoDealsCardProps {
  dailyDeals?: DailyDeal[]
}

export default function DarvoDealsCard({ dailyDeals = [] }: DarvoDealsCardProps) {
  const deal = dailyDeals[0]

  // Safe time remaining calculation with Days support
  const getTimeLeft = (expiry?: string, eta?: string) => {
    if (eta && !eta.includes('24h') && !eta.includes('25h')) return eta

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

  if (!deal) {
    return (
      <div className="bg-[#0b0c12] border border-[#232636] rounded-2xl p-3.5 md:p-4 font-sans shadow-2xl relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2.5 relative z-10">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-black text-emerald-400 uppercase tracking-widest">
              Darvo's Deals
            </h2>
          </div>
        </div>
        <p className="text-xs text-zinc-400 py-6 text-center font-medium relative z-10">
          Darvo is currently out of stock.
        </p>
      </div>
    )
  }

  // Stock calculations
  const totalStock = deal.total || 1
  const soldStock = deal.sold || 0
  const remainingStock = Math.max(0, totalStock - soldStock)
  const percentLeft = Math.round((remainingStock / totalStock) * 100)

  return (
    <div className="bg-[#0b0c12] border border-[#232636] hover:border-emerald-500/50 rounded-2xl p-3.5 md:p-4 font-sans shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-between">
      
      {/* Full-Card Foggy Nebula & Starfield Background (Emerald Merchant Theme) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] bg-emerald-600/15 blur-[100px] rounded-full transition-all duration-700 opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#ffffff60,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_120px_160px,#ffffff80,rgba(0,0,0,0)),radial-gradient(1px_1px_at_240px_90px,#ffffff50,rgba(0,0,0,0)),radial-gradient(2px_2px_at_330px_210px,#ffffff90,rgba(0,0,0,0))] opacity-80 animate-pulse" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 relative z-10">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-400 animate-pulse" />
          <h2 className="text-xs font-black text-emerald-400 uppercase tracking-widest">
            Darvo's Deals
          </h2>
        </div>

        <span className="bg-emerald-950/70 text-emerald-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-700/60 shadow-inner flex items-center gap-1">
          <Clock className="w-3 h-3 text-emerald-400" />
          {getTimeLeft(deal.expiry, deal.eta)}
        </span>
      </div>

      {/* Soft Fading Divider Line (Top) */}
      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent my-1" />

      {/* Deal Card Body */}
      <div className="bg-[#12131c]/80 backdrop-blur-md p-3 rounded-xl border border-[#232636] hover:border-zinc-500 transition space-y-3 relative z-10 my-1 shadow-sm">
        {/* Item Title & Discount Tag */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[9px] text-zinc-400 uppercase tracking-widest block font-mono font-bold">
              DAILY FEATURED ITEM
            </span>
            <h3 className="text-xs font-bold text-zinc-100 truncate flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{deal.item}</span>
            </h3>
          </div>

          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono font-black px-2 py-0.5 rounded-md border border-emerald-500/40 shrink-0 shadow-inner">
            -{deal.discount}%
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline justify-between bg-[#0a0b0e]/80 p-2.5 rounded-lg border border-zinc-800/80">
          <div className="space-x-2">
            <span className="text-sm font-mono font-black text-amber-400">
              {deal.salePrice} <span className="text-xs font-semibold text-zinc-400">PLT</span>
            </span>
            <span className="line-through text-xs text-zinc-500 font-mono font-semibold">
              {deal.originalPrice}
            </span>
          </div>

          <span className="text-[10px] text-zinc-300 font-mono font-semibold">
            {remainingStock} / {totalStock} Available
          </span>
        </div>

        {/* Stock Bar */}
        <div className="space-y-1">
          <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
            <div
              className={`h-full transition-all duration-500 ${
                percentLeft < 20 ? 'bg-red-500' : percentLeft < 50 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${percentLeft}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400 font-bold">
            <span>STOCK LEVEL</span>
            <span className={percentLeft < 20 ? 'text-red-400' : 'text-emerald-400'}>
              {percentLeft}% REMAINING
            </span>
          </div>
        </div>
      </div>

      {/* Soft Fading Divider Line (Bottom) */}
      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent mt-1 mb-1.5" />

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 relative z-10 px-1">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400" /> Corpus Black Market
        </span>
        <span className="font-bold text-zinc-300">Special Discount</span>
      </div>

    </div>
  )
}