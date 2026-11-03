import { useCallback, useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, ArrowUpRight, Check } from './icons'
import { communityArticleUrl, communityPosts } from './communityPosts'
import { useCommunitySaved } from './useCommunitySaved'
import { avatarOptions, useUserProfile } from './useUserProfile'
import type { UserProfile } from './useUserProfile'
import UserAvatar from './UserAvatar'
import MyArticles from './MyArticles'
import { useMyArticles } from './useMyArticles'
import './account-page.css'

type Tab = 'articles' | 'saved' | 'comments' | 'profile'
type OwnComment = { id: string; articleId: string; nickname: string; body: string; createdAt: string | number; canDelete: boolean }
type CommentResult = { comments: OwnComment[]; total: number; nextCursor: string | null }
const tabs: { id: Tab; title: string; description: string }[] = [
  { id: 'articles', title: '我的文章', description: '写下你的发现与思考，让每一个好想法慢慢成篇。' },
  { id: 'saved', title: '我的收藏', description: '把感兴趣的内容留在这里，随时回来继续阅读。' },
  { id: 'comments', title: '我的评论', description: '回看自己的想法，让每一次交流都有迹可循。' },
  { id: 'profile', title: '个人资料', description: '选一个喜欢的头像，让大家更好地认识你。' },
]

function currentTab(): Tab {
  const hash = window.location.hash.slice(1)
  return hash === 'saved' || hash === 'comments' || hash === 'profile' ? hash : 'articles'
}

function AccountIcon({ name, size = 20 }: { name: Tab; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{name === 'articles' ? <><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h4M9 12h6m-6 4h6" /></> : name === 'saved' ? <path d="M6 4h12v17l-6-4-6 4V4Z" /> : name === 'comments' ? <path d="M4 4h16v12H9l-5 4V4Zm4 5h8m-8 3h5" /> : <><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></>}</svg>
}

function formatDate(value: string | number) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(date)
}

async function readCommentResponse<T>(response: Response): Promise<T> {
  let result: unknown
  try { result = await response.json() }
  catch { throw new Error('评论服务暂时不可用，请稍后重试。') }
  if (!response.ok) {
    const message = result && typeof result === 'object' && 'error' in result && typeof result.error === 'string' ? result.error : '暂时无法完成操作，请稍后重试。'
    throw new Error(message)
  }
  return result as T
}

export default function AccountPage() {
  const { profile, saveProfile, storageNotice: profileStorageNotice } = useUserProfile()
  const { saved, toggleSaved, storageNotice } = useCommunitySaved()
  const myArticles = useMyArticles()
  const [tab, setTab] = useState<Tab>(currentTab)
  const [draft, setDraft] = useState<UserProfile>(profile)
  const [profileNotice, setProfileNotice] = useState('')
  const [profileError, setProfileError] = useState('')
  const [comments, setComments] = useState<OwnComment[]>([])
  const [total, setTotal] = useState<number | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const [commentNotice, setCommentNotice] = useState('')
  const loadingLock = useRef(false)
  const deleteLock = useRef(false)
  const savedPosts = saved.map(id => communityPosts.find(post => post.id === id)).filter(post => post !== undefined).reverse()
  const activeTab = tabs.find(item => item.id === tab)!
  const draftChanged = draft.nickname !== profile.nickname || draft.bio !== profile.bio || draft.avatar !== profile.avatar

  useEffect(() => {
    document.title = '个人中心 — 曜境 YAOJING'
    const syncTab = () => setTab(currentTab())
    window.addEventListener('hashchange', syncTab)
    return () => window.removeEventListener('hashchange', syncTab)
  }, [])

  useEffect(() => { setDraft(profile) }, [profile])

  const loadComments = useCallback(async (cursor: string | null, signal?: AbortSignal) => {
    if (loadingLock.current && !signal) return
    loadingLock.current = true
    if (cursor) setLoadingMore(true)
    else setLoading(true)
    setLoadError('')
    try {
      const params = cursor ? `?${new URLSearchParams({ cursor })}` : ''
      const response = await fetch(`/api/comments/mine${params}`, { credentials: 'same-origin', signal })
      const result = await readCommentResponse<CommentResult>(response)
      if (!Array.isArray(result.comments) || !result.comments.every(item => typeof item.id === 'string' && typeof item.articleId === 'string' && typeof item.body === 'string' && typeof item.nickname === 'string') || typeof result.total !== 'number') throw new Error('评论数据暂时无法读取，请重试。')
      if (signal?.aborted) return
      setComments(previous => cursor ? [...previous, ...result.comments.filter(item => !previous.some(existing => existing.id === item.id))] : result.comments)
      setTotal(result.total)
      setNextCursor(result.nextCursor || null)
    } catch (error) {
      if (!signal?.aborted) setLoadError(error instanceof TypeError ? '网络连接失败，请检查网络后重试。' : error instanceof Error ? error.message : '评论加载失败，请重试。')
    } finally {
      if (!signal?.aborted) { loadingLock.current = false; setLoading(false); setLoadingMore(false) }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void loadComments(null, controller.signal)
    return () => { controller.abort(); loadingLock.current = false }
  }, [loadComments])

  function selectTab(next: Tab) {
    setTab(next)
    window.history.replaceState(null, '', `#${next}`)
  }

  function updateDraft(patch: Partial<UserProfile>) {
    setDraft(previous => ({ ...previous, ...patch }))
    setProfileNotice('')
    setProfileError('')
  }

  function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nickname = draft.nickname.trim()
    const bio = draft.bio.trim()
    if (!nickname || Array.from(nickname).length > 24) { setProfileError('请填写 1–24 个字的昵称。'); return }
    if (Array.from(bio).length > 120) { setProfileError('个人简介最多填写 120 个字。'); return }
    const next = { ...draft, nickname, bio }
    const persisted = saveProfile(next)
    if (!persisted) {
      setProfileNotice('')
      setProfileError('浏览器未允许保存资料，请开启网站存储后重试。')
      return
    }
    setDraft(next)
    setProfileError('')
    setProfileNotice('资料已保存，导航头像与昵称已同步更新。')
  }

  async function removeComment(id: string) {
    if (deleteLock.current || loadingLock.current) return
    deleteLock.current = true
    setRemovingId(id)
    setDeleteError('')
    setCommentNotice('')
    try {
      await readCommentResponse(await fetch(`/api/comments/${encodeURIComponent(id)}`, { method: 'DELETE', credentials: 'same-origin' }))
      setComments(previous => previous.filter(item => item.id !== id))
      setTotal(previous => previous === null ? null : Math.max(0, previous - 1))
      setConfirmDelete(null)
      setCommentNotice('这条评论已删除。')
    } catch (error) {
      setDeleteError(error instanceof TypeError ? '网络连接失败，请重试。' : error instanceof Error ? error.message : '删除失败，请重试。')
    } finally { deleteLock.current = false; setRemovingId(null) }
  }

  return <div className="account-page" id="account-top">
    <div className="account-heading wrap">
      <nav className="community-breadcrumb" aria-label="面包屑"><a href="/#home">首页</a><span aria-hidden="true">/</span><span aria-current="page">个人中心</span></nav>
      <div className="account-heading-row"><div><p className="eyebrow">PERSONAL CENTER / YAOJING</p><h1>我的个人中心</h1><p className="account-heading-description">收藏灵感，留下思考，与曜境一起探索更多可能。</p></div><a className="account-community-link" href="/community/">发现社区动态 <ArrowUpRight size={17} /></a></div>
    </div>
    <div className="account-layout wrap">
      <aside className="account-sidebar" aria-label="个人概览">
        <section className="account-profile-card">
          <div className="account-profile-banner" aria-hidden="true"><span /><span /><span /></div>
          <div className="account-profile-summary"><UserAvatar profile={profile} size={80} className="account-profile-avatar" /><span className="account-profile-label">YAOJING COMMUNITY</span><h2>{profile.nickname}</h2><p>{profile.bio || '保持好奇，让每一个想法都有新的可能。'}</p><button className="account-edit-link" onClick={() => selectTab('profile')}>编辑个人资料 <ArrowUpRight size={14} /></button></div>
          <div className="account-statistics has-articles"><button onClick={() => selectTab('articles')} aria-label={`查看我的 ${myArticles.articles.length} 篇文章`}><strong>{myArticles.articles.length.toString().padStart(2, '0')}</strong><span>我的文章</span></button><button onClick={() => selectTab('saved')} aria-label={`查看我的 ${saved.length} 篇收藏`}><strong>{saved.length.toString().padStart(2, '0')}</strong><span>我的收藏</span></button><button onClick={() => selectTab('comments')} aria-label="查看我的评论"><strong>{total === null ? '—' : total.toString().padStart(2, '0')}</strong><span>我的评论</span></button></div>
        </section>
        <div className="account-sidebar-note"><span className="account-note-symbol" aria-hidden="true">✦</span><h3>每一次交流，都有价值。</h3><p>读一篇文章，记录一个想法。让灵感在分享中生长。</p><a href="/community/">去社区看看 <ArrowRight size={15} /></a></div>
        <p className="account-browser-note">资料、文章草稿与收藏保存在当前浏览器。评论通过当前浏览器识别归属。</p>
      </aside>
      <section className="account-main" aria-label="个人中心内容">
        <div className="account-tabs" role="group" aria-label="个人中心栏目">{tabs.map(item => <button key={item.id} type="button" aria-pressed={tab === item.id} className={tab === item.id ? 'is-active' : ''} onClick={() => selectTab(item.id)}><AccountIcon name={item.id} size={18} />{item.title}{item.id === 'articles' && <span>{myArticles.articles.length}</span>}{item.id === 'saved' && <span>{saved.length}</span>}{item.id === 'comments' && total !== null && <span>{total}</span>}</button>)}</div>
        <div className="account-panel">
          <div className="account-panel-heading"><div><h2>{activeTab.title}</h2><p>{activeTab.description}</p></div>{tab === 'comments' && <button className="account-refresh" onClick={() => void loadComments(null)} disabled={loading || loadingMore || removingId !== null}>刷新</button>}{tab === 'saved' && <span className="account-panel-total">{saved.length} 篇文章</span>}</div>
          <div hidden={tab !== 'articles'}><MyArticles {...myArticles} authorName={profile.nickname} /></div>
          {tab === 'saved' && <>
            {savedPosts.length > 0 ? <ul className="account-saved-list">{savedPosts.map(post => <li key={post.id}><a className={`account-saved-cover ${!post.cover ? 'is-placeholder' : ''}`} href={communityArticleUrl(post.id)} target="_blank" rel="noopener noreferrer" aria-label={`阅读：${post.title}`}>{post.cover ? <img src={post.cover.src} alt="" loading="lazy" /> : <><AccountIcon name="saved" size={31} /><span>YAOJING INSIGHTS</span></>}</a><div className="account-saved-copy"><span className="account-category">{post.category}<i />{post.readTime}</span><a href={communityArticleUrl(post.id)} target="_blank" rel="noopener noreferrer"><h3>{post.title}</h3></a><p>{post.summary}</p><div className="account-saved-actions"><a href={communityArticleUrl(post.id)} target="_blank" rel="noopener noreferrer">继续阅读 <ArrowUpRight size={14} /></a><button onClick={() => toggleSaved(post.id)} aria-label={`取消收藏：${post.title}`}>取消收藏</button></div></div></li>)}</ul> : <div className="account-empty"><div className="account-empty-art"><AccountIcon name="saved" size={36} /><span aria-hidden="true">+</span></div><h3>你的灵感书架，等你开启</h3><p>遇见喜欢的文章，点击「收藏文章」，<br />下次就能在这里轻松找到。</p><a className="button" href="/community/">发现值得收藏的内容 <ArrowRight size={16} /></a></div>}
            <p className="account-storage-note">{storageNotice}</p>
          </>}
          {tab === 'comments' && <>
            <p className="account-comment-scope">这里展示你在当前浏览器发布的评论。</p>
            {loading && <div className="account-loading" role="status"><span />正在加载你的评论…</div>}
            {!loading && loadError && <div className="account-load-error" role="alert"><p>{loadError}</p><button onClick={() => void loadComments(comments.length > 0 ? nextCursor : null)} disabled={loadingMore}>重新加载 <ArrowRight size={14} /></button></div>}
            {!loading && !loadError && comments.length === 0 && !nextCursor && <div className="account-empty"><div className="account-empty-art"><AccountIcon name="comments" size={36} /><span aria-hidden="true">✦</span></div><h3>让交流，从你的第一个想法开始</h3><p>读完一篇文章后，留下你的观点，<br />与更多好奇的同行者一起讨论。</p><a className="button" href="/community/">去社区参与交流 <ArrowRight size={16} /></a></div>}
            {!loading && comments.length > 0 && <ul className="account-comment-list">{comments.map(comment => {
              const article = communityPosts.find(post => post.id === comment.articleId)
              return <li key={comment.id}><div className="account-comment-meta"><UserAvatar profile={{ ...profile, nickname: comment.nickname }} size={30} /><strong>{comment.nickname}</strong><time dateTime={new Date(comment.createdAt).toISOString()}>{formatDate(comment.createdAt)}</time></div><p className="account-comment-body">{comment.body}</p><a className="account-comment-source" href={`${communityArticleUrl(comment.articleId)}#article-comments`} target="_blank" rel="noopener noreferrer"><span>评论于</span>{article?.title || '查看原文'}<ArrowUpRight size={14} /></a><div className="account-comment-actions">{confirmDelete === comment.id ? <div className="account-delete-confirm"><span>确定删除这条评论？</span><button className="is-danger" disabled={removingId !== null || loadingMore} onClick={() => void removeComment(comment.id)}>{removingId === comment.id ? '正在删除…' : '确认删除'}</button><button disabled={removingId !== null} onClick={() => { setConfirmDelete(null); setDeleteError('') }}>取消</button>{deleteError && <p role="alert">{deleteError}</p>}</div> : <button onClick={() => { setConfirmDelete(comment.id); setDeleteError(''); setCommentNotice('') }} disabled={removingId !== null || loadingMore}>删除评论</button>}</div></li>
            })}</ul>}
            {!loading && nextCursor && <button className="account-load-more" disabled={loadingMore || removingId !== null} onClick={() => void loadComments(nextCursor)}>{loadingMore ? '正在加载…' : '加载更多评论'}</button>}
            <p className="account-action-notice" role="status">{commentNotice}</p>
          </>}
          {tab === 'profile' && <form className="account-profile-form" onSubmit={submitProfile}>
            <fieldset className="account-avatar-picker"><legend>个人头像</legend><div className="account-avatar-settings"><UserAvatar profile={draft} size={76} /><div><p>选择你的专属色彩</p><div className="account-avatar-options">{avatarOptions.map(option => <label key={option.id} title={option.label}><input type="radio" name="avatar" value={option.id} checked={draft.avatar === option.id} onChange={() => updateDraft({ avatar: option.id })} /><span style={{ background: `linear-gradient(145deg, ${option.from}, ${option.to})` }}>{draft.avatar === option.id && <Check size={17} />}</span><span className="account-visually-hidden">{option.label}</span></label>)}</div></div></div></fieldset>
            <label className="account-form-label" htmlFor="account-nickname"><span>昵称 <em>*</em></span><input id="account-nickname" name="nickname" autoComplete="nickname" value={draft.nickname} onChange={event => updateDraft({ nickname: event.target.value })} placeholder="怎么称呼你？" maxLength={24} required /><small>用于导航与新评论，已有评论的署名保持不变。</small></label>
            <label className="account-form-label" htmlFor="account-bio"><span>个人简介 <i>选填</i></span><textarea id="account-bio" name="bio" rows={4} value={draft.bio} onChange={event => updateDraft({ bio: event.target.value })} maxLength={120} placeholder="一句话介绍自己，分享你的兴趣与探索方向。" /><small className="account-field-count">{Array.from(draft.bio).length} / 120</small></label>
            {profileError && <p className="account-form-error" role="alert">{profileError}</p>}
            <div className="account-form-actions"><button type="submit" className="button" disabled={!draftChanged}>保存资料 <Check size={16} /></button><button type="button" className="account-cancel" disabled={!draftChanged} onClick={() => { setDraft(profile); setProfileNotice(''); setProfileError('') }}>取消修改</button></div>
            <p className="account-action-notice" role="status">{profileNotice}</p>
            <p className="account-storage-note">{profileStorageNotice}</p>
          </form>}
        </div>
      </section>
    </div>
  </div>
}
