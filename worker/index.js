import { communityPosts } from '../src/communityPosts.ts'

const articleIds = new Set(communityPosts.map(post => post.id))
const cookieName = 'yj_comment_session'
const uuidPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i
const sessionPattern = /^[a-f0-9]{64}$/
const pageSize = 20
const maximumBodyBytes = 8192

class HttpError extends Error {
  constructor(status, message, headers = {}) { super(message); this.status = status; this.headers = headers }
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', ...extraHeaders } })
}

async function hash(value) {
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))), byte => byte.toString(16).padStart(2, '0')).join('')
}

async function session(request) {
  const values = (request.headers.get('Cookie') || '').split(';').map(part => part.trim()).filter(part => part.startsWith(`${cookieName}=`))
  const token = values.length === 1 ? values[0].slice(cookieName.length + 1) : ''
  if (sessionPattern.test(token)) return { ownerHash: await hash(token), cookie: null }
  const random = Array.from(crypto.getRandomValues(new Uint8Array(32)), byte => byte.toString(16).padStart(2, '0')).join('')
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : ''
  return { ownerHash: await hash(random), cookie: `${cookieName}=${random}; Path=/api/comments; Max-Age=31536000; HttpOnly; SameSite=Lax${secure}` }
}

function validateArticle(articleId) {
  if (!articleIds.has(articleId)) throw new HttpError(404, '未找到这篇文章。')
}

function assertSameOrigin(request) {
  if (request.headers.get('Origin') !== new URL(request.url).origin || request.headers.get('Sec-Fetch-Site') === 'cross-site') throw new HttpError(403, '请从本网站提交评论。')
}

async function readJson(request) {
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('Content-Type') || '')) throw new HttpError(415, '请以 JSON 格式提交。')
  const size = Number(request.headers.get('Content-Length'))
  if (Number.isFinite(size) && size > maximumBodyBytes) throw new HttpError(413, '提交内容过大。')
  const reader = request.body?.getReader()
  if (!reader) throw new HttpError(400, '请填写评论内容。')
  const chunks = []; let length = 0
  while (true) {
    const part = await reader.read()
    if (part.done) break
    length += part.value.length
    if (length > maximumBodyBytes) { await reader.cancel(); throw new HttpError(413, '提交内容过大。') }
    chunks.push(part.value)
  }
  const bytes = new Uint8Array(length); let offset = 0
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length }
  try {
    const value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes))
    if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error('Object required')
    return value
  } catch { throw new HttpError(400, '评论格式不正确。') }
}

function plainText(value, min, max, field) {
  if (typeof value !== 'string') throw new HttpError(400, `请填写${field}。`)
  const normalized = value.trim().replace(/\r\n?/g, '\n')
  if (Array.from(normalized).length < min || Array.from(normalized).length > max || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(normalized)) throw new HttpError(400, `${field}需为 ${min}–${max} 个字。`)
  return normalized
}

function commentView(row, ownerHash) {
  return { id: row.id, articleId: row.article_id, nickname: row.nickname, body: row.body, createdAt: new Date(row.created_at).toISOString(), canDelete: row.owner_hash === ownerHash }
}

function cursorValue(value) {
  if (!value) return null
  const parts = value.split(':')
  const time = Number(parts[0])
  if (parts.length !== 2 || !Number.isSafeInteger(time) || time < 0 || !uuidPattern.test(parts[1])) throw new HttpError(400, '评论分页参数无效。')
  return { time, id: parts[1] }
}

async function listComments(request, env, ownerHash) {
  const url = new URL(request.url)
  const articleId = url.searchParams.get('articleId')
  validateArticle(articleId)
  const cursor = cursorValue(url.searchParams.get('cursor'))
  const query = cursor
    ? env.DB.prepare('SELECT * FROM community_comments WHERE article_id = ? AND (created_at < ? OR (created_at = ? AND id < ?)) ORDER BY created_at DESC, id DESC LIMIT ?').bind(articleId, cursor.time, cursor.time, cursor.id, pageSize + 1)
    : env.DB.prepare('SELECT * FROM community_comments WHERE article_id = ? ORDER BY created_at DESC, id DESC LIMIT ?').bind(articleId, pageSize + 1)
  const results = await env.DB.batch([query, env.DB.prepare('SELECT COUNT(*) AS total FROM community_comments WHERE article_id = ?').bind(articleId)])
  const rows = results[0].results
  const comments = rows.slice(0, pageSize).map(row => commentView(row, ownerHash))
  const last = rows[pageSize - 1]
  return { comments, total: results[1].results[0].total, nextCursor: rows.length > pageSize ? `${last.created_at}:${last.id}` : null }
}

async function createComment(request, env, ownerHash) {
  assertSameOrigin(request)
  const input = await readJson(request)
  validateArticle(input.articleId)
  if (input.website !== undefined && input.website !== '') throw new HttpError(400, '评论未提交，请重试。')
  if (typeof input.clientRequestId !== 'string' || !uuidPattern.test(input.clientRequestId)) throw new HttpError(400, '提交标识无效，请刷新后重试。')
  const nickname = plainText(input.nickname, 1, 24, '昵称')
  const body = plainText(input.body, 1, 1000, '评论')
  const now = Date.now()
  const id = crypto.randomUUID()
  const ipHash = await hash(`${new Date(now).toISOString().slice(0, 10)}:${request.headers.get('CF-Connecting-IP') || 'local'}`)
  // D1 batches are serial transactions: only an accepted submission can create a comment.
  // Separate submission records preserve rate limits and retry identity after a deletion.
  const inserted = await env.DB.batch([
    env.DB.prepare('DELETE FROM comment_submissions WHERE id IN (SELECT id FROM comment_submissions WHERE created_at < ? LIMIT 100)').bind(now - 7 * 86400000),
    env.DB.prepare(`INSERT INTO comment_submissions (id, owner_hash, client_request_id, ip_hash, created_at)
      SELECT ?, ?, ?, ?, ?
      WHERE NOT EXISTS (SELECT 1 FROM comment_submissions WHERE owner_hash = ? AND client_request_id = ?)
      AND NOT EXISTS (SELECT 1 FROM comment_submissions WHERE owner_hash = ? AND created_at > ?)
      AND (SELECT COUNT(*) FROM comment_submissions WHERE owner_hash = ? AND created_at > ?) < 50
      AND (SELECT COUNT(*) FROM comment_submissions WHERE ip_hash = ? AND created_at > ?) < 100`).bind(id, ownerHash, input.clientRequestId, ipHash, now, ownerHash, input.clientRequestId, ownerHash, now - 15000, ownerHash, now - 86400000, ipHash, now - 3600000),
    env.DB.prepare('INSERT INTO community_comments (id, article_id, owner_hash, nickname, body, created_at) SELECT ?, ?, ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM comment_submissions WHERE id = ?)').bind(id, input.articleId, ownerHash, nickname, body, now, id),
  ])
  if (inserted[2].meta.changes) return { status: 201, comment: commentView({ id, article_id: input.articleId, owner_hash: ownerHash, nickname, body, created_at: now }, ownerHash) }
  const earlier = await env.DB.prepare('SELECT c.* FROM comment_submissions s LEFT JOIN community_comments c ON c.id = s.id WHERE s.owner_hash = ? AND s.client_request_id = ?').bind(ownerHash, input.clientRequestId).first()
  if (earlier?.id) {
    if (earlier.article_id !== input.articleId || earlier.nickname !== nickname || earlier.body !== body) throw new HttpError(409, '本次提交已处理，请刷新评论后再试。')
    return { status: 200, comment: commentView(earlier, ownerHash) }
  }
  if (earlier) throw new HttpError(409, '该评论已删除，请重新填写后提交。')
  throw new HttpError(429, '评论发送过于频繁，请稍后再试。', { 'Retry-After': '15' })
}

async function deleteComment(request, env, ownerHash, id) {
  assertSameOrigin(request)
  if (!uuidPattern.test(id)) throw new HttpError(404, '未找到这条评论。')
  const result = await env.DB.prepare('DELETE FROM community_comments WHERE id = ? AND owner_hash = ?').bind(id, ownerHash).run()
  if (!result.meta.changes) {
    // A lost successful response can be retried by the original author.
    const ownSubmission = await env.DB.prepare('SELECT id FROM comment_submissions WHERE id = ? AND owner_hash = ?').bind(id, ownerHash).first()
    if (!ownSubmission) throw new HttpError(404, '评论不存在，或不属于当前浏览器。')
  }
  return { ok: true }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request)
    const isCollection = url.pathname === '/api/comments'
    const isItem = /^\/api\/comments\/[^/]+$/.test(url.pathname)
    if (!isCollection && !isItem) return json({ error: '未找到接口。' }, 404)
    let current
    try {
      if (!env.DB) throw new HttpError(503, '评论服务暂不可用，请稍后重试。')
      current = await session(request)
      const headers = current.cookie ? { 'Set-Cookie': current.cookie } : {}
      if (isCollection && request.method === 'GET') return json(await listComments(request, env, current.ownerHash), 200, headers)
      if (isCollection && request.method === 'POST') {
        const result = await createComment(request, env, current.ownerHash)
        return json({ comment: result.comment }, result.status, headers)
      }
      if (isItem && request.method === 'DELETE') return json(await deleteComment(request, env, current.ownerHash, url.pathname.split('/').pop()), 200, headers)
      return json({ error: '不支持此请求方式。' }, 405, { Allow: isCollection ? 'GET, POST' : 'DELETE' })
    } catch (error) {
      if (error instanceof HttpError) return json({ error: error.message }, error.status, { ...error.headers, ...(current?.cookie ? { 'Set-Cookie': current.cookie } : {}) })
      console.error('Comment service failure:', error instanceof Error ? error.message : 'unknown error')
      return json({ error: '评论服务暂不可用，请稍后重试。' }, 503)
    }
  },
}
