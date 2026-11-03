import { useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight } from './icons'
import { communityPosts as posts, communityCategories as categories, communityArticleUrl } from './communityPosts'
import type { CommunityCategory as Category, CommunityPost } from './communityPosts'
import { useCommunitySaved } from './useCommunitySaved'

function Bookmark({ filled }: { filled: boolean }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d="M6 4h12v17l-6-4-6 4V4Z" /></svg>
}

export default function CommunitySection() {
  const [category, setCategory] = useState<Category>('全部动态')
  const { saved, toggleSaved, storageNotice } = useCommunitySaved()
  const [savedOnly, setSavedOnly] = useState(false)
  const savedFilterRef = useRef<HTMLButtonElement>(null)
  const allFilterRef = useRef<HTMLButtonElement>(null)
  const filtered = posts.filter(post => (category === '全部动态' || post.category === category) && (!savedOnly || saved.includes(post.id)))

  function toggleSave(id: string) {
    const removing = saved.includes(id)
    toggleSaved(id)
    if (removing && savedOnly) requestAnimationFrame(() => savedFilterRef.current?.focus({ preventScroll: true }))
  }

  function saveButton(post: CommunityPost) {
    const isSaved = saved.includes(post.id)
    return <button className="community-bookmark" aria-pressed={isSaved} aria-label={`${isSaved ? '取消收藏' : '收藏'}：${post.title}`} onClick={() => toggleSave(post.id)}><Bookmark filled={isSaved} /><span>{isSaved ? '已收藏' : '收藏'}</span></button>
  }

  function browseAll() {
    setSavedOnly(false)
    setCategory('全部动态')
    requestAnimationFrame(() => allFilterRef.current?.focus({ preventScroll: true }))
  }

  function postCard(post: CommunityPost, featured = false) {
    return <article className={featured ? `community-feature${post.cover ? ' has-cover' : ''}` : 'community-feed-card'} key={post.id}>
      {featured && (post.cover ? <a className="community-feature-art community-photo-art" href={communityArticleUrl(post.id)} target="_blank" rel="noopener noreferrer" aria-label={`打开文章：${post.title}`}><img src={post.cover.src} alt={post.cover.alt} width={post.cover.width ?? 2276} height={post.cover.height ?? 1280} /></a> : <div className="community-feature-art" aria-hidden="true"><div className="community-art-grid" /><div className="community-art-orbit" /><span className="community-art-mark">{'{ YJ }'}</span><span className="community-art-chip chip-idea">01 / IDEA</span><span className="community-art-chip chip-build">02 / BUILD</span><span className="community-art-chip chip-share">03 / SHARE</span></div>)}
      <div className="community-post-meta"><span className="community-category">{post.category}</span><span className="community-readtime">{post.readTime}</span>{post.eventDate ? <time className="community-date" dateTime={post.eventDate}>活动回顾 · {post.eventDate.replaceAll('-', '.')}</time> : post.publishedAt && <time className="community-date" dateTime={post.publishedAt}>{post.publishedAt.replaceAll('-', '.')}</time>}</div>
      <a className="community-post-open" href={communityArticleUrl(post.id)} target="_blank" rel="noopener noreferrer" aria-label={`阅读：${post.title}`}><h3>{post.title}</h3><p>{post.summary}</p><span className="community-read-link">阅读全文 <ArrowUpRight size={15} /></span></a>
      <div className="community-post-footer"><span className="community-author"><span aria-hidden="true">Y</span>{post.author || '曜境社区 · 内容示例'}</span>{saveButton(post)}</div>
    </article>
  }

  return <section className="community-section section" id="community" aria-labelledby="community-title">
    <div className="wrap">
      <nav className="community-breadcrumb" aria-label="面包屑"><a href="/#home">首页</a><span aria-hidden="true">/</span><span aria-current="page">社区动态</span></nav>
      <div className="section-heading community-page-heading"><div><p className="eyebrow">YAOJING COMMUNITY</p><h1 id="community-title">社区动态</h1><p className="community-page-intro">与创造者同行，让灵感持续发生。</p><p>分享每一次探索，连接每一个想法。这里，有技术、有实践，也有同路人。</p></div><a className="community-return" href="/#home">返回首页 <ArrowUpRight size={16} /></a></div>
      <div className="community-toolbar"><div className="community-filters" role="group" aria-label="社区动态分类">{categories.map(item => <button key={item} ref={item === '全部动态' ? allFilterRef : undefined} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><button className="community-saved-filter" ref={savedFilterRef} aria-pressed={savedOnly} onClick={() => setSavedOnly(value => !value)}><Bookmark filled={savedOnly} />我的收藏 <span>{saved.length}</span></button></div>
      <p className="community-result-note" role="status">{savedOnly ? '已收藏' : category} · {filtered.length} 条动态</p>
      {filtered.length ? <div className="community-layout">{postCard(filtered[0], true)}{filtered.length > 1 && <div className="community-feed">{filtered.slice(1).map(post => postCard(post))}</div>}</div> : <div className="community-empty"><Bookmark filled={false} /><h3>{savedOnly ? '这里还没有收藏的动态' : '暂时没有相关动态'}</h3><p>发现感兴趣的内容时，点击收藏，方便下次继续阅读。</p><button onClick={browseAll}>浏览全部动态 <ArrowRight size={16} /></button></div>}
      <p className="community-note">部分动态为内容示例，已在作者信息处标注。<span role="status">{storageNotice}</span></p>
    </div>

  </section>
}
