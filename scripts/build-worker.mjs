import { build } from 'esbuild'
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = process.cwd()
const server = resolve(root, 'dist/server')
const metadata = resolve(root, 'dist/.openai')
await mkdir(server, { recursive: true })
await mkdir(metadata, { recursive: true })
await build({ entryPoints: ['worker/index.js'], outfile: 'dist/server/index.js', bundle: true, format: 'esm', platform: 'browser', target: 'es2022', minify: false })
const hosting = JSON.parse(await readFile('.openai/hosting.json', 'utf8'))
if (hosting.static || hosting.d1 !== 'DB') throw new Error('Worker hosting must declare d1: DB and omit static.')
await cp('.openai/hosting.json', resolve(metadata, 'hosting.json'))
await cp('drizzle', resolve(metadata, 'drizzle'), { recursive: true })
// The Sites publisher provisions the live DB; this placeholder is local only.
await writeFile(resolve(server, 'wrangler.json'), JSON.stringify({
  name: 'yaojing-community',
  main: './index.js',
  compatibility_date: '2026-05-15',
  assets: { directory: '../client', binding: 'ASSETS', run_worker_first: ['/api/*'] },
  d1_databases: [{ binding: 'DB', database_name: 'yaojing-community-local', database_id: '00000000-0000-4000-8000-000000000000', migrations_dir: '../../drizzle' }],
}, null, 2) + '\n')
console.log('Worker, static assets and D1 migrations are ready in dist/.')
