import { test } from 'node:test'
import assert from 'node:assert/strict'
import load from './load-typescript.mjs'
const { normalizeArchimedeas } = load('lib/archimedea.ts')

test('both current modes retain deviations, elite risks and personal modifiers', () => {
  const input = ['Deep Archimedea', 'Temporal Archimedea'].map(type => ({
    typeKey: type, type, expiry: '2026-10-12T00:00:00Z',
    missions: [{ missionType: 'Survival', faction: 'The Murmur', deviation: { name: 'Deviation', description: 'Effect' }, risks: [{ name: 'Risk', description: 'Danger', isHard: true }] }],
    personalModifiers: [{ name: 'Gear Embargo', description: 'Gear cannot be used.' }],
  }))
  const modes = normalizeArchimedeas(input)
  assert.deepEqual(modes.map(mode => mode.type), ['Deep Archimedea', 'Temporal Archimedea'])
  assert.equal(modes[0].missions[0].deviation.name, 'Deviation')
  assert.equal(modes[1].missions[0].risks[0].isHard, true)
  assert.equal(modes[0].personalModifiers[0].name, 'Gear Embargo')
})

test('missing and malformed fields are safe; unknown modes are not mislabelled', () => {
  assert.deepEqual(normalizeArchimedeas(null), [])
  assert.deepEqual(normalizeArchimedeas([{ type: 'Unknown', missions: [] }, null, { type: 'Deep Archimedea', missions: 'broken' }]), [])
  const [mode] = normalizeArchimedeas([{ typeKey: 'Deep Archimedea', missions: [null, {}, { missionType: 'Alchemy', risks: [null, { name: 'Valid' }] }] }])
  assert.equal(mode.missions.length, 1)
  assert.equal(mode.missions[0].risks.length, 1)
  assert.deepEqual(mode.personalModifiers, [])
})

test('legacy Deep payloads remain usable without duplicating the current feed', () => {
  const legacy = { missions: [{ title: 'Alchemy', modifiers: [{ name: 'Modifier', description: 'Effect' }] }], personalVariables: [{ name: 'Variable' }] }
  const [mode] = normalizeArchimedeas(undefined, legacy)
  assert.equal(mode.type, 'Deep Archimedea')
  assert.equal(mode.missions[0].missionType, 'Alchemy')
  assert.equal(mode.personalModifiers[0].name, 'Variable')
  assert.equal(normalizeArchimedeas([{ type: 'Deep Archimedea', missions: [] }], legacy).length, 1)
})

test('untranslated keys observed in the live feed identify the correct modes', () => {
  const modes = normalizeArchimedeas([
    { typeKey: 'C T_ L A B', missions: [{ missionType: 'Defense' }] },
    { typeKey: 'C T_ H E X', missions: [{ missionType: 'Legacyte Harvest' }] },
  ])
  assert.deepEqual(modes.map(mode => mode.type), ['Deep Archimedea', 'Temporal Archimedea'])
})
