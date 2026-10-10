import { test } from 'node:test'
import assert from 'node:assert/strict'
import load from './load-typescript.mjs'
const { readStoredJson, writeStoredJson, readStoredBooleanMap } = load('lib/browser-storage.ts')

test('blocked storage remains optional, including throwing property access', () => {
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('SecurityError') } })
  assert.equal(readStoredJson('settings'), null)
  assert.equal(readStoredBooleanMap('settings'), null)
  assert.doesNotThrow(() => writeStoredJson('settings', { enabled: true }))
  delete globalThis.localStorage
})

test('malformed settings cannot become dashboard state', () => {
  let value = 'invalid JSON'
  globalThis.localStorage = { getItem: () => value, setItem: (_, next) => { value = next } }
  assert.equal(readStoredBooleanMap('settings'), null)
  value = '[]'
  assert.equal(readStoredBooleanMap('settings'), null)
  value = '{"cycles":false,"weeklyReset":true,"endgame":"yes"}'
  assert.deepEqual(readStoredBooleanMap('settings'), { cycles: false, weeklyReset: true })
  writeStoredJson('settings', { cycles: true })
  assert.deepEqual(readStoredJson('settings'), { cycles: true })
  delete globalThis.localStorage
})
