/** Browser-local progress, deliberately independent of game-account state. */
export interface ChecklistState {
  schemaVersion: 2
  lastReset: number
  teshin: boolean
  palladino: boolean
  clem: boolean
  maroo: boolean
  calendar1999: boolean
  circuitNormal: boolean
  circuitSP: boolean
  netracells: boolean[]
  kahl: boolean[]
  descendia: boolean[]
}

export const CHECKLIST_KEY = 'wf_weekly_checklist'
const WEEK = 7 * 24 * 60 * 60 * 1000
const singles = ['teshin', 'palladino', 'clem', 'maroo', 'calendar1999', 'circuitNormal', 'circuitSP'] as const
const slots = { netracells: 5, kahl: 7, descendia: 2 } as const

export function weeklyResetAt(now = Date.now()): number {
  const date = new Date(now)
  date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7)
  date.setUTCHours(0, 0, 0, 0)
  return date.getTime()
}

export function freshChecklist(now = Date.now()): ChecklistState {
  return {
    schemaVersion: 2, lastReset: weeklyResetAt(now),
    teshin: false, palladino: false, clem: false, maroo: false,
    calendar1999: false, circuitNormal: false, circuitSP: false,
    netracells: Array(5).fill(false), kahl: Array(7).fill(false), descendia: Array(2).fill(false),
  }
}

export function restoreChecklist(raw: unknown, now = Date.now()): ChecklistState {
  const state = freshChecklist(now)
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return state
  const saved = raw as Record<string, unknown>
  const stamp = saved.lastReset
  if (typeof stamp !== 'number' || !Number.isFinite(stamp) || stamp > now) return state
  if (saved.schemaVersion === 2) {
    if (stamp !== state.lastReset) return state
  } else {
    // Legacy timestamps mark Sunday, not the time each checkbox changed.
    // Preserve recent progress once; its true week cannot be recovered reliably.
    const legacy = new Date(stamp)
    if (now - stamp >= WEEK || legacy.getUTCDay() !== 0 || legacy.getUTCHours() !== 0 || legacy.getUTCMinutes() !== 0 || legacy.getUTCSeconds() !== 0 || legacy.getUTCMilliseconds() !== 0) return state
  }
  for (const key of singles) state[key] = saved[key] === true
  for (const key of Object.keys(slots) as (keyof typeof slots)[]) {
    const values = saved[key]
    if (Array.isArray(values) && values.length === slots[key]) state[key] = values.map(value => value === true)
  }
  return state
}

export function resetChecklistIfDue(state: ChecklistState, now = Date.now()): ChecklistState {
  return state.lastReset === weeklyResetAt(now) ? state : freshChecklist(now)
}

export function weeklyResetCountdown(now = Date.now()): string {
  const seconds = Math.max(0, Math.floor((weeklyResetAt(now) + WEEK - now) / 1000))
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor(seconds / 3600) % 24
  const minutes = Math.floor(seconds / 60) % 60
  return days > 0 ? `${days}d ${hours}h ${minutes}m` : `${hours}h ${minutes}m ${seconds % 60}s`
}
