'use client'

import DispatchFeed from '@/components/DispatchFeed'
import CardEmblem from '@/components/CardEmblem'

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

  return (
    <div data-card="news" className="nexus-panel bg-[#0e0f15] border border-[#232636] rounded-2xl p-4 md:p-5 space-y-4 font-sans shadow-2xl relative overflow-hidden">
      {/* Top Newsroom Header Bar */}
      <div className="nexus-card-header flex items-center justify-between border-b border-[#232636] pb-3">
        <div className="flex items-center gap-2.5">
          <CardEmblem kind="news" />

          <span className="news-header-label">Orbiter Dispatch</span>
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider hidden sm:block">
            Orbiter Dispatch
          </h2>
        </div>

        <span className="text-xs text-zinc-400 font-medium">
          {displayNews.length} Active Transmissions
        </span>
      </div>

      <DispatchFeed items={displayNews.map((item, idx) => ({ id: item.id || `dispatch-${idx}`,
        title: item.message || item.asString || 'Warframe Transmission', link: item.link || '#',
        time: getTimeAgo(item.startDate || item.date, item.eta), image: item.imageLink }))} />

    </div>
  )
}
