'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Gem,
  Package,
  Info,
  Bell,
  BellOff,
} from 'lucide-react'
import { requestNotificationPermission, triggerAudioAlert } from '@/lib/alerts'

export default function Navbar() {
  const pathname = usePathname()
  const [alertsEnabled, setAlertsEnabled] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)

  const toggleAlerts = () => {
    if (!alertsEnabled) {
      requestNotificationPermission()
      triggerAudioAlert('night')
      setAlertsEnabled(true)
    } else {
      setAlertsEnabled(false)
    }
  }

  return (
    <header className="border-b border-[#1b2234]/60 bg-[#06080d]/40 backdrop-blur-xl sticky top-0 z-50 px-4 md:px-6 py-3 font-mono relative overflow-hidden">
      {/* Subtle Dark-Blue Foggy Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/3 -top-10 w-[400px] h-[80px] bg-blue-900/10 blur-[80px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3 relative z-10">
        {/* Brand & Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {!logoFailed ? (
            <img
              src="https://media.discordapp.net/attachments/1532945496476483585/1533896689000251402/icons8-warframe-480.png?ex=6a72281d&is=6a70d69d&hm=2d13b7c39ea29a67f17eee0c1aba55a68face3e7f4bc0d7f210903a67a3e25f3&=&format=webp&quality=lossless"
              alt="Warframe Logo"
              className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(59,130,246,0.6)] shrink-0 filter brightness-110 group-hover:scale-105 transition-transform"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <img
              src="/images/iconwf.png"
              alt="Warframe Logo Fallback"
              className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(59,130,246,0.6)] shrink-0 filter brightness-110 group-hover:scale-105 transition-transform"
            />
          )}

          <div className="flex items-center gap-2">
            <span className="text-sm md:text-base font-black text-white tracking-widest uppercase drop-shadow">
              WARFRAME
            </span>
            <span className="text-sm md:text-base font-black tracking-widest uppercase bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow">
              NEXUS
            </span>
          </div>
        </Link>

        {/* Navigation Links & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={toggleAlerts}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
              alertsEnabled
                ? 'bg-amber-950/80 text-amber-300 border-amber-700/60 shadow-md'
                : 'bg-[#121622]/60 text-zinc-400 border-[#1b2234] hover:text-white hover:border-zinc-700'
            }`}
            title="Toggle Audio/Browser Alerts"
          >
            {alertsEnabled ? (
              <>
                <Bell className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span>Alerts Active</span>
              </>
            ) : (
              <>
                <BellOff className="w-3.5 h-3.5 text-zinc-500" />
                <span>Muted</span>
              </>
            )}
          </button>

          <nav className="flex flex-wrap items-center gap-1.5 text-xs">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition border font-bold ${
                pathname === '/'
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md'
                  : 'bg-[#121622]/60 text-zinc-400 hover:text-white border-[#1b2234] hover:border-zinc-700'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Live
            </Link>

            <Link
              href="/riven-data"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition border font-bold ${
                pathname === '/riven-data'
                  ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-md'
                  : 'bg-[#121622]/60 text-zinc-400 hover:text-white border-[#1b2234] hover:border-zinc-700'
              }`}
            >
              <Gem className="w-3.5 h-3.5 text-emerald-400" /> Riven Data
            </Link>

            <Link
              href="/item-archive"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition border font-bold ${
                pathname === '/item-archive'
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md'
                  : 'bg-[#121622]/60 text-zinc-400 hover:text-white border-[#1b2234] hover:border-zinc-700'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-amber-400" /> Item Archive
            </Link>

            <Link
              href="/about"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition border font-bold ${
                pathname === '/about'
                  ? 'bg-zinc-200 text-zinc-950 border-zinc-300 shadow-md'
                  : 'bg-[#121622]/60 text-zinc-400 hover:text-white border-[#1b2234] hover:border-zinc-700'
              }`}
            >
              <Info className="w-3.5 h-3.5 text-zinc-400" /> About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}