import { useEffect } from 'react'
import { ArrowRight, ArrowUpRight } from './icons'
import { communityPosts, communityArticleUrl } from './communityPosts'
import { useCommunitySaved } from './useCommunitySaved'
import ArticleComments from './ArticleComments'
import './article-page.css'

// Temporarily hide the article discussion UI without changing stored comments.
const SHOW_ARTICLE_COMMENTS = false

export default function ArticlePage() {
  const id = new URLSearchParams(window.location.search).get('id')
  const post = communityPosts.find(item => item.id === id)
  const { saved, toggleSaved, storageNotice } = useCommunitySaved()
  useEffect(() => {
    document.title = post ? `${post.title} — 曜境社区` : '文章未找到 — 曜境社区'
  }, [post])

  if (!post) return <section className="article-not-found wrap" id="article-top"><p className="eyebrow">YAOJING COMMUNITY</p><h1>这篇文章暂未找到</h1><p>文章链接可能有误，返回社区发现更多内容。</p><a className="button" href="/community/">返回社区动态 <ArrowRight size={16} /></a></section>
  const related = communityPosts.filter(item => item.id !== post.id).slice(0, 2)
  return <div className="article-page">
    <section className="article-page-header" id="article-top">
      <div className="wrap">
        <nav className="community-breadcrumb" aria-label="面包屑"><a href="/#home">首页</a><span aria-hidden="true">/</span><a href="/community/">社区动态</a><span aria-hidden="true">/</span><span aria-current="page">文章详情</span></nav>
        <span className="article-category">{post.category}</span>
        <h1>{post.title}</h1>
        <p className="article-page-summary">{post.summary}</p>
        <div className="article-page-meta"><strong>{post.author || '曜境社区 · 内容示例'}</strong>{post.eventDate && <time className="article-event-date" dateTime={post.eventDate}>活动回顾 · {post.eventDate.replaceAll('-', '.')}</time>}{post.publishedAt && <time dateTime={post.publishedAt}>发布于 {post.publishedAt.replaceAll('-', '.')}</time>}<span>{post.readTime}</span>{SHOW_ARTICLE_COMMENTS && <a href="#article-comments">参与评论 ↓</a>}</div>
      </div>
    </section>
    <div className="article-columns wrap">
      <div className="article-primary">
        <article className="article-body" aria-label="文章正文">
          {post.cover && <figure className="article-cover"><img src={post.cover.src} alt={post.cover.alt} width={post.cover.width ?? 2276} height={post.cover.height ?? 1280} /><figcaption>{post.cover.caption}</figcaption></figure>}
          {post.introduction && <p className="article-introduction">{post.introduction}</p>}
          {post.sections.map((part, index) => <section className="article-body-section" id={`part-${index + 1}`} key={part.title}><h2><span>0{index + 1}</span>{part.title}</h2><p>{part.text}</p>{part.image && <figure className="article-inline-photo"><img src={part.image.src} alt={part.image.alt} width={part.image.width} height={part.image.height} loading="lazy" decoding="async" /><figcaption>{part.image.caption}</figcaption></figure>}</section>)}
          <div className="article-end"><span>感谢阅读，与曜境一起探索更多可能。</span><button className="article-save" aria-pressed={saved.includes(post.id)} onClick={() => toggleSaved(post.id)}>{saved.includes(post.id) ? '✓ 已收藏' : '＋ 收藏文章'}</button></div>
          <p className="article-storage-note">{storageNotice}</p>
        </article>
        {SHOW_ARTICLE_COMMENTS && <ArticleComments articleId={post.id} />}
        <section className="article-related" aria-label="继续阅读"><div><h2>继续探索</h2><a href="/community/">全部动态 <ArrowRight size={15} /></a></div>{related.map(item => <a href={communityArticleUrl(item.id)} key={item.id}><span>{item.category}</span><h3>{item.title}</h3><ArrowUpRight size={18} /></a>)}</section>
      </div>
      <aside className="article-sidebar" aria-label="文章导航"><p className="eyebrow">IN THIS ARTICLE</p><h2>本文目录</h2><nav aria-label="本文目录">{post.sections.map((part, index) => <a href={`#part-${index + 1}`} key={part.title}><span>0{index + 1}</span>{part.title}</a>)}</nav>{SHOW_ARTICLE_COMMENTS && <a className="article-comment-link" href="#article-comments">写下你的想法 <ArrowRight size={15} /></a>}<a className="article-back" href="/community/">← 返回社区动态</a></aside>
    </div>
  </div>
}
