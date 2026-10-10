'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, XCircle, Search, AlertTriangle, RefreshCw, Filter, Monitor, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react'
import ArchiveHero from '@/components/ArchiveHero'
import Navbar from '@/components/Navbar'

interface DERivenItem {
  itemType: string
  compatibility: string
  rerolled: boolean
  avg: number
  stddev: number
  min: number
  max: number
  pop: number
  median?: number
}

async function fetchRawDERivens(platform: string): Promise<DERivenItem[]> {
  const res = await fetch(`/api/rivens?platform=${platform}`)
  if (!res.ok) {
    throw new Error('Failed to load official DE Riven data')
  }
  return res.json()
}

export default function RivenDataPage() {
  const [platform, setPlatform] = useState<'PC' | 'PS4' | 'XB1' | 'SWITCH'>('PC')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [rolledFilter, setRolledFilter] = useState<'ALL' | 'YES' | 'NO'>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 50

  const { data: rivens, isLoading, error } = useQuery({
    queryKey: ['rivens-de-raw', platform],
    queryFn: () => fetchRawDERivens(platform),
    staleTime: 1000 * 60 * 60 * 12,
    refetchInterval: false,
  })

  // Extract available Riven types
  const itemTypes = useMemo(() => {
    if (!rivens || !Array.isArray(rivens)) return []
    const types = new Set(rivens.map((r) => r.itemType).filter(Boolean))
    return Array.from(types).sort()
  }, [rivens])

  // Search & Filter Handler
  const filteredData = useMemo(() => {
    if (!rivens || !Array.isArray(rivens)) return []

    return rivens
      .filter((riven) => {
        const weaponName = riven.compatibility || riven.itemType || ''
        const matchesSearch = weaponName.toLowerCase().includes(search.toLowerCase().trim())
        const matchesType = typeFilter === 'ALL' || riven.itemType === typeFilter
        const matchesRolled =
          rolledFilter === 'ALL' ||
          (rolledFilter === 'YES' && riven.rerolled) ||
          (rolledFilter === 'NO' && !riven.rerolled)

        return matchesSearch && matchesType && matchesRolled
      })
      .sort((a, b) => a.compatibility.localeCompare(b.compatibility))
  }, [rivens, search, typeFilter, rolledFilter])

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const getPageNumbers = () => {
    const pages: number[] = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - 2)
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="nexus-page nexus-utility archive-page archive-riven min-h-screen bg-[#050508] text-zinc-100 font-mono relative overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

      <Navbar />

      <main className="p-4 md:p-6 space-y-6 relative z-10 max-w-7xl mx-auto">
        <ArchiveHero kind="riven" metrics={[{ label: 'Platform', value: platform }, { label: 'Trade records', value: rivens ? rivens.length.toLocaleString() : 'Syncing…' }, { label: 'Data source', value: 'WFCD / DE' }]} />


        {/* Top Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-1.5 pt-2 pb-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-[#0b0c10] border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-[#0b0c10] border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 rounded-lg border text-xs font-bold transition cursor-pointer ${
                  currentPage === num
                    ? 'bg-amber-950/60 border-amber-800 text-amber-300 shadow-lg'
                    : 'bg-[#0b0c10] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-[#0b0c10] border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-[#0b0c10] border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div className="archive-toolbar bg-[#0b0c10] border border-zinc-800/80 p-3 rounded-xl flex flex-col md:flex-row gap-3 items-center justify-between shadow-2xl">
          <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto custom-scrollbar pb-1 md:pb-0">
            {/* Platform Dropdown */}
            <div className="flex items-center gap-2 bg-[#050508] border border-amber-900/40 rounded-lg px-3 py-1.5 shrink-0">
              <Monitor className="w-3.5 h-3.5 text-amber-400" />
              <select
                aria-label="Riven platform"
                value={platform}
                onChange={(e) => {
                  setPlatform(e.target.value as any)
                  setCurrentPage(1)
                }}
                className="bg-transparent text-xs font-bold text-amber-300 outline-none cursor-pointer"
              >
                <option value="PC">PC Platform</option>
                <option value="PS4">PS4 Platform</option>
                <option value="XB1">XB1 Platform</option>
                <option value="SWITCH">Switch Platform</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2 bg-[#050508] border border-zinc-800 rounded-lg px-3 py-1.5 shrink-0">
              <Filter className="w-3.5 h-3.5 text-zinc-500" />
              <select
                aria-label="Riven category"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="bg-transparent text-xs text-zinc-200 outline-none cursor-pointer"
              >
                <option value="ALL">Select Riven Types</option>
                {itemTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Rolled Filter */}
            <div className="flex items-center gap-2 bg-[#050508] border border-zinc-800 rounded-lg px-3 py-1.5 shrink-0">
              <select
                aria-label="Reroll status"
                value={rolledFilter}
                onChange={(e) => {
                  setRolledFilter(e.target.value as any)
                  setCurrentPage(1)
                }}
                className="bg-transparent text-xs text-zinc-200 outline-none cursor-pointer"
              >
                <option value="ALL">Filter by Rolled</option>
                <option value="YES">Rerolled Only</option>
                <option value="NO">Unrolled Only</option>
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              aria-label="Search Riven weapons"
              placeholder="Search weapons..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full bg-[#050508] border border-zinc-800 text-xs rounded-lg pl-9 pr-3 py-2 text-zinc-200 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="riven-table-frame bg-[#0b0c10] border border-zinc-800/80 rounded-xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar max-h-[720px]">
            <table aria-label="Aggregated Riven trade statistics" className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-[#07080c] sticky top-0 z-10 border-b border-zinc-800 shadow-md">
                <tr className="text-zinc-400">
                  <th className="px-4 py-3 font-bold tracking-wider">Weapon</th>
                  <th className="px-4 py-3 font-bold tracking-wider text-center">Rerolled?</th>
                  <th className="px-4 py-3 font-bold tracking-wider">Average Trade</th>
                  <th className="px-4 py-3 font-bold tracking-wider">Standard Deviation</th>
                  <th className="px-4 py-3 font-bold tracking-wider">Min Traded Value</th>
                  <th className="px-4 py-3 font-bold tracking-wider">Median</th>
                  <th className="px-4 py-3 font-bold tracking-wider">Max Traded Value</th>
                  <th className="px-4 py-3 font-bold tracking-wider">Population</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-900/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center text-zinc-500">
                      <RefreshCw className="w-6 h-6 animate-spin text-amber-500 mx-auto mb-3" />
                      Syncing {platform} Trade Data from DE...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center text-red-400">
                      <AlertTriangle className="w-6 h-6 mx-auto mb-3" />
                      Failed to sync DE trade repository. Check terminal for server logs.
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center text-zinc-500">
                      No Riven trade entries found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((riven, idx) => (
                    <tr
                      key={`${riven.compatibility}-${riven.rerolled}-${idx}`}
                      className="hover:bg-[#12131a] transition-colors"
                    >
                      <td className="px-4 py-2.5 font-bold text-zinc-200">
                        {riven.compatibility}
                      </td>
                      <td className="px-4 py-2.5 flex justify-center">
                        {riven.rerolled ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-amber-300 font-medium">
                        {riven.avg > 0 ? riven.avg.toFixed(2) : '0'}
                      </td>
                      <td className="px-4 py-2.5 text-zinc-400">
                        {riven.stddev > 0 ? riven.stddev.toFixed(2) : '0'}
                      </td>
                      <td className="px-4 py-2.5 text-zinc-300">{riven.min ?? '0'}</td>
                      <td className="px-4 py-2.5 text-amber-400 font-semibold">
                        {riven.median ?? '--'}
                      </td>
                      <td className="px-4 py-2.5 text-zinc-300">{riven.max ?? '0'}</td>
                      <td className="px-4 py-2.5 text-zinc-500">{riven.pop ?? '0'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Bar */}
          {!isLoading && totalPages > 0 && (
            <div className="bg-[#07080c] border-t border-zinc-800 px-4 py-3 flex items-center justify-between text-xs text-zinc-500">
              <span>
                Showing {(currentPage - 1) * rowsPerPage + 1} to{' '}
                {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
              </span>
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
