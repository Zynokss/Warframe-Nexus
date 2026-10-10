/** Persistence is optional: browser privacy settings must not prevent rendering. */
export function readStoredJson(key: string): unknown {
  try { return JSON.parse(localStorage.getItem(key) || 'null') } catch { return null }
}

export function writeStoredJson(key: string, value: unknown): void {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* Keep current in-memory state. */ }
}

export function readStoredBooleanMap(key: string): Record<string, boolean> | null {
  const value = readStoredJson(key)
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return Object.fromEntries(Object.entries(value).filter(([, flag]) => typeof flag === 'boolean'))
}
