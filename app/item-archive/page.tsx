'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Filter, ExternalLink, Package, Shield, Check, X, Info, ChevronDown, ChevronUp, Loader2, ArrowRightLeft, Award } from 'lucide-react'
import ArchiveHero from '@/components/ArchiveHero'
import Navbar from '@/components/Navbar'

interface WarframeItem {
  uniqueName: string
  name: string
  description?: string
  type: string
  category: string
  tradable: boolean
  masterable: boolean
  wikiaUrl?: string
  imageName?: string
}

// Fetch the massive items payload and cache it heavily
async function fetchItems(): Promise<WarframeItem[]> {
  const res = await fetch('https://api.warframestat.us/items')
  if (!res.ok) throw new Error('Failed to fetch items')
  return res.json()
}

// Helper to strip internal engine tags from names (e.g., <Shard_blue_simple> Azure Archon Shard)
const cleanName = (name: string) => name.replace(/<[^>]*>/g, '').trim()

export default function ItemArchivePage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [onlyTradable, setOnlyTradable] = useState(false)
  const [onlyMasterable, setOnlyMasterable] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const rowsPerPage = 50

  const { data: items, isLoading, error } = useQuery({
    queryKey: ['warframe-items'],
    queryFn: fetchItems,
    staleTime: Infinity, // Keep the catalog for this browser session.
    refetchInterval: false,
    refetchOnWindowFocus: false,
  })

  // Extract unique types and categories for the dropdowns
  const { types, categories } = useMemo(() => {
    if (!items) return { types: [], categories: [] }
    const typeSet = new Set<string>()
    const catSet = new Set<string>()

    items.forEach(item => {
      if (item.type) typeSet.add(item.type)
      if (item.category) catSet.add(item.category)
    })

    return {
      types: Array.from(typeSet).sort(),
      categories: Array.from(catSet).sort()
    }
  }, [items])

  // Filter the items based on user input
  const filteredItems = useMemo(() => {
    if (!items) return []

    return items.filter(item => {
      const cleanedItemName = cleanName(item.name).toLowerCase()
      const searchLower = search.toLowerCase()

      const matchesSearch =
        cleanedItemName.includes(searchLower) ||
        (item.description?.toLowerCase().includes(searchLower))

      const matchesType = typeFilter === 'ALL' || item.type === typeFilter
      const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter
      const matchesTradable = !onlyTradable || Boolean(item.tradable)
      const matchesMasterable = !onlyMasterable || Boolean(item.masterable)

      return matchesSearch && matchesType && matchesCategory && matchesTradable && matchesMasterable
    }).sort((a, b) => cleanName(a.name).localeCompare(cleanName(b.name)))
  }, [items, search, typeFilter, categoryFilter, onlyTradable, onlyMasterable])

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / rowsPerPage)
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  // Reset to page 1 if any filters or toggles change
  useMemo(() => {
    setCurrentPage(1)
  }, [search, typeFilter, categoryFilter, onlyTradable, onlyMasterable])

  const toggleExpand = (uniqueName: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(uniqueName)) {
        next.delete(uniqueName)
      } else {
        next.add(uniqueName)
      }
      return next
    })
  }

  const getPageNumbers = () => {
    const pages: number[] = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - 2)
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  // Reusable Pagination Element (Top & Bottom)
  const PaginationBar = () => (
    <div className="bg-[#0b0c10] border border-zinc-800/80 px-4 py-3 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
      <span className="text-xs text-zinc-500">
        Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredItems.length)} of {filteredItems.length} items
      </span>

      <div className="flex items-center gap-1 bg-[#050508] p-1.5 rounded-xl border border-zinc-800">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
        >
          First
        </button>

        {getPageNumbers().map(num => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
              currentPage === num
                ? 'bg-amber-950/60 border border-amber-800 text-amber-300'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
        >
          Last
        </button>
      </div>
    </div>
  )

  return (
    <div className="nexus-page nexus-utility archive-page archive-items min-h-screen bg-[#050508] text-zinc-100 font-mono relative overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

      <Navbar />

      <main className="p-4 md:p-6 space-y-6 relative z-10 max-w-5xl mx-auto">

        {/* Header Section */}
        <ArchiveHero kind="items" metrics={[{ label: 'Indexed items', value: items ? items.length.toLocaleString() : 'Syncing…' }, { label: 'Matched records', value: filteredItems.length.toLocaleString() }, { label: 'Data source', value: 'WFCD Items' }]} />


        {/* Filters & Search Control Bar */}
        <div className="archive-toolbar bg-[#0b0c10] border border-zinc-800/80 p-3 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between shadow-2xl">

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto custom-scrollbar pb-2 md:pb-0">
            {/* Type Filter */}
            <div className="flex items-center gap-2 bg-[#050508] border border-zinc-800 rounded-xl px-3 py-2 shrink-0">
              <Filter className="w-4 h-4 text-zinc-500" />
              <select
                aria-label="Item type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-transparent text-xs text-zinc-200 outline-none cursor-pointer w-32"
              >
                <option value="ALL">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 bg-[#050508] border border-zinc-800 rounded-xl px-3 py-2 shrink-0">
              <Shield className="w-4 h-4 text-zinc-500" />
              <select
                aria-label="Item category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent text-xs text-zinc-200 outline-none cursor-pointer w-32"
              >
                <option value="ALL">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Tradable Toggle */}
            <button
              aria-pressed={onlyTradable}
              onClick={() => setOnlyTradable(!onlyTradable)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border shrink-0 cursor-pointer ${
                onlyTradable
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                  : 'bg-[#050508] border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Tradable</span>
            </button>

            {/* Masterable Toggle */}
            <button
              aria-pressed={onlyMasterable}
              onClick={() => setOnlyMasterable(!onlyMasterable)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border shrink-0 cursor-pointer ${
                onlyMasterable
                  ? 'bg-amber-950/60 border-amber-800 text-amber-400'
                  : 'bg-[#050508] border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Masterable</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              aria-label="Search the item archive"
              placeholder="Search by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#050508] border border-zinc-800 text-xs rounded-xl pl-9 pr-3 py-2.5 text-zinc-200 focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* Top Pagination Control Bar */}
        {!isLoading && totalPages > 1 && <PaginationBar />}

        {/* Data List (Replaces the traditional table) */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center text-zinc-500 bg-[#0b0c10] border border-zinc-800/80 rounded-2xl">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
              <p className="text-sm">Downloading massive item database...</p>
            </div>
          ) : error ? (
            <div className="py-24 text-center text-red-400 bg-[#0b0c10] border border-red-900/30 rounded-2xl">
              Failed to load item archive.
            </div>
          ) : paginatedItems.length === 0 ? (
            <div className="py-24 text-center text-zinc-500 bg-[#0b0c10] border border-zinc-800/80 rounded-2xl">
              No items found matching your filters.
            </div>
          ) : (
            paginatedItems.map((item) => {
              const isExpanded = expandedItems.has(item.uniqueName)
              const displayName = cleanName(item.name)

              return (
                <div
                  key={item.uniqueName}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  aria-label={`Details for ${displayName}`}
                  onKeyDown={(event) => {
                    if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
                      event.preventDefault()
                      toggleExpand(item.uniqueName)
                    }
                  }}
                  onClick={() => toggleExpand(item.uniqueName)}
                  className="archive-item bg-[#0b0c10] border border-zinc-800/80 hover:border-amber-900/50 rounded-2xl p-3 md:p-4 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-amber-900/10 group flex gap-4"
                >
                  {/* Image Thumbnail */}
                  <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-[#050508] rounded-xl border border-zinc-800/50 p-1 flex items-center justify-center overflow-hidden">
                    {item.imageName ? (
                      <img
                        src={`https://cdn.warframestat.us/img/${item.imageName}`}
                        alt={displayName}
                        loading="lazy"
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-zinc-700" />
                    )}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm md:text-base font-bold text-zinc-100 truncate group-hover:text-amber-400 transition-colors">
                          {displayName}
                        </h3>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {item.category && (
                            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-zinc-900 text-zinc-400 rounded-md border border-zinc-800">
                              {item.category}
                            </span>
                          )}
                          {item.type && (
                            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-zinc-900 text-zinc-400 rounded-md border border-zinc-800">
                              {item.type}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Desktop Action Icons */}
                      <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
                        <div className="flex gap-2">
                          <span className={`flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 rounded-md border ${item.tradable ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50' : 'bg-red-950/30 text-red-400 border-red-900/50'}`}>
                            {item.tradable ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            Tradable
                          </span>
                          <span className={`flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 rounded-md border ${item.masterable ? 'bg-amber-950/30 text-amber-400 border-amber-900/50' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                            {item.masterable ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            Masterable
                          </span>
                        </div>
                        {item.wikiaUrl && (
                          <a
                            href={item.wikiaUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()} // Prevent row expansion when clicking link
                            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-[#050508] px-2.5 py-1 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" /> Wiki
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Expandable Description */}
                    {isExpanded && item.description && (
                      <div className="mt-3 pt-3 border-t border-zinc-800/50 text-xs md:text-sm text-zinc-400 leading-relaxed flex items-start gap-2">
                        <Info className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                        <p>{item.description}</p>
                      </div>
                    )}

                    {/* Mobile Only Details (Shown when expanded) */}
                    {isExpanded && (
                      <div className="mt-3 md:hidden flex flex-wrap gap-2">
                         <span className={`flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 rounded-md border ${item.tradable ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50' : 'bg-red-950/30 text-red-400 border-red-900/50'}`}>
                            {item.tradable ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Tradable
                          </span>
                          <span className={`flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 rounded-md border ${item.masterable ? 'bg-amber-950/30 text-amber-400 border-amber-900/50' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                            {item.masterable ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Masterable
                          </span>
                          {item.wikiaUrl && (
                          <a
                            href={item.wikiaUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-zinc-300 bg-[#050508] px-2 py-1 rounded-md border border-zinc-800"
                          >
                            <ExternalLink className="w-3 h-3" /> Wiki
                          </a>
                        )}
                      </div>
                    )}

                    {/* Expand Indicator */}
                    <div className="mt-2 text-zinc-600 flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold">
                      {isExpanded ? (
                        <><ChevronUp className="w-3 h-3" /> Less</>
                      ) : (
                        <><ChevronDown className="w-3 h-3" /> More</>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Bottom Pagination Controls */}
        {!isLoading && totalPages > 1 && <PaginationBar />}

      </main>
    </div>
  )
}
