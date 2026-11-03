import { useCallback, useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import './article-comments.css'
import { useUserProfile } from './useUserProfile'

type CommentItem = {
  id: string
  articleId: string
  nickname: string
  body: string
  createdAt: string | number
  canDelete: boolean
}
type CommentPage = { comments: CommentItem[]; total: number; nextCursor: string | null }
type ApiMessage = { error?: string | { message?: string }; message?: string }

function errorMessage(value: ApiMessage, status: number) {
  const message = typeof value.error === 'string' ? value.error : value.error?.message || value.message
  if (message) return message
  if (status === 429) return '操作有些频繁，请稍后再试。'
  if (status === 403) return '当前操作未获允许，请刷新页面后重试。'
  return '暂时无法完成操作，请稍后重试。'
}

async function readResponse<T>(response: Response): Promise<T> {
  let value: unknown
  try { value = await response.json() }
  catch { throw new Error('评论服务暂时不可用，请稍后重试。') }
  if (!response.ok) throw new Error(errorMessage(value && typeof value === 'object' ? value as ApiMessage : {}, response.status))
  return value as T
}

function formatTime(value: string | number) {
  const timestamp = typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return '刚刚'
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(date)
}

function isComment(value: unknown): value is CommentItem {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<CommentItem>
  return typeof item.id === 'string' && typeof item.articleId === 'string' && typeof item.nickname === 'string' && typeof item.body === 'string' && (typeof item.createdAt === 'string' || typeof item.createdAt === 'number')
}

function requestError(error: unknown, fallback: string) {
  if (error instanceof TypeError) return '网络连接失败，请检查网络后重试。'
  return error instanceof Error ? error.message : fallback
}

export default function ArticleComments({ articleId }: { articleId: string }) {
  const { profile } = useUserProfile()
  const [comments, setComments] = useState<CommentItem[]>([])
  const [total, setTotal] = useState<number | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [listError, setListError] = useState('')
  const [nickname, setNickname] = useState(profile.nickname)
  const [body, setBody] = useState('')
  const [website, setWebsite] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [notice, setNotice] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const submitLock = useRef(false)
  const deleteLock = useRef(false)
  const pageLock = useRef(false)
  const listHeadingRef = useRef<HTMLHeadingElement>(null)
  const pendingRequest = useRef<{ fingerprint: string; id: string } | null>(null)
  const previousProfileName = useRef(profile.nickname)

  useEffect(() => {
    const previous = previousProfileName.current
    setNickname(current => current === previous ? profile.nickname : current)
    previousProfileName.current = profile.nickname
  }, [profile.nickname])

  const loadComments = useCallback(async (cursor: string | null, signal?: AbortSignal) => {
    if (pageLock.current && !signal) return
    pageLock.current = true
    if (cursor) setLoadingMore(true)
    else setLoading(true)
    setListError('')
    try {
      const query = new URLSearchParams({ articleId })
      if (cursor) query.set('cursor', cursor)
      const response = await fetch(`/api/comments?${query}`, { credentials: 'same-origin', signal })
      const result = await readResponse<CommentPage>(response)
      if (!Array.isArray(result.comments) || !result.comments.every(isComment) || typeof result.total !== 'number') throw new Error('评论数据暂时无法读取，请重试。')
      if (signal?.aborted) return
      setComments(previous => cursor ? [...previous, ...result.comments.filter(item => !previous.some(existing => existing.id === item.id))] : result.comments)
      setTotal(result.total)
      setNextCursor(result.nextCursor || null)
    } catch (error) {
      if (!signal?.aborted) setListError(requestError(error, '评论加载失败，请检查网络后重试。'))
    } finally {
      if (!signal?.aborted) {
        pageLock.current = false
        setLoading(false)
        setLoadingMore(false)
      }
    }
  }, [articleId])

  useEffect(() => {
    const controller = new AbortController()
    setComments([])
    setTotal(null)
    setNextCursor(null)
    setNotice('')
    setConfirmDelete(null)
    pendingRequest.current = null
    void loadComments(null, controller.signal)
    return () => { controller.abort(); pageLock.current = false }
  }, [loadComments])

  function editNickname(value: string) {
    setNickname(value)
    setSubmitError('')
    setNotice('')
    pendingRequest.current = null
  }
  function editBody(value: string) {
    setBody(value)
    setSubmitError('')
    setNotice('')
    pendingRequest.current = null
  }

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitLock.current || loading || loadingMore || removingId || total === null) return
    const cleanNickname = nickname.trim()
    const cleanBody = body.trim()
    if (!cleanNickname || cleanNickname.length > 24) { setSubmitError('请填写 1–24 字的昵称。'); return }
    if (!cleanBody || cleanBody.length > 1000) { setSubmitError('请填写 1–1000 字的评论。'); return }
    const fingerprint = JSON.stringify({ articleId, nickname: cleanNickname, body: cleanBody })
    if (!pendingRequest.current || pendingRequest.current.fingerprint !== fingerprint) pendingRequest.current = { fingerprint, id: crypto.randomUUID() }
    submitLock.current = true
    setSubmitting(true)
    setSubmitError('')
    setNotice('')
    try {
      const response = await fetch('/api/comments', {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, nickname: cleanNickname, body: cleanBody, clientRequestId: pendingRequest.current.id, website }),
      })
      const result = await readResponse<{ comment: CommentItem }>(response)
      if (!isComment(result.comment)) throw new Error('暂时未能确认发布结果，请重试；相同请求不会重复发布。')
      const alreadyVisible = comments.some(item => item.id === result.comment.id)
      setComments(previous => [result.comment, ...previous.filter(item => item.id !== result.comment.id)])
      if (!alreadyVisible) setTotal(previous => (previous ?? comments.length) + 1)
      setNickname(cleanNickname)
      setBody('')
      pendingRequest.current = null
      setNotice('评论已发布，感谢分享。')
    } catch (error) {
      setSubmitError(requestError(error, '发布失败，请检查网络后重试。'))
    } finally { submitLock.current = false; setSubmitting(false) }
  }

  async function removeComment(id: string) {
    if (deleteLock.current || submitting || loadingMore) return
    deleteLock.current = true
    setRemovingId(id)
    setDeleteError('')
    try {
      const response = await fetch(`/api/comments/${encodeURIComponent(id)}`, { method: 'DELETE', credentials: 'same-origin' })
      await readResponse<{ ok: boolean }>(response)
      setComments(previous => previous.filter(item => item.id !== id))
      setTotal(previous => previous === null ? null : Math.max(0, previous - 1))
      setConfirmDelete(null)
      setNotice('这条评论已删除。')
      requestAnimationFrame(() => listHeadingRef.current?.focus({ preventScroll: true }))
    } catch (error) { setDeleteError(requestError(error, '删除失败，请稍后重试。')) }
    finally { deleteLock.current = false; setRemovingId(null) }
  }

  const mutationBusy = submitting || removingId !== null
  return <section className="article-comments" id="article-comments" aria-labelledby="article-comments-heading">
    <div className="comments-heading"><div><p className="eyebrow">JOIN THE CONVERSATION</p><h2 id="article-comments-heading">评论与交流{total !== null && <span>{total}</span>}</h2></div><span className="comments-heading-note">让好想法继续发生</span></div>
    <form className="comment-form" onSubmit={submitComment}>
      <label className="comment-name-label" htmlFor="comment-nickname">你的昵称<input id="comment-nickname" name="nickname" autoComplete="nickname" placeholder="怎么称呼你？" value={nickname} onChange={event => editNickname(event.target.value)} maxLength={24} required disabled={submitting} /></label>
      <label className="comment-body-label" htmlFor="comment-body">分享你的想法<textarea id="comment-body" name="body" placeholder="聊聊你的感受、问题，或者一次相关的实践…" value={body} onChange={event => editBody(event.target.value)} maxLength={1000} rows={5} required disabled={submitting} aria-describedby="comment-public-note comment-character-count" /></label>
      <div className="comment-honeypot" aria-hidden="true"><label htmlFor="comment-website">Website<input id="comment-website" name="website" value={website} onChange={event => setWebsite(event.target.value)} autoComplete="off" tabIndex={-1} /></label></div>
      <div className="comment-form-meta"><p id="comment-public-note">评论发布后公开展示，请友善交流。你可以在当前浏览器删除自己的评论。</p><span id="comment-character-count">{body.length} / 1000</span></div>
      <div className="comment-form-actions"><div className="comment-feedback" aria-live="polite">{submitError ? <p className="comment-error" role="alert">{submitError}</p> : notice ? <p className="comment-success" role="status">{notice}</p> : <span>每一个认真表达的想法，都值得被看见。</span>}</div><button className="comment-submit" type="submit" disabled={mutationBusy || loading || loadingMore || total === null}>{submitting ? '正在发布…' : '发布评论'}<span aria-hidden="true">↗</span></button></div>
    </form>
    <div className="comment-list-heading"><h3 ref={listHeadingRef} tabIndex={-1}>全部评论{total !== null && <span>（{total}）</span>}</h3><span>最新发布在前</span></div>
    {loading ? <div className="comment-list-state" role="status"><span className="comment-loading-dot" />正在加载评论…</div> : <>
      {listError && <div className="comment-list-error" role="alert"><p>{listError}</p><button type="button" disabled={mutationBusy || loadingMore} onClick={() => void loadComments(comments.length ? nextCursor : null)}>{loadingMore ? '正在重试…' : '重新加载'}</button></div>}
      {!listError && comments.length === 0 && <div className="comment-list-state comment-empty"><svg aria-hidden="true" width="34" height="34" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M6 5h20a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H13l-7 5v-5H5a2 2 0 0 1-2-2V8a3 3 0 0 1 3-3Z" /><path d="M9 11h14M9 17h9" /></svg><strong>还没有评论</strong><p>成为第一位分享想法的人。</p></div>}
      {comments.length > 0 && <ul className="comment-list">{comments.map(item => <li className="comment-item" key={item.id}><span className="comment-avatar" aria-hidden="true">{Array.from(item.nickname)[0] || '访'}</span><div className="comment-item-content"><div className="comment-item-meta"><strong>{item.nickname}</strong>{item.canDelete && <span className="comment-own-label">我</span>}<time>{formatTime(item.createdAt)}</time></div><p className="comment-text">{item.body}</p>{item.canDelete && <div className="comment-item-actions">{confirmDelete === item.id ? <div className="comment-delete-confirm"><span>确定删除这条评论？</span><button type="button" className="comment-delete-action" disabled={mutationBusy || loadingMore} onClick={() => void removeComment(item.id)}>{removingId === item.id ? '正在删除…' : '确认删除'}</button><button type="button" disabled={removingId === item.id} onClick={() => { setConfirmDelete(null); setDeleteError('') }}>取消</button>{deleteError && <p className="comment-error" role="alert">{deleteError}</p>}</div> : <button type="button" disabled={mutationBusy || loadingMore} onClick={() => { setConfirmDelete(item.id); setDeleteError('') }}>删除</button>}</div>}</div></li>)}</ul>}
      {nextCursor && !listError && <button className="comment-load-more" type="button" disabled={loadingMore || mutationBusy} onClick={() => void loadComments(nextCursor)}>{loadingMore ? '正在加载…' : '加载更多评论'}</button>}
    </>}
  </section>
}
