import { NextResponse } from 'next/server'

const WFCD_PLATFORM_URLS: Record<string, string> = {
  PC: 'https://api.warframestat.us/pc/rivens',
  PS4: 'https://api.warframestat.us/ps4/rivens',
  XB1: 'https://api.warframestat.us/xb1/rivens',
  SWITCH: 'https://api.warframestat.us/swi/rivens',
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const platform = (searchParams.get('platform') || 'PC').toUpperCase()
  const targetUrl = WFCD_PLATFORM_URLS[platform] || WFCD_PLATFORM_URLS.PC

  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json',
      },
      // Cache server-side for 6 hours
      next: { revalidate: 21600 },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `WFCD endpoint returned status ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()
    const normalizedRows: any[] = []

    // Recursively search the JSON tree for actual trade data objects
    function traverse(node: any, currentCategory: string, currentWeapon: string) {
      if (!node || typeof node !== 'object') return

      // We know we hit a valid Riven data leaf when it contains average and population metrics
      if (('avg' in node || 'avgTrade' in node) && ('pop' in node || 'popCount' in node)) {
        
        // Extract the weapon name, falling back to our tracked keys for Veiled Rivens
        const weaponName = node.compatibility || currentWeapon || node.itemType || currentCategory || 'Veiled Riven'
        const categoryName = node.itemType || currentCategory || 'Other'

        normalizedRows.push({
          itemType: categoryName,
          compatibility: weaponName,
          rerolled: Boolean(node.rerolled),
          avg: Number(node.avgTrade ?? node.avg ?? 0),
          stddev: Number(node.stddev ?? 0),
          min: Number(node.minTrade ?? node.min ?? 0),
          max: Number(node.maxTrade ?? node.max ?? 0),
          pop: Number(node.popCount ?? node.pop ?? 0),
          median: node.median !== undefined && node.median !== null ? Number(node.median) : undefined,
        })
        return
      }

      // If it's an array, iterate through it
      if (Array.isArray(node)) {
        node.forEach(child => traverse(child, currentCategory, currentWeapon))
        return
      }

      // If it's a nested dictionary, traverse deeper and track the grouping keys
      for (const [key, value] of Object.entries(node)) {
        let nextCategory = currentCategory
        let nextWeapon = currentWeapon

        // WFCD uses keys like "unrolled" and "rerolled" for the final objects.
        // Everything before that is either the Item Category (e.g., "Shotgun Riven Mod") or the Weapon Name (e.g., "Strun").
        if (key !== 'unrolled' && key !== 'rerolled') {
          if (!currentCategory || key.toLowerCase().includes('riven mod')) {
            nextCategory = key
          } else {
            nextWeapon = key
          }
        }

        traverse(value, nextCategory, nextWeapon)
      }
    }

    traverse(data, '', '')

    return NextResponse.json(normalizedRows)
  } catch (error: any) {
    console.error('[WFCD Riven Fetch Failed]', error?.message || error)
    return NextResponse.json(
      { error: 'Failed to fetch Riven trade data', details: error?.message },
      { status: 500 }
    )
  }
}