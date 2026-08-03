'use client'

import { Radio, ExternalLink, Clock, Newspaper, ArrowUpRight } from 'lucide-react'

type NewsItem = {
  id?: string
  message?: string
  link?: string
  eta?: string
  startDate?: string
  date?: string
  imageLink?: string
  asString?: string
}

interface NewsCardProps {
  news?: NewsItem[]
}

export default function NewsCard({ news = [] }: NewsCardProps) {
  // Time-ago calculations
  const getTimeAgo = (dateStr?: string, eta?: string) => {
    if (eta) return eta

    if (dateStr) {
      const past = new Date(dateStr).getTime()
      if (isNaN(past)) return 'Recent'

      const diff = Date.now() - past
      if (diff <= 0) return 'Just now'

      const totalMins = Math.floor(diff / (1000 * 60))
      const totalHours = Math.floor(totalMins / 60)
      const days = Math.floor(totalHours / 24)

      if (days > 0) return `${days}d ago`
      if (totalHours > 0) return `${totalHours}h ago`
      return `${totalMins}m ago`
    }

    return 'Recent'
  }

  // Reverse so newest broadcasts are top, grab top 6 items
  const displayNews = [...news].reverse().slice(0, 6)
  const topArticle = displayNews[0]
  const secondaryNews = displayNews.slice(1)

  return (
    <div className="bg-[#0e0f15] border border-[#232636] rounded-2xl p-4 md:p-5 space-y-4 font-sans shadow-2xl relative overflow-hidden">
      {/* Top Newsroom Header Bar */}
      <div className="flex items-center justify-between border-b border-[#232636] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-red-950/60 border border-red-800/60 px-2.5 py-1 rounded-full">
            <Radio className="w-3 h-3 text-red-500 animate-pulse" />
            <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">
              LIVE INTEL
            </span>
          </div>
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider hidden sm:block">
            Orbiter Dispatch
          </h2>
        </div>

        <span className="text-xs text-zinc-400 font-medium">
          {displayNews.length} Active Transmissions
        </span>
      </div>

      {displayNews.length === 0 ? (
        <p className="text-xs text-zinc-500 py-10 text-center">
          No live broadcasts received from Lotus Command.
        </p>
      ) : (
        <div className="space-y-3">
          {/* Featured Breaking News Item (Top Spotlight) */}
          {topArticle && (
            <a
              href={topArticle.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group/hero relative bg-[#151722] border border-amber-500/30 hover:border-amber-500/80 rounded-xl p-4 transition-all duration-300 block space-y-2.5 shadow-lg overflow-hidden"
            >
              {/* Subtle Background Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 blur-3xl pointer-events-none group-hover/hero:bg-amber-500/10 transition-all" />

              <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40 font-mono">
                  <Newspaper className="w-3 h-3" /> Featured Headline
                </span>
                <span className="text-zinc-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  {getTimeAgo(topArticle.startDate || topArticle.date, topArticle.eta)}
                </span>
              </div>

              <div className="flex gap-4 items-center">
                {topArticle.imageLink && (
                  <div className="w-24 h-16 shrink-0 rounded-lg overflow-hidden border border-zinc-800 bg-black/50 hidden sm:block">
                    <img
                      src={topArticle.imageLink}
                      alt="News"
                      className="w-full h-full object-cover group-hover/hero:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm md:text-base font-black text-white group-hover/hero:text-amber-300 transition-colors line-clamp-2 leading-snug">
                    {topArticle.message || topArticle.asString || 'Warframe Transmission'}
                  </h3>
                </div>
                <ArrowUpRight className="w-5 h-5 text-amber-400 shrink-0 group-hover/hero:translate-x-0.5 group-hover/hero:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          )}

          {/* Secondary News Feed (Editorial Stream) */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {secondaryNews.map((item, idx) => {
              const headline = item.message || item.asString || 'Warframe Transmission'
              const newsLink = item.link || '#'
              const timeString = getTimeAgo(item.startDate || item.date, item.eta)

              return (
                <a
                  key={item.id || `news-${idx}`}
                  href={newsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#12131c] hover:bg-[#181a26] p-3 rounded-xl border border-[#232636] hover:border-zinc-700 transition-all block group/item"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80 shrink-0" />
                      <h4 className="text-xs font-semibold text-zinc-200 group-hover/item:text-white transition-colors truncate">
                        {headline}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        {timeString}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover/item:text-amber-400 transition-colors" />
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}