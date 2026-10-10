import type { Archimedea, ArchimedeaModifier } from '@/types/warframe'

type RecordValue = Record<string, unknown>
function record(value: unknown): RecordValue | undefined {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as RecordValue : undefined
}
function text(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}
function modifier(value: unknown): ArchimedeaModifier | undefined {
  const item = record(value)
  const name = text(item?.name)
  return name ? { name, description: text(item?.description) || '', isHard: item?.isHard === true } : undefined
}
function modifiers(value: unknown): ArchimedeaModifier[] {
  return Array.isArray(value) ? value.flatMap(item => { const parsed = modifier(item); return parsed ? [parsed] : [] }) : []
}

/** Adapt current WFCD fields; retain old Deep-only payloads without inventing telemetry. */
export function normalizeArchimedeas(value: unknown, legacyDeep?: unknown): Archimedea[] {
  const entries = Array.isArray(value) ? value : []
  const result: Archimedea[] = []
  function add(raw: unknown, legacy = false) {
    const entry = record(raw)
    if (!entry || !Array.isArray(entry.missions)) return
    const key = text(entry.typeKey) || text(entry.type) || (legacy ? 'Deep Archimedea' : '')
    // Current upstream may expose untranslated CT_LAB/CT_HEX as spaced labels.
    const types: Record<string, Archimedea['type']> = {
      DEEPARCHIMEDEA: 'Deep Archimedea', CT_LAB: 'Deep Archimedea',
      TEMPORALARCHIMEDEA: 'Temporal Archimedea', CT_HEX: 'Temporal Archimedea',
    }
    const type = types[key.replace(/\s/g, '').toUpperCase()]
    if (!type || result.some(item => item.type === type)) return
    result.push({
      id: text(entry.id), type, activation: text(entry.activation), expiry: text(entry.expiry), eta: text(entry.eta),
      missions: entry.missions.flatMap(rawMission => {
        const mission = record(rawMission)
        if (!mission) return []
        const missionType = text(mission.missionType) || text(mission.type) || text(mission.title) || text(mission.name)
        if (!missionType) return []
        return [{ missionType, faction: text(mission.faction), node: text(mission.node), deviation: modifier(mission.deviation), risks: modifiers(mission.risks), modifiers: modifiers(mission.modifiers) }]
      }),
      personalModifiers: modifiers(entry.personalModifiers ?? entry.personalVariables),
    })
  }
  entries.forEach(item => add(item))
  add(legacyDeep, true)
  return result
}
