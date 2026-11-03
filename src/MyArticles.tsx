import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, Check, Plus } from './icons'
import type { ArticleInput, ArticleResult, LocalArticle } from './useMyArticles'
import './my-articles.css'

type MyArticlesProps = {
  articles: LocalArticle[]
  saveArticle: (input: ArticleInput) => ArticleResult
  deleteArticle: (id: string, expectedUpdatedAt: number) => ArticleResult
  storageNotice: string
  authorName: string
}
type EditorValues = { title: string; category: string; summary: string; body: string }
type View = 'list' | 'editor' | 'preview'
const categories = ['曜境日常', '技术分享', '产品更新', '社区活动']
const blankValues = (): EditorValues => ({ title: '', category: '技术分享', summary: '', body: '' })
const valuesOf = (article: LocalArticle): EditorValues => ({ title: article.title, category: article.category, summary: article.summary, body: article.body })
const letterCount = (value: string) => Array.from(value).length
const wordCount = (value: string) => letterCount(value.replace(/\s/g, ''))

function PaperIcon({ size = 22 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h4M9 12h6m-6 4h6" /></svg>
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(timestamp))
}

export default function MyArticles({ articles, saveArticle, deleteArticle, storageNotice, authorName }: MyArticlesProps) {
  const [view, setView] = useState<View>('list')
  const [values, setValues] = useState<EditorValues>(blankValues)
  const [baseline, setBaseline] = useState<EditorValues>(blankValues)
  const [editing, setEditing] = useState<{ id: string; updatedAt: number } | null>(null)
  const [preview, setPreview] = useState<LocalArticle | null>(null)
  const [confirmLeave, setConfirmLeave] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; updatedAt: number } | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const titleRef = useRef<HTMLInputElement>(null)
  const dirty = JSON.stringify(values) !== JSON.stringify(baseline)
  const activeEditor = view === 'editor' || (view === 'preview' && preview === null)

  useEffect(() => {
    if (!dirty || !activeEditor) return
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warnBeforeLeaving)
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving)
  }, [dirty, activeEditor])

  useEffect(() => {
    if (view === 'editor') titleRef.current?.focus()
  }, [view])

  function openEditor(article?: LocalArticle) {
    const next = article ? valuesOf(article) : blankValues()
    setValues(next)
    setBaseline(next)
    setEditing(article ? { id: article.id, updatedAt: article.updatedAt } : null)
    setPreview(null)
    setConfirmLeave(false)
    setConfirmDelete(null)
    setError('')
    setNotice('')
    setView('editor')
  }

  function changeValue(key: keyof EditorValues, value: string) {
    setValues(previous => ({ ...previous, [key]: value }))
    setError('')
    setNotice('')
  }

  function showList() {
    setView('list')
    setConfirmLeave(false)
    setError('')
    setPreview(null)
  }

  function requestList() {
    if (dirty) { setConfirmLeave(true); return }
    showList()
  }

  function saveDraft(returnToList = false) {
    const title = values.title.trim()
    const summary = values.summary.trim()
    const body = values.body.trim()
    if (!title || letterCount(title) > 80) { setError('请填写 1–80 个字的文章标题。'); titleRef.current?.focus(); return }
    if (letterCount(summary) > 160) { setError('文章摘要最多填写 160 个字。'); return }
    if (!body || letterCount(body) > 20000) { setError('请填写 1–20000 个字的文章正文。'); return }
    const result = saveArticle({ ...values, title, summary, body, ...(editing ? { id: editing.id, expectedUpdatedAt: editing.updatedAt } : {}) })
    if (!result.ok) { setError(result.error); setNotice(''); return }
    if (!result.article) { setError('暂时无法确认保存结果，请保留当前内容后重试。'); return }
    const saved = result.article
    const next = valuesOf(saved)
    setValues(next)
    setBaseline(next)
    setEditing({ id: saved.id, updatedAt: saved.updatedAt })
    setConfirmLeave(false)
    setError('')
    setNotice('草稿已保存，可在“我的文章”中继续编辑。')
    if (returnToList) setView('list')
  }

  function submitDraft(event: FormEvent<HTMLFormElement>) { event.preventDefault(); saveDraft() }

  function removeDraft(article: LocalArticle) {
    if (!confirmDelete || confirmDelete.id !== article.id) return
    const result = deleteArticle(article.id, confirmDelete.updatedAt)
    if (!result.ok) { setError(result.error); return }
    setConfirmDelete(null)
    setError('')
    setNotice('草稿已删除。')
  }

  function openPreview(article?: LocalArticle) {
    setPreview(article || null)
    setConfirmDelete(null)
    setError('')
    setView('preview')
  }

  const previewValues = preview || values
  const latestPreview = preview ? articles.find(article => article.id === preview.id) : undefined

  return <div className="my-articles">
    {view === 'list' && <>
      <div className="my-articles-toolbar"><div><span className="my-articles-draft-tag">草稿箱</span><span className="my-articles-total">共 {articles.length} 篇文章</span></div><button type="button" className="button my-articles-new" onClick={() => openEditor()}><Plus size={15} />新建文章</button></div>
      {articles.length === 0 ? <div className="account-empty my-articles-empty"><div className="account-empty-art"><PaperIcon size={37} /><span aria-hidden="true">+</span></div><h3>从一个想法，开始你的第一篇文章</h3><p>记录一次实践，分享一份发现。<br />先存为草稿，再慢慢打磨你的表达。</p><button type="button" className="button" onClick={() => openEditor()}>写第一篇文章 <ArrowRight size={16} /></button></div> : <ul className="my-articles-list">{articles.map(article => <li key={article.id}>
        <div className="my-articles-item-icon"><PaperIcon size={25} /></div><div className="my-articles-item-content"><div className="my-articles-item-meta"><span className="my-articles-draft-tag">草稿</span><span>{article.category}</span><span>{wordCount(article.body)} 字</span></div><button type="button" className="my-articles-title" onClick={() => openEditor(article)}><h3>{article.title}</h3></button><p className="my-articles-excerpt">{article.summary || article.body}</p><div className="my-articles-item-footer"><time dateTime={new Date(article.updatedAt).toISOString()}>更新于 {formatDate(article.updatedAt)}</time><div className="my-articles-item-actions"><button type="button" onClick={() => openEditor(article)} aria-label={`编辑：${article.title}`}>编辑</button><button type="button" onClick={() => openPreview(article)} aria-label={`预览：${article.title}`}>预览</button><button type="button" className="my-articles-delete" onClick={() => { setConfirmDelete({ id: article.id, updatedAt: article.updatedAt }); setError(''); setNotice('') }} aria-label={`删除：${article.title}`}>删除</button></div></div>{confirmDelete?.id === article.id && <div className="my-articles-confirm"><p>确定删除《{article.title}》？删除后无法恢复。</p><div><button type="button" className="my-articles-danger" onClick={() => removeDraft(article)}>确认删除</button><button type="button" onClick={() => { setConfirmDelete(null); setError('') }}>取消</button></div></div>}</div>
      </li>)}</ul>}
    </>}

    {view === 'editor' && <form className="my-articles-editor" onSubmit={submitDraft}>
      <div className="my-articles-editor-toolbar"><button type="button" className="my-articles-back" onClick={requestList}>← 返回文章列表</button><span className="my-articles-edit-status">{dirty ? '有未保存的修改' : editing ? '已保存草稿' : '新文章草稿'}</span></div>
      {confirmLeave && <div className="my-articles-confirm my-articles-leave" role="status"><p>还有未保存的内容，离开前要保存吗？</p><div><button type="button" onClick={() => saveDraft(true)}>保存并返回</button><button type="button" className="my-articles-danger" onClick={() => { setValues(baseline); setNotice(''); showList() }}>放弃修改</button><button type="button" onClick={() => setConfirmLeave(false)}>继续编辑</button></div></div>}
      <div className="my-articles-editor-topline"><label className="my-articles-field my-articles-title-field" htmlFor="my-article-title"><span>文章标题 <em>*</em></span><input ref={titleRef} id="my-article-title" name="articleTitle" value={values.title} onChange={event => changeValue('title', event.target.value)} maxLength={80} placeholder="给你的文章起一个标题" required /><small>{letterCount(values.title)} / 80</small></label><label className="my-articles-field my-articles-category-field" htmlFor="my-article-category"><span>文章分类</span><select id="my-article-category" value={values.category} onChange={event => changeValue('category', event.target.value)}>{categories.map(category => <option key={category} value={category}>{category}</option>)}</select></label></div>
      <label className="my-articles-field" htmlFor="my-article-summary"><span>文章摘要 <i>选填</i></span><textarea id="my-article-summary" name="articleSummary" value={values.summary} onChange={event => changeValue('summary', event.target.value)} maxLength={160} rows={2} placeholder="用一两句话，介绍这篇文章的主要内容" /><small>{letterCount(values.summary)} / 160</small></label>
      <label className="my-articles-field my-articles-body-field" htmlFor="my-article-body"><span>文章正文 <em>*</em></span><textarea id="my-article-body" name="articleBody" value={values.body} onChange={event => changeValue('body', event.target.value)} maxLength={20000} rows={12} placeholder="从你的观察、实践或一个值得分享的想法开始……" required /><small>{letterCount(values.body)} / 20000</small></label>
      <div className="my-articles-editor-actions"><button type="submit" className="button" disabled={!dirty && editing !== null}><Check size={16} />保存草稿</button><button type="button" className="my-articles-preview-button" onClick={() => openPreview()}>预览草稿</button></div>
    </form>}

    {view === 'preview' && <div className="my-articles-preview"><div className="my-articles-editor-toolbar"><button type="button" className="my-articles-back" onClick={() => { setView(preview ? 'list' : 'editor'); setError('') }}>{preview ? '← 返回文章列表' : '← 返回编辑'}</button>{preview ? <button type="button" className="my-articles-preview-button" disabled={!latestPreview} onClick={() => { if (latestPreview) openEditor(latestPreview) }}>继续编辑</button> : <span className="my-articles-edit-status">{dirty ? '预览未保存内容' : '草稿预览'}</span>}</div><article className="my-articles-reading"><div className="my-articles-item-meta"><span className="my-articles-draft-tag">草稿预览</span><span>{previewValues.category}</span><span>{wordCount(previewValues.body)} 字</span></div><h3>{previewValues.title || '未命名文章'}</h3><p className="my-articles-byline">{authorName}{preview && <><span aria-hidden="true"> · </span><time dateTime={new Date(preview.updatedAt).toISOString()}>{formatDate(preview.updatedAt)}</time></>}</p>{previewValues.summary && <p className="my-articles-reading-summary">{previewValues.summary}</p>}<div className="my-articles-reading-body">{previewValues.body ? previewValues.body.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>) : <p className="my-articles-no-content">正文还空着，返回编辑开始创作吧。</p>}</div></article></div>}
    {error && <p className="my-articles-error" role="alert">{error}</p>}
    <p className="my-articles-notice" role="status">{notice}</p>
    <p className="my-articles-storage-note">{storageNotice || '草稿仅保存在当前浏览器，尚未公开发布。'}</p>
  </div>
}
