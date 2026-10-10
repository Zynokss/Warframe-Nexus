import fs from 'node:fs'
import Module from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

// Load pure TS helpers in the same runtime without adding a test framework.
export default function load(relativePath) {
  const filename = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', relativePath)
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  })
  const loaded = new Module(filename)
  loaded.paths = Module._nodeModulePaths(path.dirname(filename))
  loaded._compile(outputText, filename)
  return loaded.exports
}
