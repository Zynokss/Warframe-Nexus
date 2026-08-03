'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Info, Terminal, Cpu, Database, Copy, Check, Share2 } from 'lucide-react'

interface PlatformTag {
  platform: string
  suffix: string
  example: string
}

const PLATFORM_TAGS: PlatformTag[] = [
  { platform: 'PC / Cross-Play', suffix: '#000', example: 'Tenno#000' },
  { platform: 'PlayStation', suffix: '#100', example: 'Tenno#100' },
  { platform: 'Xbox', suffix: '#200', example: 'Tenno#200' },
  { platform: 'Nintendo Switch', suffix: '#300', example: 'Tenno#300' },
]

export default function AboutPage() {
  const [copiedSuffix, setCopiedSuffix] = useState<string | null>(null)

  const handleCopy = (suffix: string) => {
    navigator.clipboard.writeText(suffix)
    setCopiedSuffix(suffix)
    setTimeout(() => setCopiedSuffix(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 font-mono">
      <Navbar />

      <main className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wider uppercase flex items-center gap-2">
            <Info className="w-6 h-6 text-sky-400" /> About WARFRAME // NEXUS
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            System architecture, API telemetry sources, and platform identifier formatting tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Architecture Overview */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded p-4 space-y-4">
            <h2 className="text-sm font-bold text-zinc-200 border-b border-zinc-800 pb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-red-500" /> Telemetry Architecture
            </h2>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="bg-zinc-950 p-3 rounded border border-zinc-800 space-y-1">
                <div className="text-white font-bold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-amber-400" /> Data Provider
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Real-time telemetry fetched via the Warframe Stat API (`api.warframestat.us`), mirrored directly from Digital Extremes official WorldState endpoints.
                </p>
              </div>

              <div className="bg-zinc-950 p-3 rounded border border-zinc-800 space-y-1">
                <div className="text-white font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Polling & Cache Policy
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Serverless proxy routes revalidate payload responses every 30 seconds to prevent API rate limiting while maintaining low-latency timer accuracy.
                </p>
              </div>
            </div>
          </div>

          {/* Platform Suffix Tool */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded p-4 space-y-4">
            <h2 className="text-sm font-bold text-zinc-200 border-b border-zinc-800 pb-2 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-400" /> Cross-Platform Suffix Format
            </h2>

            <div className="space-y-2 text-xs">
              {PLATFORM_TAGS.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-950/80 p-2.5 rounded border border-zinc-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-zinc-200">{p.platform}</div>
                    <div className="text-[10px] text-zinc-500">
                      Example: <span className="text-zinc-300 font-bold">{p.example}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(p.suffix)}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded text-xs text-zinc-300 transition"
                  >
                    {copiedSuffix === p.suffix ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> {p.suffix}
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}