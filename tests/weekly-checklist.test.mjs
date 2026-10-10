import { test } from 'node:test'
import assert from 'node:assert/strict'
import load from './load-typescript.mjs'
const { weeklyResetAt, weeklyResetCountdown, restoreChecklist, freshChecklist, resetChecklistIfDue } = load('lib/weekly-checklist.ts')
const at = value => Date.parse(value)

test('UTC Monday boundaries include Sunday and year transitions', () => {
  assert.equal(weeklyResetAt(at('2026-10-11T23:59:59Z')), at('2026-10-05T00:00:00Z'))
  assert.equal(weeklyResetAt(at('2026-10-12T00:00:00Z')), at('2026-10-12T00:00:00Z'))
  assert.equal(weeklyResetAt(at('2027-01-01T12:00:00Z')), at('2026-12-28T00:00:00Z'))
  assert.equal(weeklyResetCountdown(at('2026-10-11T23:59:59Z')), '0h 0m 1s')
  assert.equal(weeklyResetCountdown(at('2026-10-12T00:00:00Z')), '7d 0h 0m')
})

test('recent legacy Sunday progress survives one migration across Monday', () => {
  const now = at('2026-10-07T12:00:00Z')
  const saved = { lastReset: at('2026-10-04T00:00:00Z'), teshin: true, circuitSP: true, netracells: [true, false, true, false, false] }
  const migrated = restoreChecklist(saved, now)
  assert.equal(migrated.schemaVersion, 2)
  assert.equal(migrated.lastReset, at('2026-10-05T00:00:00Z'))
  assert.equal(migrated.teshin, true)
  assert.equal(migrated.circuitSP, true)
  assert.deepEqual(migrated.netracells, saved.netracells)
  assert.deepEqual(restoreChecklist({ ...saved, lastReset: at('2026-09-27T00:00:00Z') }, now), freshChecklist(now))
})

test('current saved progress and array shapes are validated', () => {
  const now = at('2026-10-07T12:00:00Z')
  const saved = { ...freshChecklist(now), teshin: 'true', clem: true, kahl: [true], descendia: [true, 'true'] }
  const restored = restoreChecklist(saved, now)
  assert.equal(restored.teshin, false)
  assert.equal(restored.clem, true)
  assert.deepEqual(restored.kahl, Array(7).fill(false))
  assert.deepEqual(restored.descendia, [true, false])
  for (const corrupt of [null, [], 'invalid', { lastReset: Infinity }, { lastReset: now + 1000 }]) assert.deepEqual(restoreChecklist(corrupt, now), freshChecklist(now))
})

test('an open tab resets exactly at Monday without resetting repeatedly', () => {
  const before = at('2026-10-11T23:59:59Z')
  const saved = { ...freshChecklist(before), maroo: true, netracells: Array(5).fill(true) }
  assert.equal(resetChecklistIfDue(saved, before), saved)
  const reset = resetChecklistIfDue(saved, at('2026-10-12T00:00:00Z'))
  assert.equal(reset.maroo, false)
  assert.deepEqual(reset.netracells, Array(5).fill(false))
  assert.equal(resetChecklistIfDue(reset, at('2026-10-12T00:01:00Z')), reset)
  assert.deepEqual(restoreChecklist(saved, at('2026-10-12T00:00:00Z')), reset)
})
