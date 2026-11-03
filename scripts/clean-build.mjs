import { rm } from 'node:fs/promises'
import { dirname, relative, resolve, isAbsolute } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const output = resolve(root, 'dist')
const contained = relative(root, output)
if (!contained || contained.startsWith('..') || isAbsolute(contained)) throw new Error('Build output must remain inside this checkout.')
await rm(output, { recursive: true, force: true })
