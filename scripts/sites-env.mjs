import { resolve } from 'node:path'
process.env.WRANGLER_SEND_METRICS ??= 'false'
process.env.CLOUDFLARE_CF_FETCH_ENABLED ??= 'false'
process.env.WRANGLER_LOG_PATH ??= resolve('.sites-runtime/wrangler-logs')
