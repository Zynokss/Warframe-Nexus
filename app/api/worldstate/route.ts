import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const timestamp = Date.now()

    // 1. Fetch main WorldState payload from warframestat.us
    const res = await fetch(`https://api.warframestat.us/pc?language=en&_t=${timestamp}`, {
      headers: { 'Cache-Control': 'no-cache, no-store' },
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
    })

    if (!res.ok) {
      throw new Error(`WarframeStat world-state feed is unavailable (HTTP ${res.status})`)
    }

    const data = await res.json()

    // 2. Fetch live pre-parsed Steel Path incursions from browse.wf as primary data source
    let liveIncursions: any[] = []
    let liveEta = '24h'

    try {
      const browseRes = await fetch(`https://browse.wf/live?_t=${timestamp}`, {
        headers: { 'Cache-Control': 'no-cache, no-store' },
        cache: 'no-store',
        signal: AbortSignal.timeout(3000),
      })
      if (browseRes.ok) {
        const browseData = await browseRes.json()
        const spBlock = browseData?.['▲ Steel Path Incursions']
        if (Array.isArray(spBlock)) {
          liveIncursions = spBlock
        }
      }
    } catch {
      console.warn('browse.wf fetch fallback engaged')
    }

    // 3. Fallback: Parse syndicateMissions from main payload if browse.wf is unreachable
    if (liveIncursions.length === 0 && Array.isArray(data?.syndicateMissions)) {
      const spSyndicate = data.syndicateMissions.find(
        (s: any) =>
          s.syndicate === 'Steel Path' ||
          s.syndicateKey === 'SteelPath' ||
          s.id?.includes('SteelPath')
      )

      if (spSyndicate) {
        liveEta = spSyndicate.eta || spSyndicate.timeLeft || '24h'
        const rawNodes = spSyndicate.nodes || []
        const jobs = spSyndicate.jobs || []

        liveIncursions = rawNodes.map((nodeStr: string, idx: number) => {
          const job = jobs[idx]
          return {
            node: nodeStr,
            missionType: job?.type || 'Incursion',
            faction: 'Enemy',
            minLvl: job?.enemyLevels?.[0] || 100,
            maxLvl: job?.enemyLevels?.[1] || 125,
          }
        })
      }
    }

    // Attach uniform incursions payload to the main data object
    data.steelPathIncursions = {
      eta: liveEta,
      list: liveIncursions,
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error
      ? error.name === 'TimeoutError' ? 'WarframeStat took too long to respond. Please try again.' : error.message
      : 'Internal Server Error'
    return NextResponse.json(
      { error: message },
      { status: 502, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  }
}