'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'

interface Swatch {
  hex: string
  similarity: number
}

interface PaletteData {
  name: string
  swatches: Swatch[] // Array of 10-20 colors per palette
  peakSimilarity: number
}

// Full Warframe Color Palettes Data
const PALETTE_DATABASE_RAW = [
  {
    name: 'Fire (Legacy)',
    hexes: ['#ffd700', '#ffb700', '#ff9300', '#ff6a00', '#ff3b00', '#e60000', '#cc0000', '#b30000', '#990000', '#800000']
  },
  {
    name: 'Classic (Legacy)',
    hexes: ['#3a4856', '#4a5a6a', '#5b6c7e', '#6d7f92', '#8092a7', '#990000', '#cc0000', '#ff0000', '#ff3333', '#ff6666']
  },
  {
    name: 'Spektaka',
    hexes: ['#e84393', '#fd79a8', '#6c5ce7', '#a29bfe', '#00b894', '#55efc4', '#ffeaa7', '#fdcb6e', '#e17055', '#d63031']
  },
  {
    name: 'Daybreak (Legacy)',
    hexes: ['#9c88ff', '#8c7ae6', '#487eb0', '#40739e', '#e1b12c', '#fbc531', '#44bd32', '#4cd137', '#e84118', '#c23616']
  },
  {
    name: 'Twilight',
    hexes: ['#4b3832', '#854442', '#fff4e6', '#3c2f2f', '#be9b7b', '#ad8b73', '#96705b', '#805645', '#6a3c30', '#55231c']
  },
  {
    name: 'Void Trader',
    hexes: ['#00a8ff', '#9c88ff', '#fbc531', '#4cd137', '#487eb0', '#10ac84', '#ff9f43', '#ee5253', '#0abde3', '#10ac84']
  },
  {
    name: 'Grineer (Legacy)',
    hexes: ['#576574', '#8395a7', '#222f3e', '#1dd1a1', '#ff6b6b', '#fabca1', '#c8d6e5', '#54a0ff', '#5f27cd', '#00d2d3']
  },
  {
    name: 'Deca Heirloom',
    hexes: ['#2d3436', '#636e72', '#b2bec3', '#dfe6e9', '#0984e3', '#74b9ff', '#6c5ce7', '#a29bfe', '#00b894', '#55efc4']
  },
  {
    name: 'Twilight (Legacy)',
    hexes: ['#3d2314', '#52331c', '#684325', '#7e542e', '#946538', '#aa7742', '#c0894d', '#d69b58', '#ecad64', '#ffbf70']
  },
  {
    name: 'Legacy Tones',
    hexes: ['#d5c5a1', '#b8a682', '#9b8864', '#7f6b47', '#634f2b', '#483410', '#a3926e', '#867653', '#6a5a39', '#4f4021']
  }
]

function hexToRgb(hex: string) {
  let cleanHex = hex.replace('#', '')
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('')
  }
  const num = parseInt(cleanHex, 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

function calculateSimilarity(hex1: string, hex2: string): number {
  try {
    const rgb1 = hexToRgb(hex1)
    const rgb2 = hexToRgb(hex2)
    const distance = Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
    )
    const maxDistance = Math.sqrt(Math.pow(255, 2) * 3)
    return Math.round((1 - distance / maxDistance) * 100)
  } catch {
    return 0
  }
}

export default function ColorPickerPage() {
  const [targetHex, setTargetHex] = useState('#b5835a')

  // Calculate similarity for every swatch in every palette
  const processedPalettes: PaletteData[] = PALETTE_DATABASE_RAW.map((palette) => {
    let peak = 0
    const swatches = palette.hexes.map((hex) => {
      const sim = calculateSimilarity(targetHex, hex)
      if (sim > peak) peak = sim
      return { hex, similarity: sim }
    })

    return {
      name: palette.name,
      swatches,
      peakSimilarity: peak,
    }
  })

  // Rank whole palettes by their highest peak similarity %
  processedPalettes.sort((a, b) => b.peakSimilarity - a.peakSimilarity)

  return (
    <div className="nexus-page nexus-utility min-h-screen bg-[#18191c] text-zinc-100 font-sans">
      <Navbar />

      <main className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
        {/* Top Hex Search Bar */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 bg-[#202226] border border-zinc-700/80 rounded p-1.5 focus-within:border-zinc-500">
            <div
              className="w-8 h-8 rounded border border-zinc-600 shrink-0 shadow-inner"
              style={{ backgroundColor: targetHex }}
            />
            <input
              type="color"
              value={targetHex}
              onChange={(e) => setTargetHex(e.target.value)}
              className="w-0 h-0 opacity-0 absolute"
              id="color-picker-input"
            />
            <label
              htmlFor="color-picker-input"
              className="cursor-pointer text-xs font-mono text-zinc-400 hover:text-white px-2 py-1 bg-zinc-800 rounded border border-zinc-700"
            >
              Pick Color
            </label>
            <input
              type="text"
              value={targetHex}
              onChange={(e) => setTargetHex(e.target.value)}
              className="bg-transparent border-0 text-sm font-mono text-white focus:outline-none w-full uppercase"
              placeholder="#b5835a"
            />
          </div>
        </div>

        {/* Palettes Ranking & Swatch Matrix Container */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Left Side: Ranked Palette List */}
          <div className="w-full md:w-80 space-y-2 shrink-0">
            {processedPalettes.map((palette, idx) => (
              <div
                key={idx}
                className="bg-[#202226] border border-zinc-800/90 rounded p-3 flex items-center justify-between hover:border-zinc-700 transition"
              >
                <div>
                  <div className="font-semibold text-sm text-zinc-200">{palette.name}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    <span className="font-bold text-white">{palette.peakSimilarity}%</span> Peak Similarity
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side: Full Swatch Percentage Grid Matrix */}
          <div className="bg-[#202226] border border-zinc-800/90 rounded p-4 space-y-2 overflow-x-auto">
            {processedPalettes.map((palette, pIdx) => (
              <div key={pIdx} className="flex items-center gap-1">
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-1">
                  {palette.swatches.map((swatch, sIdx) => (
                    <div
                      key={sIdx}
                      className="w-12 h-10 rounded-sm flex items-center justify-center font-mono text-[11px] font-bold text-white border border-black/30 shadow-sm"
                      style={{ backgroundColor: swatch.hex }}
                    >
                      <span className="bg-black/40 px-1 py-0.5 rounded backdrop-blur-[1px]">
                        {swatch.similarity}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
