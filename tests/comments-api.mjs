import assert from 'node:assert/strict'

const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:5173'
assert.ok(/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin), 'API tests must run against local preview only')
const articleId = 'knowledge-first-document'
async function request(path, { cookie, method = 'GET', body, from = origin } = {}) {
  const response = await fetch(origin + path, {
    method,
    headers: { ...(cookie ? { Cookie: cookie } : {}), ...(method !== 'GET' ? { Origin: from, 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const payload = response.headers.get('content-type')?.includes('application/json') ? await response.json() : await response.text()
  return { status: response.status, payload, cookie: response.headers.get('set-cookie')?.split(';')[0], allow: response.headers.get('allow') }
}

for (const path of ['/', '/community/', '/community/article/?id=yaojing-culture-wall', '/account/']) {
  assert.equal((await request(path)).status, 200, `Page ${path} should load`)
}
const first = await request(`/api/comments?articleId=${articleId}`)
assert.equal(first.status, 200)
assert.ok(first.cookie, 'Initial read should establish comment ownership session')
const cookie = first.cookie
const other = await request(`/api/comments?articleId=${articleId}`)
assert.ok(other.cookie)
const newProfile = await request('/api/comments/mine')
assert.equal(newProfile.status, 200)
assert.ok(newProfile.cookie, 'Personal center should establish the same comment ownership session')
assert.deepEqual(newProfile.payload, { comments: [], total: 0, nextCursor: null }, 'New visitor should have no personal comments')
assert.equal((await request('/api/comments/mine?cursor=invalid', { cookie })).status, 400)
const wrongMethod = await request('/api/comments/mine', { cookie, method: 'DELETE' })
assert.equal(wrongMethod.status, 405, 'The mine route must not be treated as a comment ID')
assert.equal(wrongMethod.allow, 'GET')
const body = { articleId, nickname: '本地联调', body: '仅本地验证，随后删除。<script>alert(1)</script>', clientRequestId: crypto.randomUUID(), website: '' }
assert.equal((await request('/api/comments', { cookie, method: 'POST', body: { ...body, body: '  ' } })).status, 400)
assert.equal((await request('/api/comments', { cookie, method: 'POST', body: { ...body, nickname: 'a'.repeat(25) } })).status, 400)
assert.equal((await request('/api/comments', { cookie, method: 'POST', body: { ...body, body: 'a'.repeat(1001) } })).status, 400)
assert.equal((await request('/api/comments', { cookie, method: 'POST', body, from: 'https://unrelated.example' })).status, 403)
const created = await request('/api/comments', { cookie, method: 'POST', body })
assert.ok([200, 201].includes(created.status), JSON.stringify(created.payload))
const id = created.payload.comment.id
try {
  assert.equal(created.payload.comment.body, body.body, 'Text should remain plain text')
  assert.equal(created.payload.comment.canDelete, true)
  const duplicate = await request('/api/comments', { cookie, method: 'POST', body })
  assert.ok([200, 201].includes(duplicate.status))
  assert.equal(duplicate.payload.comment.id, id, 'A retry must not duplicate a comment')
  const limited = await request('/api/comments', { cookie, method: 'POST', body: { ...body, clientRequestId: crypto.randomUUID() } })
  assert.equal(limited.status, 429, 'Repeated posting should be rate limited')
  const shared = await request(`/api/comments?articleId=${articleId}`, { cookie: other.cookie })
  assert.equal(shared.payload.comments.find(row => row.id === id)?.canDelete, false, 'Other visitor should see comment without ownership')
  const mine = await request('/api/comments/mine', { cookie })
  assert.equal(mine.status, 200)
  assert.equal(mine.payload.total, 1)
  assert.deepEqual(mine.payload.comments, [created.payload.comment], 'Personal center should return the author\'s existing article comment')
  assert.equal(mine.payload.nextCursor, null)
  assert.ok(!JSON.stringify(mine.payload).includes('owner_hash'), 'API must not expose ownership hashes')
  const cursor = `${Date.parse(created.payload.comment.createdAt)}:${id}`
  const nextMine = await request(`/api/comments/mine?cursor=${encodeURIComponent(cursor)}`, { cookie })
  assert.equal(nextMine.status, 200)
  assert.equal(nextMine.payload.total, 1, 'Pagination total describes all owned comments')
  assert.deepEqual(nextMine.payload.comments, [], 'A cursor excludes the last displayed row')
  const notMine = await request(`/api/comments/mine?ownerHash=${encodeURIComponent(cookie)}&articleId=${articleId}`, { cookie: other.cookie })
  assert.deepEqual(notMine.payload, { comments: [], total: 0, nextCursor: null }, 'Another browser cannot select someone else\'s comments via query parameters')
  const separate = await request('/api/comments?articleId=yaojing-culture-wall', { cookie })
  assert.ok(!separate.payload.comments.some(row => row.id === id), 'Comments belong to one article')
  const denied = await request(`/api/comments/${id}`, { cookie: other.cookie, method: 'DELETE' })
  assert.ok([403, 404].includes(denied.status), 'Another visitor cannot delete the comment')
} finally {
  assert.equal((await request(`/api/comments/${id}`, { cookie, method: 'DELETE' })).status, 200, 'Author can delete own comment')
  assert.equal((await request(`/api/comments/${id}`, { cookie, method: 'DELETE' })).status, 200, 'Owner deletion can be safely retried')
}
const after = await request(`/api/comments?articleId=${articleId}`, { cookie })
assert.ok(!after.payload.comments.some(row => row.id === id))
const mineAfter = await request('/api/comments/mine', { cookie })
assert.deepEqual(mineAfter.payload, { comments: [], total: 0, nextCursor: null }, 'Deleted comment should disappear from personal center')
console.log('Passed: page routes, validation, origin checks, persistence across visitors, idempotency, article isolation, cooldown, personal comment isolation/pagination and owner-only deletion.')
