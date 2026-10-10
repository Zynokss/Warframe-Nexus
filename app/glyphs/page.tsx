'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Key, Copy, Check } from 'lucide-react'

interface GlyphCode {
  code: string
  creator: string
}

const ACTIVE_GLYPHS: GlyphCode[] = [
  { code: 'DUVIRI-PARADOX', creator: 'Community Promo' },
  { code: 'TENNOCON2026', creator: 'TennoCon Special' },
  { code: 'SANTIZAP', creator: 'Creator Code' },
  { code: 'WARFRAME-NEXUS', creator: 'Nexus Promo' },
]

export default function GlyphsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="nexus-page nexus-utility min-h-screen bg-[#07070a] text-zinc-100 font-mono">
      <Navbar />

      <main className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wider uppercase flex items-center gap-2">
            <Key className="w-6 h-6 text-amber-400" /> Free Universal Glyph Codes
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Active promotional codes for free in-game creator and event Glyphs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACTIVE_GLYPHS.map((g, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/60 border border-zinc-800 p-3 rounded flex items-center justify-between hover:border-zinc-700 transition"
            >
              <div>
                <div className="font-bold text-sm text-amber-400 tracking-wider">{g.code}</div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold">{g.creator}</div>
              </div>

              <button
                onClick={() => handleCopy(g.code)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded text-xs text-zinc-300 hover:text-white transition"
              >
                {copiedCode === g.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Code
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
