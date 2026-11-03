import { useEffect, useState } from 'react'

export type LocalArticle = {
  id: string
  title: string
  category: string
  summary: string
  body: string
  createdAt: number
  updatedAt: number
}

export type ArticleInput = {
  id?: string
  title: string
  category: string
  summary: string
  body: string
  expectedUpdatedAt?: number
}

export type ArticleResult = { ok: true; article?: LocalArticle } | { ok: false; error: string }

const storageKey = 'yaojing-my-articles'
const changeEvent = 'yaojing-my-articles-change'
const defaultNotice = '草稿仅保存在当前浏览器，尚未公开发布。'
const categories = new Set(['曜境日常', '技术分享', '产品更新', '社区活动'])
const maxArticles = 50
const idPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i

type Snapshot = { ok: true; articles: LocalArticle[]; raw: string | null } | { ok: false; error: string }
type ArticleState = { articles: LocalArticle[]; notice: string }

function textLength(value: string) { return Array.from(value).length }
function validTime(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 && value < 8640000000000000
}

function isArticle(value: unknown): value is LocalArticle {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const item = value as Partial<LocalArticle>
  return typeof item.id === 'string' && idPattern.test(item.id)
    && typeof item.title === 'string' && item.title.trim().length > 0 && textLength(item.title) <= 80
    && typeof item.category === 'string' && categories.has(item.category)
    && typeof item.summary === 'string' && textLength(item.summary) <= 160
    && typeof item.body === 'string' && item.body.trim().length > 0 && textLength(item.body) <= 20000
    && validTime(item.createdAt) && validTime(item.updatedAt) && item.updatedAt >= item.createdAt
}

function sortArticles(articles: LocalArticle[]) {
  return [...articles].sort((left, right) => right.updatedAt - left.updatedAt || left.id.localeCompare(right.id))
}

function readSnapshot(): Snapshot {
  let raw: string | null
  try { raw = localStorage.getItem(storageKey) }
  catch { return { ok: false, error: '无法读取草稿，请允许网站使用浏览器存储后重试。' } }
  if (raw === null) return { ok: true, articles: [], raw }
  try {
    const value: unknown = JSON.parse(raw)
    if (!Array.isArray(value) || value.length > maxArticles || !value.every(isArticle)
      || new Set(value.map(article => article.id)).size !== value.length) throw new Error('Invalid article data')
    return { ok: true, articles: sortArticles(value), raw }
  } catch {
    return { ok: false, error: '已保存的草稿数据暂时无法读取，原始数据已保留。请先备份并恢复草稿数据，再进行保存或删除。' }
  }
}

function initialState(): ArticleState {
  const snapshot = readSnapshot()
  return snapshot.ok
    ? { articles: snapshot.articles, notice: defaultNotice }
    : { articles: [], notice: snapshot.error }
}

export function useMyArticles() {
  const [state, setState] = useState<ArticleState>(initialState)

  useEffect(() => {
    const sync = () => {
      const snapshot = readSnapshot()
      setState(previous => snapshot.ok
        ? { articles: snapshot.articles, notice: defaultNotice }
        : { ...previous, notice: snapshot.error })
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) sync()
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener(changeEvent, sync)
    sync()
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(changeEvent, sync)
    }
  }, [])

  function fail(error: string): ArticleResult {
    setState(previous => ({ ...previous, notice: error }))
    return { ok: false, error }
  }

  function persist(snapshot: Extract<Snapshot, { ok: true }>, articles: LocalArticle[]): ArticleResult {
    const sorted = sortArticles(articles)
    try {
      // Recheck before writing so an intervening storage update is never knowingly replaced.
      if (localStorage.getItem(storageKey) !== snapshot.raw) {
        const latest = readSnapshot()
        if (latest.ok) setState({ articles: latest.articles, notice: defaultNotice })
        return fail('草稿列表刚刚发生变化，请重试。')
      }
      localStorage.setItem(storageKey, JSON.stringify(sorted))
    } catch (error) {
      const quotaExceeded = error instanceof DOMException && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
      return fail(quotaExceeded
        ? '浏览器存储空间不足，草稿未保存。请备份并清理不需要的草稿后重试。'
        : '浏览器未允许保存草稿，请开启网站存储后重试。')
    }
    setState({ articles: sorted, notice: defaultNotice })
    window.dispatchEvent(new Event(changeEvent))
    return { ok: true }
  }

  function saveArticle(input: ArticleInput): ArticleResult {
    if (typeof input.title !== 'string' || typeof input.body !== 'string' || typeof input.summary !== 'string') return fail('请填写文章标题和正文。')
    const title = input.title.trim()
    const body = input.body.replace(/\r\n?/g, '\n')
    const summary = input.summary.trim()
    if (!title || textLength(title) > 80) return fail('文章标题需为 1–80 个字。')
    if (!categories.has(input.category)) return fail('请选择有效的文章分类。')
    if (textLength(summary) > 160) return fail('文章摘要最多填写 160 个字。')
    if (!body.trim() || textLength(body) > 20000) return fail('文章正文需为 1–20000 个字。')

    const snapshot = readSnapshot()
    if (!snapshot.ok) return fail(snapshot.error)
    const existing = input.id ? snapshot.articles.find(article => article.id === input.id) : undefined
    if (input.id && !existing) {
      setState({ articles: snapshot.articles, notice: defaultNotice })
      return fail('这篇草稿已被删除，请返回列表后重新新建文章。')
    }
    if (existing && input.expectedUpdatedAt !== existing.updatedAt) {
      setState({ articles: snapshot.articles, notice: defaultNotice })
      return fail('这篇草稿已在另一页面更新。请先保留当前编辑内容，再返回列表打开最新版本。')
    }
    if (!existing && snapshot.articles.length >= maxArticles) return fail('最多可保存 50 篇草稿，请先备份并删除不需要的草稿。')

    let id: string
    try { id = existing?.id || crypto.randomUUID() }
    catch { return fail('暂时无法创建草稿，请刷新页面后重试。') }
    const now = Date.now()
    const article: LocalArticle = {
      id, title, category: input.category, summary, body,
      createdAt: existing?.createdAt ?? now,
      updatedAt: existing ? Math.max(now, existing.updatedAt + 1) : now,
    }
    const result = persist(snapshot, [...snapshot.articles.filter(item => item.id !== id), article])
    return result.ok ? { ok: true, article } : result
  }

  function deleteArticle(id: string, expectedUpdatedAt: number): ArticleResult {
    const snapshot = readSnapshot()
    if (!snapshot.ok) return fail(snapshot.error)
    const existing = snapshot.articles.find(article => article.id === id)
    if (!existing) {
      setState({ articles: snapshot.articles, notice: defaultNotice })
      return fail('这篇草稿已被删除，列表已更新。')
    }
    if (existing.updatedAt !== expectedUpdatedAt) {
      setState({ articles: snapshot.articles, notice: defaultNotice })
      return fail('这篇草稿已在另一页面更新，请检查最新内容后再删除。')
    }
    return persist(snapshot, snapshot.articles.filter(article => article.id !== id))
  }

  return { articles: state.articles, saveArticle, deleteArticle, storageNotice: state.notice }
}
